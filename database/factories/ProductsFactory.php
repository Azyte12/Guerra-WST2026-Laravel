<?php

namespace Database\Factories;

use App\Models\Products;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends Factory<Product>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "category_id" => Category::factory(),
            'name' =>$this->faker->words(3, true),
            'description' =>$this->faker->sentence(),
            'price' =>$this->faker->randomFloat(2, 5, 500),
        ];
    }
}
