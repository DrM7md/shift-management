<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\Employee;
use App\Models\ActivityLog;
use App\Services\ShiftService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ShiftController extends Controller
{
    public function __construct(private ShiftService $shiftService)
    {
    }

    public function index(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::today()->subDays(7)->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::today()->addDays(30)->format('Y-m-d'));

        $shifts = Shift::with(['employee', 'substitute'])
            ->whereBetween('shift_date', [$startDate, $endDate])
            ->orderBy('shift_date')
            ->get();

        $employees = Employee::where('is_active', true)->get();

        return Inertia::render('Schedule/Index', [
            'shifts' => $shifts,
            'employees' => $employees,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'days' => 'required|integer|min:1|max:365',
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $shifts = $this->shiftService->generateSchedule($startDate, $validated['days']);

        return back()->with('success', 'تم توليد ' . count($shifts) . ' مناوبة بنجاح');
    }

    public function update(Request $request, Shift $shift)
    {
        $validated = $request->validate([
            'status' => 'required|in:مجدول,أتم,غائب,بديل',
            'substitute_id' => 'nullable|exists:employees,id',
            'notes' => 'nullable|string',
        ]);

        $oldValues = $shift->toArray();

        if ($validated['status'] === 'بديل' && $validated['substitute_id']) {
            $substitute = Employee::find($validated['substitute_id']);
            $this->shiftService->assignSubstitute($shift, $substitute, $validated['notes'] ?? null);
        } else {
            $shift->update($validated);
            ActivityLog::log('update_shift', "تم تحديث حالة المناوبة", $shift, $oldValues, $shift->toArray());
        }

        return back()->with('success', 'تم تحديث المناوبة بنجاح');
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();
        ActivityLog::log('delete_shift', "تم حذف مناوبة بتاريخ {$shift->shift_date}");
        return back()->with('success', 'تم حذف المناوبة بنجاح');
    }
}
