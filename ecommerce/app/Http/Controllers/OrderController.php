<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Order;

class OrderController extends Controller
{
   // OrderController.php
public function create(Request $request) {
    $order = Order::create([
        'user_id' => auth()->id(),
        'status' => 'pending',
        'total_price' => 0,
    ]);

    $totalPrice = 0;
    foreach ($request->products as $product) {
        $item = Product::find($product['id']);
        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item->id,
            'quantity' => $product['quantity'],
            'price' => $item->price * $product['quantity'],
        ]);

        $totalPrice += $orderItem->price;
    }

    $order->update(['total_price' => $totalPrice]);

    return redirect()->route('orders.show', $order);
}

}
