<?php

namespace App\Models;
use App\Models\Category;
use App\Models\Orders;
use App\Models\OrderProducts;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    /** @use HasFactory<\Database\Factories\ProductsFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'price',
        'quantity',
        'status'
    ];

    public function orders()
    {
        return $this->belongsToMany(Orders::class, 'order_products')->withPivot('quantity');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderProducts()
    {
        return $this->hasOne(OrderProducts::class, 'product_id');
    }
}
