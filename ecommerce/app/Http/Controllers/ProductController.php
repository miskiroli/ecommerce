<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        // Keresési logika: csak a név mezőben keres
        if ($request->has('q') && $request->q) {
            $searchQuery = strtolower($request->q);
            Log::info('Search query received in index', ['query' => $searchQuery]);
            $query->whereRaw('LOWER(name) LIKE ?', ["%$searchQuery%"]);
        }

        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('sort') && $request->sort === 'created_at') {
            $order = $request->input('order', 'desc');
            $query->orderBy('created_at', $order);
        }

        $page = $request->query('page', 1);
        $products = $query->paginate(10, ['*'], 'page', $page);

        $products->getCollection()->map(function ($product) {
            if ($product->images) {
                $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                $product->images = array_map(fn($image) => asset('storage/' . $image), $images ?? []);
            } else {
                $product->images = [];
            }
            return $product;
        });

        Log::info('Products fetched', ['count' => $products->count()]);
        return response()->json($products);
    }

    public function latest(Request $request)
    {
        $products = Product::with('category')
            ->inRandomOrder()
            ->take(6)
            ->get();

        $products->map(function ($product) {
            if ($product->images) {
                $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                $product->images = array_map(fn($image) => asset('storage/' . $image), $images ?? []);
            } else {
                $product->images = [];
            }
            return $product;
        });

        return response()->json(['data' => $products]);
    }

    public function popular(Request $request)
    {
        $products = Product::with('category')
            ->orderBy('price', 'asc')
            ->take(6)
            ->get();

        $products->map(function ($product) {
            if ($product->images) {
                $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                $product->images = array_map(fn($image) => asset('storage/' . $image), $images ?? []);
            } else {
                $product->images = [];
            }
            return $product;
        });

        return response()->json(['data' => $products]);
    }

    public function newArrivals(Request $request)
    {
        $products = Product::with('category')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $products->map(function ($product) {
            if ($product->images) {
                $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                $product->images = array_map(fn($image) => asset('storage/' . $image), $images ?? []);
            } else {
                $product->images = [];
            }
            return $product;
        });

        return response()->json(['data' => $products]);
    }

    public function create()
    {
        $categories = Category::all();
        return view('products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
        ]);

        Product::create($validated);
        return redirect()->route('products.index')->with('success', 'Product created successfully');
    }

    public function edit(Product $product)
    {
        $categories = Category::all();
        return view('products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product->update($validated);
        return redirect()->route('products.index')->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully');
    }

    public function apiIndex()
    {
        try {
            $products = Product::with('category')->get();

            foreach ($products as $product) {
                Log::info("Product: ", $product->toArray());

                if ($product->images) {
                    $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                    $product->images = array_map(fn($image) => asset('storage/' . $image), $images ?? []);
                } else {
                    $product->images = [];
                }
            }

            return response()->json(['data' => $products]);
        } catch (\Exception $e) {
            Log::error('Error fetching products: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch products'], 500);
        }
    }

    public function apiShow($id)
    {
        $product = Product::with('category')->findOrFail($id);
        $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
        $product->images = array_map(fn($image) => asset('storage/' . $image), $images ?? []);
        return response()->json($product);
    }
}