<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Models\Order;
use App\Models\Address;
use App\Models\Category;
use App\Models\Product;


class ProfileController extends Controller
{
    // Felhasználói adatok lekérése
    public function __construct()
{
    $this->middleware('auth:api');
    $this->middleware('admin')->only([
        'getAdminDashboard',
        'listUsers',
        'listProducts',
        'storeProduct',
        'editProduct',
        'updateProduct',
        'destroyProduct'
    ]);
}
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $address = Address::where('user_id', $user->id)->first();
    
        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email
            ],
            'address' => $address
        ]);
    }
    

    // Felhasználói adatok módosítása
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json(['message' => 'Profile updated successfully.']);
    }

    // Jelszó módosítása
    public function changePassword(Request $request)
    {
        $user = $request->user();
    
        // A mezőnevek javítása a validációhoz
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:8|confirmed',
        ]);
    
        // A currentPassword ellenőrzése
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }
    
        // Új jelszó mentése
        $user->update([
            'password' => Hash::make($request->newPassword),
        ]);
    
        return response()->json(['message' => 'Password updated successfully.']);
    }
    

    // Számlázási cím módosítása
   

    // Rendelési előzmények lekérése
    public function orderHistory(Request $request)
    {
        $user = $request->user();
    
        try {
            $orders = Order::where('user_id', $user->id)
                           ->with(['orderItems.product'])
                           ->orderBy('created_at', 'desc') // Legutóbbi rendelés elöl
                           ->get();
    
            if ($orders->isEmpty()) {
                return response()->json([]);
            }
    
            $ordersWithDetails = $orders->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'order_date' => $order->created_at->format('Y-m-d H:i:s'),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'items' => $order->orderItems->map(function ($item) {
                        return [
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'total_price' => $item->quantity * $item->price,
                        ];
                    }),
                ];
            });
    
            return response()->json($ordersWithDetails);
        } catch (\Exception $e) {
            \Log::error('Order history retrieval error: ' . $e->getMessage());
            return response()->json(['error' => 'A rendelési előzmények lekérése nem sikerült.'], 500);
        }
    }
    

    
public function getAddress(Request $request)
{
    $address = Address::where('user_id', $request->user()->id)->first();
    return response()->json(['address' => $address]);
}

public function updateAddress(Request $request)
{
    $request->validate([
        'address_line_1' => 'required|string',
        'city' => 'required|string',
        'postal_code' => 'required|string',
        'country' => 'required|string',
    ]);

    $address = Address::updateOrCreate(
        ['user_id' => $request->user()->id],
        [
            'address_line_1' => $request->address_line_1,
            'address_line_2' => $request->address_line_2,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
        ]
    );

    return response()->json(['message' => 'Address updated successfully', 'address' => $address]);
}
    
public function getAdminDashboard(Request $request)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized access'], 403);
        }

        return response()->json(['message' => 'Admin access granted']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Unauthorized or expired token'], 401);
    }
}
public function listUsers()
{
    try {
        $users = User::all();
        return response()->json(['users' => $users]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Felhasználók lekérése sikertelen.'], 500);
    }
}

public function listProducts()
{
    try {
        $products = Product::with('category')->get();
        
        // Az images JSON dekódolása
        $products->map(function ($product) {
            $product->images = json_decode($product->images, true);
            return $product;
        });

        return response()->json(['products' => $products]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Termékek lekérése sikertelen.'], 500);
    }
}

public function storeProduct(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $images = [];
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $path = $file->store('images', 'public');
            $images[] = ['url' => asset('storage/' . $path)];
        }
    }

    $product = Product::create([
        'name' => $validated['name'],
        'description' => $validated['description'],
        'price' => $validated['price'],
        'category_id' => $validated['category_id'],
        'images' => json_encode($images),
    ]);

    return response()->json(['message' => 'Product created successfully', 'product' => $product]);
}


public function editProduct(Product $product)
{
    $categories = Category::all();
    return response()->json(['product' => $product, 'categories' => $categories]);
}
public function updateProduct(Request $request, Product $product)
{
    $validated = $request->validate([
        'name' => 'required',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'category_id' => 'required|exists:categories,id',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    $images = json_decode($product->images, true);

    if ($request->has('remove_images')) {
        $imagesToRemove = $request->input('remove_images');
        foreach ($imagesToRemove as $imagePath) {
            \Storage::disk('public')->delete($imagePath);
            $images = array_filter($images, fn($image) => $image !== $imagePath);
        }
    }

    if ($request->hasfile('images')) {
        foreach ($request->file('images') as $file) {
            $path = $file->store('images', 'public');
            $images[] = $path;
        }
    }

    $product->update([
        'name' => $validated['name'],
        'description' => $validated['description'],
        'price' => $validated['price'],
        'stock' => $validated['stock'],
        'category_id' => $validated['category_id'],
        'images' => json_encode($images),
    ]);

    return response()->json(['message' => 'Product updated successfully']);
}
public function destroyProduct(Product $product)
{
    $product->delete();
    return response()->json(['message' => 'Product deleted successfully']);
}

}
