<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Order;
use App\Models\CartItem;

class OrderController extends Controller
{
   // OrderController.php
   public function create(Request $request) {
    // Validáljuk a bejövő kérést
    $request->validate([
        'products' => 'required|array',
        'products.*.id' => 'required|exists:products,id',
        'products.*.quantity' => 'required|integer|min:1',
    ]);

    // Rendelés létrehozása
    $order = Order::create([
        'user_id' => auth()->id(),
        'status' => 'pending',
        'total_price' => 0,
    ]);

    $totalPrice = 0;

    // Rendelési tételek hozzáadása
    foreach ($request->products as $product) {
        // Termék ellenőrzése
        $item = Product::find($product['id']);
        if (!$item) {
            return response()->json(['message' => 'One or more products not found'], 404);
        }

        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->id,
            'quantity' => $product['quantity'],
            'price' => $item->price * $product['quantity'],
        ]);

        $totalPrice += $orderItem->price;
    }

    // Összesített ár frissítése
    $order->update(['total_price' => $totalPrice]);

    // Kosár kiürítése
    CartItem::where('user_id', auth()->id())->delete(); // Kiüríti a kosarat

    return response()->json([
        'message' => 'Order placed successfully.',
        'order_id' => $order->id,
        'total_price' => $totalPrice,
    ], 200);
}




}
