<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate the incoming request
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // 2. Attempt to log the user in using 'username' and 'password'
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            return response()->json([
                'success' => true,
                'user' => [
                    'name' => $user->name,
                    'role' => $user->role,
                    'username' => $user->username
                ]
            ]);
        }

        // 3. If login fails, return error
        return response()->json([
            'success' => false, 
            'message' => 'Invalid Credentials'
        ], 401);
    }
}