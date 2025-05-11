<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;
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
        
        $products->map(function ($product) {
            $product->images = collect(json_decode($product->images, true))
                ->map(fn($image) => asset('storage/' . $image))
                ->toArray();
            return $product;
        });

        return response()->json(['products' => $products]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Termékek lekérése sikertelen.'], 500);
    }
}

public function storeProduct(Request $request)
{
    \Log::info('Beérkező request adatok:', $request->all());
    
    if ($request->hasFile('images')) {
        \Log::info('Beérkező képek:', [$request->file('images')]);
    } else {
        \Log::warning('Nincsenek képek a request-ben.');
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
        'images' => 'required|array',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        'stock' => 'required|integer|min:0',
    ]);

    // Ellenőrizzük, hogy a kategória valóban létezik-e
    $category = Category::find($validated['category_id']);
    if (!$category) {
        return response()->json(['error' => 'A megadott kategória nem létezik.'], 404);
    }

    $images = [];
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            try {
                $path = $file->store('images', 'public'); // Tárolás a 'public/images' mappában
                $images[] = $path;
                \Log::info("Kép sikeresen feltöltve: $path");
            } catch (\Exception $e) {
                // Ha hiba történik, töröljük az összes korábban feltöltött képet
                foreach ($images as $image) {
                    Storage::disk('public')->delete($image);
                }
                \Log::error("Kép feltöltési hiba: " . $e->getMessage());
                return response()->json(['error' => 'Hiba történt a képfeltöltés során.'], 500);
            }
        }
    }

    try {
        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category_id' => $validated['category_id'],
            'images' => json_encode($images), // Képek tárolása JSON formátumban
        ]);

        \Log::info('Új termék sikeresen létrehozva:', ['product' => $product]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('category')
        ]);
    } catch (\Exception $e) {
        \Log::error('Hiba a termék létrehozásakor: ' . $e->getMessage());
        return response()->json(['error' => 'Error while creating product'], 500);
    }
}



// Termék szerkesztése
public function editProduct(Product $product)
{
    $categories = Category::all();

   

    return response()->json(['product' => $product, 'categories' => $categories]);
}


// Termék frissítése
public function updateProduct(Request $request, $id)
{
    $product = Product::find($id);
    if (!$product) {
        return response()->json(['message' => 'Termék nem található'], 404);
    }

    // Update basic fields
    $fields = ['name', 'description', 'price', 'stock', 'category_id'];
    foreach ($fields as $field) {
        if ($request->has($field)) {
            $product->$field = $request->input($field);
        }
    }

    // Get current images
    $currentImages = json_decode($product->images, true) ?? [];
    
    // Handle existing images to keep/remove
    $existingImages = $request->input('existing_images', []);
    if (!is_array($existingImages)) {
        $existingImages = json_decode($existingImages, true) ?? [];
    }
    // Filter out null/empty values and keep only valid image paths
    $existingImages = array_filter($existingImages, fn($img) => !empty($img));

    // Handle new image uploads
    $uploadedImages = [];
    if ($request->hasFile('new_images')) {
        foreach ($request->file('new_images') as $index => $image) {
            if ($image && $image->isValid()) {
                $path = $image->store('images', 'public');
                $uploadedImages[$index] = $path;
            }
        }
    }

    // Merge images while preserving order
    $finalImages = [];
    for ($i = 0; $i < 4; $i++) {
        if (isset($uploadedImages[$i])) {
            // If new image is uploaded for this position
            $finalImages[$i] = $uploadedImages[$i];
        } elseif (isset($existingImages[$i]) && !empty($existingImages[$i])) {
            // Keep existing image if no new image uploaded
            $finalImages[$i] = $existingImages[$i];
        } elseif (isset($currentImages[$i])) {
            // Keep original image if nothing else specified
            $finalImages[$i] = $currentImages[$i];
        }
    }

    $product->images = json_encode(array_values($finalImages));
    $product->save();

    return response()->json([
        'message' => 'Termék frissítve!',
        'product' => $product
    ]);
}





























// Termék törlése
public function destroyProduct(Product $product)
{
    $images = json_decode($product->images, true);

    // Képek törlése
    foreach ($images as $image) {
        if (Storage::disk('public')->exists($image)) {
            Storage::disk('public')->delete($image);
        }
    }

    try {
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete product: ' . $e->getMessage()], 500);
    }
}


}
