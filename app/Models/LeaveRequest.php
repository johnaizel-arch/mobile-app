<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'start_date',
        'end_date',
        'reason',
        'status',
    ];
    protected $casts = [
    'user_id' => 'integer',
    'start_date' => 'date',
    'end_date' => 'date',
];
}