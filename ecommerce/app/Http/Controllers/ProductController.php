<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
class ProductController extends Controller
{
    // ProductController.php
public function index() {
    $products = Product::all();
    return view('products.index', compact('products'));
}

public function create() {
    $categories = Category::all();
    return view( 'products.create', compact('categories'));
}

public function store(Request $request) {
    $validated = $request->validate([
        'name' => 'required',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
    ]);

    Product::create($validated);
    return redirect()->route('products.index')->with('success', 'Product created successfully');
}

public function edit(Product $product) {
    $categories = Category::all();
    return view('products.edit', compact('product', 'categories'));
}

public function update(Request $request, Product $product) {
    $validated = $request->validate([
        'name' => 'required',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
    ]);

    $product->update($validated);
    return redirect()->route('products.index')->with('success', 'Product updated successfully');
}

public function destroy(Product $product) {
    $product->delete();
    return redirect()->route('products.index')->with('success', 'Product deleted successfully');
}


public function apiIndex() {
    try {
        $products = Product::with('category')->get();

        foreach ($products as $product) {
            // Log the product details
            \Log::info("Product: ", $product->toArray());

            if ($product->images) {
                $images = json_decode($product->images);
                foreach ($images as &$image) {
                    $image = asset('storage/' . $image);
                }
                $product->images = $images;
            } else {
                $product->images = [];
            }
        }

        return response()->json($products);
    } catch (\Exception $e) {
        \Log::error('Error fetching products: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch products'], 500);
    }
}
public function apiShow($id) {
    $product = Product::with('category')->findOrFail($id);
    $images = json_decode($product->images);  // Feltételezzük, hogy JSON-ben tárolt képek
    foreach ($images as &$image) {
        $image = asset('storage/' . $image);
    }
    $product->images = $images;
    return response()->json($product);
}



}