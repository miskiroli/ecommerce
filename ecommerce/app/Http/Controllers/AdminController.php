<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Support\Facades\Log;


class AdminController extends Controller
{
    // Kizárólag admin felhasználók férhetnek hozzá ehhez a kontrollerhez
    public function __construct()
    {
        $this->middleware('admin'); // Az admin middleware biztosítja, hogy csak admin jogosultságú felhasználók érhetik el
    }

    // Dashboard megjelenítése
    public function index()
    {
        // Statisztikák lekérése például a felhasználók, termékek és rendelések száma alapján
        $userCount = User::count();
        $productCount = Product::count();
        $orderCount = Order::count();

        return view('admin.dashboard', compact('userCount', 'productCount', 'orderCount'));
    }

    // Felhasználók listázása
    public function users()
    {
        $users = User::all();
        return view('admin.users.index', compact('users'));
    }

    // Termékek kezelése
    public function products()
    {
        $products = Product::all();
        return view('admin.products.index', compact('products'));
    }

    // Rendelések kezelése
    public function orders()
    {
        $orders = Order::all();
        return view('admin.orders', compact('orders'));
    }

    public function createProduct() {
        $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }
    public function storeProduct(Request $request) {
        \Log::info('StoreProduct function called.');
        
        // Validáció
        \Log::info('Validating request...');
        
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'category_id' => 'required|exists:categories,id',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:4096'
            ]);
            \Log::info('Validation successful. Proceeding to file handling.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed: ', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors())->withInput();
        }
    
        // Képfeltöltések kezelése
        $images = [];
    
        if ($request->hasfile('images')) {
            \Log::info('Files detected for upload.');
            foreach ($request->file('images') as $file) {
                \Log::info('Processing file: ', ['filename' => $file->getClientOriginalName()]);
    
                try {
                    $path = $file->store('images', 'public');
                    $images[] = $path;
                    \Log::info('File uploaded successfully to: ' . $path);
                } catch (\Exception $e) {
                    \Log::error('File upload error: ' . $e->getMessage());
                }
            }
        } else {
            \Log::info('No files were uploaded.');
        }
    
        // Termék létrehozása
        \Log::info('Creating product...');
        try {
            Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'category_id' => $request->category_id,
                'images' => json_encode($images), // Több kép JSON formátumban tárolva
            ]);
            \Log::info('Product created successfully.');
        } catch (\Exception $e) {
            \Log::error('Product creation error: ' . $e->getMessage());
        }
    
        return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
    }
    
    
    
   
    
    
    
    
    
    
    public function editProduct(Product $product) {
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
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
    
        $images = json_decode($product->images, true); // Az eddigi képeket lekérjük
    
        // Ellenőrizzük, hogy vannak-e képek, amiket el akarunk távolítani
        if ($request->has('remove_images')) {
            $imagesToRemove = $request->input('remove_images'); // Az eltávolítandó képek listája
            foreach ($imagesToRemove as $imagePath) {
                // Töröljük a képet a storage-ból
                \Storage::disk('public')->delete($imagePath);
                // Távolítsuk el a képet az adatbázisból (JSON tömbből)
                $images = array_filter($images, function($image) use ($imagePath) {
                    return $image !== $imagePath;
                });
            }
        }
    
        // Új képek feltöltése és hozzáadása a listához
        if ($request->hasfile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');
                $images[] = $path;
            }
        }
    
        // Frissítjük az adatbázist a validált adatokkal
        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category_id' => $validated['category_id'],
            'images' => json_encode($images), // Az új és régi képeket is elmentjük
        ]);
    
        return redirect()->route('admin.products.index')->with('success', 'Termék sikeresen frissítve!');
    }
    

    
    
    
    public function destroyProduct(Product $product) {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Termék sikeresen törölve!');
    }
}
