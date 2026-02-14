<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    protected $fillable = [
        'name',
        'email',
        'status',
        'saturday_order',
        'thursday_order',
        'is_active',
        'return_from_leave',
        'return_type',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'return_from_leave' => 'date',
    ];

    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class);
    }

    public function balances(): HasMany
    {
        return $this->hasMany(Balance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function availableBalances(): HasMany
    {
        return $this->hasMany(Balance::class)->where('status', 'متاح');
    }
}
