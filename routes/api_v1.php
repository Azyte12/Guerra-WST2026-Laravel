<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductsController;

Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('/categories', CategoryController::class);
Route::get('/products/queries', [ProductsController::class, 'queries']);
Route::apiResource('/products', ProductsController::class)->only(['index', 'show']);
