<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Products;
use App\Models\Orders;
use App\Models\OrderProducts;
use App\Models\Reviews;
use App\Models\Address;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $categories = Category::factory(5)->create();

        $products = Products::factory(2000)
        ->recycle($categories)
        ->create();

        $users = User::factory(20)->create();

        $users->each(function ($user) {
            Address::factory(rand(1, 2))
                ->for($user)
                ->create();
        });

        $orders = $users->flatMap(function ($user) {
            return Orders::factory(rand(0, 5))
            ->for($user)
            ->create();
        });
        
        $orders->each(function ($orders) use ($products) {
            $orderProducts = $products->random(rand(1, 4));

            foreach ($orderProducts as $product) {
                OrderProducts::factory()
                    ->for($orders, 'order')
                    ->for($product, 'product')
                    ->create();
            }
        });

        $products->each(function ($product) use ($users) {
            $reviews = $users->random(rand(0, 8));

            foreach ($reviews as $user) {
                Reviews::factory()
                    ->for($user)
                    ->for($product, 'product')
                    ->create();
            }
        });



    }
}
