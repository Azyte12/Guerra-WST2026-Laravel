<?php

namespace Database\Factories;
use App\Models\Orders;
use App\Models\Products;
use App\Models\OrderProducts;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderProducts>
 */
class OrderProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Orders::factory(),
            'product_id' => Products::factory(),
            'quantity' => $this->faker->numberBetween(1, 10),
        ];
    }
}
