<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Transaction;
use App\Models\Attendance;
use App\Models\LeaveRequest;


Route::patch('/users/change-password', function (Request $request) {

    $request->validate([
        'user_id' => 'required',
        'current_password' => 'required',
        'new_password' => 'required|min:6'
    ]);

    $user = DB::table('users')
        ->where('id', $request->user_id)
        ->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

    // CHECK CURRENT PASSWORD
    if (!Hash::check($request->current_password, $user->password)) {

        return response()->json([
            'message' => 'Current password is incorrect'
        ], 401);
    }

    // UPDATE PASSWORD
    DB::table('users')
        ->where('id', $request->user_id)
        ->update([
            'password' => Hash::make($request->new_password)
        ]);

    return response()->json([
        'message' => 'Password updated successfully'
    ]);
});


// =========================
// LEAVE REQUESTS
// =========================

// CREATE LEAVE REQUEST
Route::post('/leave-requests', function (Request $request) {

    try {

        $validated = $request->validate([
            'user_id' => 'required',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'reason' => 'required|string',
            'status' => 'required|string'
        ]);

        $leave = LeaveRequest::create($validated);

        return response()->json([
            'message' => 'Leave request submitted',
            'leave' => $leave
        ], 201);

    } catch (\Exception $e) {

        return response()->json([
            'message' => 'FAILED TO SAVE LEAVE',
            'error' => $e->getMessage()
        ], 500);

    }
});

// GET USER LEAVE REQUESTS
Route::get('/leave-requests', function (Request $request) {

    $userId = $request->query('user_id');

    return LeaveRequest::where('user_id', $userId)
        ->latest()
        ->get();
});


// UPDATE LEAVE STATUS
Route::patch('/leave-requests/{id}', function (Request $request, $id) {

    $request->validate([
        'status' => 'required|string'
    ]);

    $leave = LeaveRequest::find($id);

    if (!$leave) {
        return response()->json([
            'message' => 'Leave request not found'
        ], 404);
    }

    $leave->status = $request->status;

    $leave->save();

    return response()->json([
        'message' => 'Leave request updated',
        'leave' => $leave
    ]);
});

Route::post('/attendance', function (Request $request) {

    $request->validate([
        'user_id' => 'required',
        'time_in' => 'required',
        'status' => 'required|string'
    ]);

    $attendance = Attendance::create([
        'user_id' => $request->user_id,
        'time_in' => $request->time_in,
        'status' => $request->status
    ]);

    return response()->json([
        'message' => 'Time In recorded',
        'attendance' => $attendance
    ], 201);
});


Route::patch('/attendance/{id}', function (Request $request, $id) {

    $request->validate([
        'time_out' => 'required',
        'status' => 'required|string'
    ]);

    $attendance = Attendance::find($id);

    if (!$attendance) {
        return response()->json([
            'message' => 'Attendance not found'
        ], 404);
    }

    $attendance->time_out = $request->time_out;
    $attendance->status = $request->status;
    $attendance->save();

    return response()->json([
        'message' => 'Time Out recorded',
        'attendance' => $attendance
    ]);
});

Route::get('/attendance', function (Request $request) {

    $userId = $request->query('user_id');

    return Attendance::where('user_id', $userId)
        ->latest()
        ->get();
});
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = DB::table('users')
    ->whereRaw('LOWER(email) = ?', [strtolower(trim($request->email))])
    ->first();

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

    $request->validate([
        'title' => 'required|string',
        'amount' => 'required|numeric',
        'type' => 'required|in:in,out',
        'status' => 'required|string'
    ]);

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
});


// ✅ SEPARATE ROUTE
Route::patch('/transactions/{id}', function (Request $request, $id) {

    $request->validate([
        'status' => 'required|string'
    ]);

    $transaction = \App\Models\Transaction::find($id);

    if (!$transaction) {
        return response()->json([
            'message' => 'Transaction not found'
        ], 404);
    }

    $transaction->status = $request->status;

    $transaction->save();

    return response()->json([
        'message' => 'Status updated',
        'transaction' => $transaction
    ]);
});

Route::get('/transactions', function (Request $request) {

    $userId = $request->query('user_id');

    return Transaction::where('user_id', $userId)
        ->latest()
        ->get();
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

Route::get('/hr-data', function () {
    $employees = DB::table('users')
        ->where('role', 'employee') 
        ->get();
    
    return response()->json([
        'employees' => $employees->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'status' => 'active', 
                'avatar' => strtoupper(substr($user->name, 0, 2)),
                'department' => 'Operations'
            ];
        }),
        'leaveRequests' => LeaveRequest::latest()->get()
    ]);
});
// CREATE
Route::post('/liquidations', function (Request $request) {

    $request->validate([
        'user_id' => 'nullable',
        'employee' => 'required|string',
        'purpose' => 'required|string',
        'amount' => 'required|numeric'
    ]);

    $liq = \App\Models\Liquidation::create([
        'user_id' => $request->user_id,
        'employee' => $request->employee,
        'purpose' => $request->purpose,
        'amount' => $request->amount,
        'status' => 'pending',
        'date' => now()->format('M d, Y')
    ]);

    return response()->json([
        'message' => 'Liquidation submitted',
        'liquidation' => $liq
    ], 201);
});

// GET ALL
Route::get('/liquidations', function () {
    return \App\Models\Liquidation::latest()->get();
});

// GET USER LIQUIDATIONS
Route::get('/liquidations/user', function (Request $request) {

    $userId = $request->query('user_id');

    return \App\Models\Liquidation::where('user_id', $userId)
        ->latest()
        ->get();
});

// UPDATE STATUS
Route::patch('/liquidations/{id}', function (Request $request, $id) {

    $request->validate([
        'status' => 'required|string'
    ]);

    $liq = \App\Models\Liquidation::find($id);

    if (!$liq) {
        return response()->json([
            'message' => 'Liquidation not found'
        ], 404);
    }

    $liq->status = $request->status;
    $liq->save();

    return response()->json([
        'message' => 'Liquidation updated',
        'liquidation' => $liq
    ]);
});