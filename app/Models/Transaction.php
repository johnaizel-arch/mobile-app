<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    // This tells Laravel which table to use
    protected $table = 'transactions';

    // This allows your React app to "throw" these specific fields
    protected $fillable = [
        'title', 
        'amount', 
        'type', 
        'status', 
        'user_id', 
        'date'
    ];
}