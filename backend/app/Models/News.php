<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'author_id',
        'images',
        'category',
        'language',
    ];

    protected $casts = [
        'images' => 'array',
        'deleted_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];
}
