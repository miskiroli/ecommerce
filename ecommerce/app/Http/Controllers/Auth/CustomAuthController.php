<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;

class CustomAuthController extends Controller
{
    public function checkLogin(Request $request)
    {
        // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
        if (Auth::check()) {
            return response()->json([
                'status' => 'success',
                'message' => 'User is authenticated',
                'user' => [
                    'name' => Auth::user()->name,
                    'role' => Auth::user()->role,
                ]
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'User is not authenticated'
            ], 401);
        }
    }
   

   

   
 
   
   // CustomAuthController.php
   public function login(Request $request)
   {
       $credentials = $request->only('email', 'password');
   
       if (Auth::attempt($credentials)) {
           $user = Auth::user();
           $token = JWTAuth::fromUser($user);
   
           return response()->json([
               'token' => $token,
               'user' => [
                   'id' => $user->id,
                   'name' => $user->name,
                   'email' => $user->email,
                   'role' => $user->role,
               ]
           ]);
       }
   
       return response()->json(['error' => 'Invalid credentials'], 401);
   }
   

   
   
   

   

       
   
   


   
   

    // Kijelentkezés
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
    
        if ($token) {
            Log::info('User attempting to logout', ['token' => $token]);
    
            try {
                // JWT Token invalidálása
                JWTAuth::invalidate(JWTAuth::parseToken());
                Log::info('User logged out successfully', ['token' => $token]);
    
                return response()->json(['message' => 'Successfully logged out']);
            } catch (JWTException $e) {
                Log::error('Logout failed', ['error' => $e->getMessage(), 'token' => $token]);
                return response()->json(['error' => 'Failed to logout, please try again'], 500);
            }
        }
    
        // Ha nincs token
        return response()->json(['error' => 'Token not provided'], 400);
    }
    
    

    // Regisztrációs oldal megjelenítése
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    // Regisztráció kezelése
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Regisztráció után azonnal bejelentkeztetjük a felhasználót és JWT-t adunk vissza
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'message' => 'Registration successful!',
        ]);
    }
}

