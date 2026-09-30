<?php

namespace App\Models;
use App\Models\User;
use App\Models\Products;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    /** @use HasFactory<\Database\Factories\OrdersFactory> */
    use HasFactory;

    public function products()
    {
        return $this->belongsToMany(Products::class, 'order_products')->withPivot('quantity');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function orderProducts() 
    {
        return $this->hasOne(OrderProducts::class, 'order_id');
    }
}

