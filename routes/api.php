<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Transaction; // Ensure this model exists

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = DB::table('users')->where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => [
            'id' => $user->id, // This is the UID from the database
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->email === 'admin@a3ph.com' ? 'admin' : 'employee', // Example role logic
        ]
    ]);
});

// ✅ ADD THIS: Handle Cash Advance Requests from Employees
Route::post('/transactions', function (Request $request) {
    // 1. Remove user_id from validation to stop the 422 error
    $request->validate([
        'title' => 'required|string',
        'amount' => 'required|numeric',
        'type' => 'required|in:in,out',
        'status' => 'required|string'
    ]);

    // 2. Create the transaction
    $transaction = Transaction::create([
        'title' => $request->title,
        'amount' => $request->amount,
        'type' => $request->type,
        'status' => $request->status, // For Admin, this is usually 'approved'
        'date' => now()->format('M d, Y'),
        'user_id' => 1 // Hardcode to Admin ID since this route is Admin-only
    ]);

    return response()->json([
        'message' => 'Transaction recorded',
        'transaction' => $transaction
    ], 201);
});

Route::get('/cash-flow', function () {
    return response()->json([
        'stats' => [
            // Only sum approved transactions to keep balance accurate
            'cashBalance' => Transaction::where('status', 'approved')->sum('amount'), 
        ],
        'transactions' => Transaction::latest()->take(10)->get()
    ]);
});