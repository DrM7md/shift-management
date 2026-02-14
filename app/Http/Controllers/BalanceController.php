<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use App\Models\Employee;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class BalanceController extends Controller
{
    public function index()
    {
        $balances = Balance::with('employee')
            ->orderBy('expiry_date')
            ->get();

        $stats = [
            'available' => Balance::where('status', 'متاح')->count(),
            'expiring' => Balance::where('status', 'متاح')
                ->where('expiry_date', '<=', Carbon::today()->addDays(3)->format('Y-m-d'))
                ->where('expiry_date', '>=', Carbon::today()->format('Y-m-d'))
                ->count(),
            'expired' => Balance::where('status', 'منتهي')->count(),
        ];

        return Inertia::render('Balances/Index', [
            'balances' => $balances,
            'stats' => $stats,
        ]);
    }

    public function useBalance(Balance $balance, Request $request)
    {
        $validated = $request->validate([
            'used_date' => 'required|date',
        ]);

        if ($balance->status !== 'متاح') {
            return back()->withErrors(['error' => 'هذا الرصيد غير متاح']);
        }

        $balance->update([
            'status' => 'مستخدم',
            'used_date' => $validated['used_date'],
        ]);

        ActivityLog::log('use_balance', "استخدم الموظف {$balance->employee->name} رصيده", $balance);

        return back()->with('success', 'تم استخدام الرصيد بنجاح');
    }

    public function expireOld()
    {
        $expired = Balance::where('status', 'متاح')
            ->where('expiry_date', '<', Carbon::today()->format('Y-m-d'))
            ->update(['status' => 'منتهي']);

        ActivityLog::log('expire_balances', "تم تحديث {$expired} رصيد منتهي");

        return back()->with('success', "تم تحديث {$expired} رصيد منتهي");
    }
}
