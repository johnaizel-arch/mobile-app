<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Liquidation extends Model
{
    protected $fillable = [
        'user_id',
        'employee',
        'purpose',
        'amount',
        'status',
        'date'
    ];
}