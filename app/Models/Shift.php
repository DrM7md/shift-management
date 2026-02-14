<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shift extends Model
{
    protected $fillable = [
        'shift_date',
        'day_name',
        'employee_id',
        'substitute_id',
        'status',
        'start_time',
        'end_time',
        'has_extra_day',
        'notes',
    ];

    protected $casts = [
        'shift_date' => 'date',
        'has_extra_day' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function substitute(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'substitute_id');
    }

    public static function getShiftRules(string $dayName): array
    {
        return match ($dayName) {
            'السبت' => [
                'start_time' => '13:00',
                'end_time' => '06:00',
                'has_extra_day' => true,
            ],
            'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء' => [
                'start_time' => '13:00',
                'end_time' => '06:00',
                'has_extra_day' => false,
            ],
            'الخميس' => [
                'start_time' => '13:00',
                'end_time' => '08:00',
                'has_extra_day' => false,
            ],
            'الجمعة' => [
                'start_time' => '13:00',
                'end_time' => '08:00',
                'has_extra_day' => true,
            ],
            default => [
                'start_time' => '13:00',
                'end_time' => '06:00',
                'has_extra_day' => false,
            ],
        };
    }
}
