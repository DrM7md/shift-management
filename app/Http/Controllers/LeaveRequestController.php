<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\Employee;
use App\Models\Balance;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', '');
        
        $query = LeaveRequest::with(['employee', 'balance', 'approver']);
        
        if ($status) {
            $query->where('status', $status);
        }
        
        $leaves = $query->orderBy('created_at', 'desc')->get();
        $employees = Employee::where('is_active', true)->get();
        $pendingCount = LeaveRequest::where('status', 'معلق')->count();

        return Inertia::render('Leaves/Index', [
            'leaves' => $leaves,
            'employees' => $employees,
            'pendingCount' => $pendingCount,
            'currentStatus' => $status,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'leave_date' => 'required|date',
            'type' => 'required|in:رصيد سبت,رصيد جمعة,مرضية,سنوية,طارئة',
            'notes' => 'nullable|string',
        ]);

        $balanceId = null;
        
        if (in_array($validated['type'], ['رصيد سبت', 'رصيد جمعة'])) {
            $balanceType = $validated['type'] === 'رصيد سبت' ? 'سبت' : 'جمعة';
            $balance = Balance::where('employee_id', $validated['employee_id'])
                ->where('type', $balanceType)
                ->where('status', 'متاح')
                ->orderBy('expiry_date')
                ->first();
            
            if (!$balance) {
                return back()->withErrors(['error' => 'لا يوجد رصيد متاح من هذا النوع']);
            }
            
            $balanceId = $balance->id;
        }

        $leave = LeaveRequest::create([
            ...$validated,
            'balance_id' => $balanceId,
            'status' => 'معلق',
        ]);

        ActivityLog::log('create_leave', "طلب إجازة جديد للموظف {$leave->employee->name}", $leave);

        return back()->with('success', 'تم تقديم طلب الإجازة بنجاح');
    }

    public function approve(LeaveRequest $leaveRequest)
    {
        $leaveRequest->update([
            'status' => 'موافق',
            'approved_by' => auth()->id(),
        ]);

        if ($leaveRequest->balance_id) {
            $leaveRequest->balance->update([
                'status' => 'مستخدم',
                'used_date' => $leaveRequest->leave_date,
            ]);
        }

        $employee = $leaveRequest->employee;
        if (in_array($leaveRequest->type, ['سنوية', 'مرضية'])) {
            $employee->update([
                'status' => $leaveRequest->type === 'سنوية' ? 'إجازة سنوية' : 'إجازة مرضية',
            ]);
        }

        ActivityLog::log('approve_leave', "تمت الموافقة على طلب إجازة {$employee->name}", $leaveRequest);

        return back()->with('success', 'تمت الموافقة على طلب الإجازة');
    }

    public function reject(LeaveRequest $leaveRequest, Request $request)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $leaveRequest->update([
            'status' => 'مرفوض',
            'approved_by' => auth()->id(),
            'notes' => $validated['rejection_reason'] ?? $leaveRequest->notes,
        ]);

        ActivityLog::log('reject_leave', "تم رفض طلب إجازة {$leaveRequest->employee->name}", $leaveRequest);

        return back()->with('success', 'تم رفض طلب الإجازة');
    }

    public function returnFromLeave(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'return_date' => 'required|date',
            'return_type' => 'required|in:مناوبة,سنوية',
        ]);

        $employee = Employee::find($validated['employee_id']);
        $employee->update([
            'status' => 'متاح',
            'return_from_leave' => $validated['return_date'],
            'return_type' => $validated['return_type'],
        ]);

        ActivityLog::log('return_from_leave', "عاد الموظف {$employee->name} من الإجازة", $employee);

        return back()->with('success', 'تم تسجيل عودة الموظف بنجاح');
    }
}
