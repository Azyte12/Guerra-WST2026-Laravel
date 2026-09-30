<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Products;
use App\Models\Reviews;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reviews>
 */
class ReviewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'product_id' => Products::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->paragraph(),
        ];
    }
}
