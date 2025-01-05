<?php
namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTAuthMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            // Ellenőrizzük, hogy van-e érvényes JWT token
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is invalid'], 401);
        }

        // Ha minden rendben, továbbengedjük a kérdést
        return $next($request);
    }
}
