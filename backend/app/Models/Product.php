<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'name',
        'description',
        'price',
        'old_price',
        'discount',
        'category',
        'condition_status',
        'stock',
        'main_image',
        'details',
        'design',
        'size',
    ];

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function orderItem()
    {
        return $this->hasOne(OrderItem::class);
    }
}
