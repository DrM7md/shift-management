<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Shift;
use App\Models\Balance;
use App\Models\ActivityLog;
use Carbon\Carbon;

class ShiftService
{
    private array $dayNames = [
        'Saturday' => 'السبت',
        'Sunday' => 'الأحد',
        'Monday' => 'الإثنين',
        'Tuesday' => 'الثلاثاء',
        'Wednesday' => 'الأربعاء',
        'Thursday' => 'الخميس',
        'Friday' => 'الجمعة',
    ];

    public function generateSchedule(Carbon $startDate, int $days): array
    {
        $createdShifts = [];
        $currentDate = $startDate->copy();
        
        for ($i = 0; $i < $days; $i++) {
            $dayName = $this->dayNames[$currentDate->format('l')];
            
            if (!Shift::where('shift_date', $currentDate->format('Y-m-d'))->exists()) {
                $employee = $this->getNextEmployee($currentDate, $dayName);
                
                if ($employee) {
                    $rules = Shift::getShiftRules($dayName);
                    
                    $shift = Shift::create([
                        'shift_date' => $currentDate->format('Y-m-d'),
                        'day_name' => $dayName,
                        'employee_id' => $employee->id,
                        'start_time' => $rules['start_time'],
                        'end_time' => $rules['end_time'],
                        'has_extra_day' => $rules['has_extra_day'],
                        'status' => 'مجدول',
                    ]);
                    
                    $this->updateEmployeeOrder($employee, $dayName);
                    
                    if ($rules['has_extra_day']) {
                        $this->createBalance($employee, $currentDate, $dayName);
                    }
                    
                    $createdShifts[] = $shift;
                    
                    ActivityLog::log('create_shift', "تم جدولة مناوبة {$dayName} للموظف {$employee->name}", $shift);
                }
            }
            
            $currentDate->addDay();
        }
        
        return $createdShifts;
    }

    private function getNextEmployee(Carbon $date, string $dayName): ?Employee
    {
        $priorityEmployee = $this->getPriorityEmployee($date);
        if ($priorityEmployee) {
            return $priorityEmployee;
        }

        $orderColumn = in_array($dayName, ['السبت', 'الجمعة']) ? 'saturday_order' : 'thursday_order';
        
        return Employee::where('is_active', true)
            ->where('status', 'متاح')
            ->where(function ($query) use ($date) {
                $query->whereNull('return_from_leave')
                    ->orWhere('return_from_leave', '<=', $date->format('Y-m-d'));
            })
            ->orderBy($orderColumn)
            ->first();
    }

    private function getPriorityEmployee(Carbon $date): ?Employee
    {
        return Employee::where('is_active', true)
            ->where('status', 'متاح')
            ->where('return_type', 'سنوية')
            ->where('return_from_leave', '<=', $date->format('Y-m-d'))
            ->orderBy('return_from_leave')
            ->first();
    }

    private function updateEmployeeOrder(Employee $employee, string $dayName): void
    {
        $maxOrder = Employee::where('is_active', true)->count();
        
        if (in_array($dayName, ['السبت', 'الجمعة'])) {
            Employee::where('saturday_order', '>', $employee->saturday_order)
                ->decrement('saturday_order');
            $employee->saturday_order = $maxOrder;
        } else {
            Employee::where('thursday_order', '>', $employee->thursday_order)
                ->decrement('thursday_order');
            $employee->thursday_order = $maxOrder;
        }
        
        $employee->return_from_leave = null;
        $employee->return_type = null;
        $employee->save();
    }

    private function createBalance(Employee $employee, Carbon $shiftDate, string $dayName): void
    {
        $expiryDate = $shiftDate->copy()->addDays(7);
        
        Balance::create([
            'employee_id' => $employee->id,
            'earned_date' => $shiftDate->format('Y-m-d'),
            'expiry_date' => $expiryDate->format('Y-m-d'),
            'type' => $dayName === 'السبت' ? 'سبت' : 'جمعة',
            'status' => 'متاح',
        ]);
    }

    public function completeShift(Shift $shift): void
    {
        $shift->update(['status' => 'أتم']);
        ActivityLog::log('complete_shift', "أتم الموظف {$shift->employee->name} المناوبة", $shift);
    }

    public function assignSubstitute(Shift $shift, Employee $substitute, ?string $notes = null): void
    {
        $oldEmployee = $shift->employee;
        
        $shift->update([
            'substitute_id' => $substitute->id,
            'status' => 'بديل',
            'notes' => $notes,
        ]);
        
        if ($shift->has_extra_day) {
            $this->createBalance($substitute, Carbon::parse($shift->shift_date), $shift->day_name);
        }
        
        ActivityLog::log(
            'substitute_shift',
            "تم تبديل مناوبة {$oldEmployee->name} بـ {$substitute->name}",
            $shift
        );
    }

    public function getDayName(Carbon $date): string
    {
        return $this->dayNames[$date->format('l')];
    }
}
