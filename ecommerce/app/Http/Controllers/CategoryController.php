<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    // CategoryController.php
public function index() {
    $categories = Category::all();
    return view('categories.index', compact('categories'));
}

public function create() {
    return view('categories.create');
}

public function store(Request $request) {
    $request->validate(['name' => 'required']);
    Category::create($request->all());
    return redirect()->route('categories.index')->with('success', 'Category created successfully');
}

public function edit(Category $category) {
    return view('categories.edit', compact('category'));
}

public function update(Request $request, Category $category) {
    $request->validate(['name' => 'required']);
    $category->update($request->all());
    return redirect()->route('categories.index')->with('success', 'Category updated successfully');
}

public function destroy(Category $category) {
    $category->delete();
    return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
}
public function apiIndex(): JsonResponse
    {
        try {
            $categories = Category::all(); // Az összes kategória lekérése
            return response()->json($categories);
        } catch (\Exception $e) {
            \Log::error('Error fetching categories: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch categories'], 500);
        }
    }
}
