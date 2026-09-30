<?php

namespace App\Models;
use App\Models\Orders;
use App\Models\Products;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderProducts extends Model
{
    /** @use HasFactory<\Database\Factories\OrderProductsFactory> */
    use HasFactory;

    public function order()
    {
        return $this->belongsTo(Orders::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}
