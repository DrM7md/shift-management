<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Balance extends Model
{
    protected $fillable = [
        'employee_id',
        'earned_date',
        'expiry_date',
        'type',
        'status',
        'used_date',
    ];

    protected $casts = [
        'earned_date' => 'date',
        'expiry_date' => 'date',
        'used_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function isExpired(): bool
    {
        return $this->expiry_date->isPast() && $this->status === 'متاح';
    }

    public function isExpiringSoon(): bool
    {
        return $this->expiry_date->diffInDays(now()) <= 3 && $this->status === 'متاح';
    }
}
