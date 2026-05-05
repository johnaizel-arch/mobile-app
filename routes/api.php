<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

Route::post('/login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = DB::table('users')->where('email', $request->email)->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid password'
        ], 401);
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => $user
    ]);
});

// routes/api.php

Route::get('/cash-flow', function () {
    // This pulls your available balance and recent activity
    return response()->json([
        'stats' => [
            'cashBalance' => \App\Models\Transaction::sum('amount'), // Example logic
        ],
        'transactions' => \App\Models\Transaction::latest()->take(10)->get()
    ]);
});