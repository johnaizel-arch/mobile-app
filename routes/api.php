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
            'role' => strtolower($user->role),// Example role logic
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
        'status' => $request->status,
        'user_id' => $request->user_id,
        'date' => now()->format('M d, Y')
    ]);

    return response()->json([
        'message' => 'Transaction recorded',
        'transaction' => $transaction
    ], 201);
    
    Route::patch('/transactions/{id}', function (Request $request, $id) {
    $transaction = \App\Models\Transaction::findOrFail($id);
    $transaction->update(['status' => $request->status]);

    return response()->json([
        'message' => 'Status updated',
        'transaction' => $transaction
    ]);
});
});

Route::get('/cash-flow', function () {
    return response()->json([
        'stats' => [
            // Only sum approved transactions for the main balance
            'cashBalance' => Transaction::where('status', 'approved')->sum('amount'), 
        ],
        // ✅ ADD THIS: This feeds the horizontal scroller in the Admin POV
        'cashAdvances' => Transaction::where('status', 'pending')
            ->latest()
            ->get()
            ->map(function($item) {
                // Generate initials from the title (e.g., "Advance: Sarah" -> "S")
                $cleanName = str_replace('Advance: ', '', $item->title);
                return [
                    'id' => $item->id,
                    'employeeName' => $cleanName,
                    'amount' => $item->amount,
                    'status' => $item->status,
                    'initials' => strtoupper(substr($cleanName, 0, 2)) 
                ];
            }),
        // Show the 10 most recent approved movements in the Ledger
        'transactions' => Transaction::where('status', 'approved')->latest()->take(10)->get()
    ]);
});