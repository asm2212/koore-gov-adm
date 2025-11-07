<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doc extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'file_url',
        'file_type',
    ];
}
