<?php

namespace App\Http\Controllers;

use App\Http\Resources\V1\ProductResource;
use App\Models\Products;
use App\Traits\ApiResponses;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $products = Products::with('category')
            ->paginate(10);

        return $this->ok('Products retrieved successfully',
            ProductResource::collection($products));
    }

    public function show(Products $product)
    {
        $product->load('category');

        return $this->ok('Product retrieved successfully',
            new ProductResource($product));
    }

    public function queries()
    {
        $nameAndPrice = Products::select('name', 'price')->get();

        $productsWithCategory = Products::with('category')->get();

        $productsOrderedByPrice = Products::select('id', 'name')
            ->orderBy('price', 'asc')
            ->get();

        $firstFiveProducts = Products::limit(5)->get();

        $priceGreaterThanOrEqual = Products::where('price', '>=', 3)->get();

        $electronics = Products::whereHas('category', function ($q) {
            $q->where('name', 'Electronics');
        })->get();

        $totalPrice = Products::sum('price');

        $averagePrice = Products::avg('price');

        $highestPrice = Products::max('price');

        $lowestPrice = Products::min('price');

        $totalPricePerCategory = Products::join(
            'categories',
            'products.category_id',
            '=',
            'categories.id'
        )
            ->select(
                'categories.name',
                DB::raw('SUM(products.price) as total_price')
            )
            ->groupBy('categories.name')
            ->get();

        $averagePricePerCategory = Products::join(
            'categories',
            'products.category_id',
            '=',
            'categories.id'
        )
            ->select(
                'categories.name',
                DB::raw('AVG(products.price) as avg_price')
            )
            ->groupBy('categories.name')
            ->get();

        $lowestPricePerCategory = Products::join(
            'categories',
            'products.category_id',
            '=',
            'categories.id'
        )
            ->select(
                'categories.name',
                DB::raw('MIN(products.price) as min_price')
            )
            ->groupBy('categories.name')
            ->get();

        $averagePriceSorted = Products::join(
            'categories',
            'products.category_id',
            '=',
            'categories.id'
        )
            ->select(
                'categories.name',
                DB::raw('AVG(products.price) as avg_price')
            )
            ->groupBy('categories.name')
            ->orderBy('avg_price', 'asc')
            ->get();

        $electronicsAndBooks = Products::join(
            'categories',
            'products.category_id',
            '=',
            'categories.id'
        )
            ->whereIn('categories.name', ['Electronics', 'Books'])
            ->select(
                'categories.name',
                DB::raw('AVG(products.price) as avg_price')
            )
            ->groupBy('categories.name')
            ->get();

        $queryResults = [
            'name_and_price' => $nameAndPrice,
            'products_with_category' => $productsWithCategory,
            'products_ordered_by_price' => $productsOrderedByPrice,
            'first_five_products' => $firstFiveProducts,
            'price_greater_than_or_equal' => $priceGreaterThanOrEqual,
            'electronics' => $electronics,
            'sum' => $totalPrice,
            'avg' => $averagePrice,
            'max' => $highestPrice,
            'min' => $lowestPrice,
            'sum_per_category' => $totalPricePerCategory,
            'avg_per_category' => $averagePricePerCategory,
            'min_per_category' => $lowestPricePerCategory,
            'avg_per_category_sorted' => $averagePriceSorted,
            'electronics_and_books' => $electronicsAndBooks,
        ];

        return $this->ok('Query results retrieved successfully', $queryResults);

    }
}
