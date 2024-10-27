<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Log;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api'); // Csak bejelentkezett felhasználóknak
    }

    public function index()
    {
        $cartItems = CartItem::with('product')->where('user_id', Auth::id())->get();
        return response()->json($cartItems);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::find($request->product_id);
        $cartItem = CartItem::where('user_id', Auth::id())->where('product_id', $request->product_id)->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Product added to cart successfully']);
    }

    public function update(Request $request, $id)
{
    Log::info('Updating cart item', ['id' => $id, 'request' => $request->all()]);

    $request->validate([
        'quantity' => 'required|integer|min:0',
    ]);

    $cartItem = CartItem::where('user_id', Auth::id())->where('id', $id)->first();

    if (!$cartItem) {
        Log::warning('Cart item not found', ['id' => $id]);
        return response()->json(['message' => 'Cart item not found'], 404);
    }

    if ($request->quantity == 0) {
        $cartItem->delete();
        return response()->json(['message' => 'Cart item removed']);
    }

    $cartItem->quantity = $request->quantity;
    $cartItem->save();

    return response()->json(['message' => 'Cart item updated successfully']);
}


    public function remove($id)
    {
        $cartItem = CartItem::where('user_id', Auth::id())->where('id', $id)->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Cart item removed']);
    }
}
