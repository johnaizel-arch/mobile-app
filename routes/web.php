<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\AuthController;

// 1. This handles the web browser view
Route::get('/', [WelcomeController::class, 'index']);

// 2. This handles the Mobile App Login
Route::post('/login', [AuthController::class, 'login']);

// 3. Testing route (Visit http://YOUR_IP:8000/ping)
Route::get('/ping', function () {
    return response()->json(['message' => 'Connection successful!']);
});