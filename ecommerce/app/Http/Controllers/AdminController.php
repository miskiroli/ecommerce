<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;

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
        $validated = $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
        ]);
    
        Product::create($validated);
        return redirect()->route('admin.products')->with('success', 'Termék sikeresen létrehozva!');
    }
    
    public function editProduct(Product $product) {
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }
    
    public function updateProduct(Request $request, Product $product) {
        $validated = $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
        ]);
    
        $product->update($validated);
        return redirect()->route('admin.products')->with('success', 'Termék sikeresen frissítve!');
    }
    
    public function destroyProduct(Product $product) {
        $product->delete();
        return redirect()->route('admin.products')->with('success', 'Termék sikeresen törölve!');
    }
}
