<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Shift;
use App\Models\Balance;
use App\Models\LeaveRequest;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $todayShift = Shift::with('employee')
            ->where('shift_date', $today->format('Y-m-d'))
            ->first();

        $stats = [
            'totalEmployees' => Employee::where('is_active', true)->count(),
            'availableEmployees' => Employee::where('is_active', true)->where('status', 'متاح')->count(),
            'availableBalances' => Balance::where('status', 'متاح')->count(),
            'pendingRequests' => LeaveRequest::where('status', 'معلق')->count(),
        ];

        $nextSaturdayEmployee = Employee::where('is_active', true)
            ->where('status', 'متاح')
            ->orderBy('saturday_order')
            ->first();

        $expiringBalances = Balance::with('employee')
            ->where('status', 'متاح')
            ->where('expiry_date', '<=', $today->copy()->addDays(3)->format('Y-m-d'))
            ->where('expiry_date', '>=', $today->format('Y-m-d'))
            ->get();

        $recentShifts = Shift::with('employee')
            ->orderBy('shift_date', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'todayShift' => $todayShift,
            'nextSaturdayEmployee' => $nextSaturdayEmployee,
            'expiringBalances' => $expiringBalances,
            'recentShifts' => $recentShifts,
        ]);
    }
}
