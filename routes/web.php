<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('/employees/{employee}/details', [EmployeeController::class, 'details'])->name('employees.details');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    Route::post('/employees/reorder', [EmployeeController::class, 'reorder'])->name('employees.reorder');
    
    Route::get('/schedule', [ShiftController::class, 'index'])->name('schedule.index');
    Route::post('/schedule/generate', [ShiftController::class, 'generate'])->name('schedule.generate');
    Route::put('/schedule/{shift}', [ShiftController::class, 'update'])->name('schedule.update');
    Route::delete('/schedule/{shift}', [ShiftController::class, 'destroy'])->name('schedule.destroy');
    
    Route::get('/balances', [BalanceController::class, 'index'])->name('balances.index');
    Route::post('/balances/{balance}/use', [BalanceController::class, 'useBalance'])->name('balances.use');
    Route::post('/balances/expire-old', [BalanceController::class, 'expireOld'])->name('balances.expireOld');
    
    Route::get('/leaves', [LeaveRequestController::class, 'index'])->name('leaves.index');
    Route::post('/leaves', [LeaveRequestController::class, 'store'])->name('leaves.store');
    Route::post('/leaves/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leaves.approve');
    Route::post('/leaves/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leaves.reject');
    Route::post('/leaves/return', [LeaveRequestController::class, 'returnFromLeave'])->name('leaves.return');
    
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/monthly', [ReportController::class, 'monthly'])->name('reports.monthly');
    Route::get('/reports/employees', [ReportController::class, 'employees'])->name('reports.employees');
    Route::get('/reports/balances', [ReportController::class, 'balances'])->name('reports.balances');
    Route::get('/reports/logs', [ReportController::class, 'logs'])->name('reports.logs');
    
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings/update', [SettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/shifts', [SettingController::class, 'updateShiftSettings'])->name('settings.shifts');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
