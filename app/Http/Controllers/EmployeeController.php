<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::where('is_active', true)
            ->withCount(['balances' => function ($query) {
                $query->where('status', 'متاح');
            }])
            ->orderBy('saturday_order')
            ->get();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'saturday_order' => 'nullable|integer',
            'thursday_order' => 'nullable|integer',
        ]);

        $maxOrder = Employee::max('saturday_order') ?? 0;
        
        $employee = Employee::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'saturday_order' => $validated['saturday_order'] ?? ($maxOrder + 1),
            'thursday_order' => $validated['thursday_order'] ?? ($maxOrder + 1),
        ]);

        ActivityLog::log('create_employee', "تم إضافة موظف جديد: {$employee->name}", $employee);

        return back()->with('success', 'تم إضافة الموظف بنجاح');
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'status' => 'required|in:متاح,إجازة مرضية,إجازة سنوية,غير متاح',
            'saturday_order' => 'nullable|integer',
            'thursday_order' => 'nullable|integer',
        ]);

        $oldValues = $employee->toArray();
        $employee->update($validated);

        ActivityLog::log('update_employee', "تم تحديث بيانات الموظف: {$employee->name}", $employee, $oldValues, $employee->toArray());

        return back()->with('success', 'تم تحديث بيانات الموظف بنجاح');
    }

    public function destroy(Employee $employee)
    {
        $name = $employee->name;
        
        $employee->shifts()->delete();
        $employee->balances()->delete();
        $employee->leaveRequests()->delete();
        $employee->delete();

        ActivityLog::log('delete_employee', "تم حذف الموظف: {$name}");

        return back()->with('success', 'تم حذف الموظف بنجاح');
    }

    public function details(Employee $employee)
    {
        return response()->json([
            'shifts' => $employee->shifts()->orderByDesc('shift_date')->limit(20)->get(),
            'balances' => $employee->balances()->orderByDesc('earned_date')->limit(20)->get(),
            'leaves' => $employee->leaveRequests()->orderByDesc('leave_date')->limit(20)->get(),
        ]);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:saturday,thursday',
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:employees,id',
            'orders.*.order' => 'required|integer',
        ]);

        $orderField = $validated['type'] === 'saturday' ? 'saturday_order' : 'thursday_order';

        foreach ($validated['orders'] as $data) {
            Employee::where('id', $data['id'])->update([
                $orderField => $data['order'],
            ]);
        }

        ActivityLog::log('reorder_employees', "تم إعادة ترتيب الموظفين ({$validated['type']})");

        return back()->with('success', 'تم تحديث الترتيب بنجاح');
    }
}
