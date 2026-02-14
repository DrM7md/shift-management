<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\Employee;
use App\Models\Balance;
use App\Models\LeaveRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function monthly(Request $request)
    {
        $month = $request->get('month', Carbon::today()->format('Y-m'));
        $startDate = Carbon::parse($month)->startOfMonth();
        $endDate = Carbon::parse($month)->endOfMonth();

        $shifts = Shift::with('employee')
            ->whereBetween('shift_date', [$startDate, $endDate])
            ->orderBy('shift_date')
            ->get();

        $stats = [
            'total' => $shifts->count(),
            'completed' => $shifts->where('status', 'أتم')->count(),
            'substituted' => $shifts->where('status', 'بديل')->count(),
            'absent' => $shifts->where('status', 'غائب')->count(),
        ];

        return response()->json([
            'shifts' => $shifts,
            'stats' => $stats,
            'month' => $month,
        ]);
    }

    public function employees()
    {
        $employees = Employee::where('is_active', true)
            ->withCount([
                'shifts',
                'shifts as completed_shifts_count' => function ($query) {
                    $query->where('status', 'أتم');
                },
                'balances as available_balances_count' => function ($query) {
                    $query->where('status', 'متاح');
                },
            ])
            ->get();

        return response()->json([
            'employees' => $employees,
        ]);
    }

    public function balances()
    {
        $balances = Balance::with('employee')
            ->selectRaw('
                type,
                status,
                COUNT(*) as count
            ')
            ->groupBy('type', 'status')
            ->get();

        $byEmployee = Employee::where('is_active', true)
            ->withCount([
                'balances as available_count' => function ($query) {
                    $query->where('status', 'متاح');
                },
                'balances as used_count' => function ($query) {
                    $query->where('status', 'مستخدم');
                },
                'balances as expired_count' => function ($query) {
                    $query->where('status', 'منتهي');
                },
            ])
            ->get();

        return response()->json([
            'summary' => $balances,
            'byEmployee' => $byEmployee,
        ]);
    }

    public function logs(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get();

        return response()->json([
            'logs' => $logs,
        ]);
    }
}
