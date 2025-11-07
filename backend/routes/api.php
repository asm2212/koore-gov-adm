<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\AdminController;

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

// News routes
Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index']);
    Route::get('/{id}', [NewsController::class, 'show']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/', [NewsController::class, 'store']);
        Route::put('/{id}', [NewsController::class, 'update']);
        Route::delete('/{id}', [NewsController::class, 'destroy']);
    });
});

// Contact routes
Route::prefix('contact')->group(function () {
    Route::post('/', [ContactController::class, 'store']); // Public route
    
    Route::middleware('auth:api')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::get('/{id}', [ContactController::class, 'show']);
        Route::patch('/{id}/respond', [ContactController::class, 'markAsResponded']);
    });
});

// Docs routes
Route::prefix('docs')->group(function () {
    Route::get('/', [DocsController::class, 'index']);
    Route::get('/{id}', [DocsController::class, 'show']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/', [DocsController::class, 'store']);
        Route::put('/{id}', [DocsController::class, 'update']);
        Route::delete('/{id}', [DocsController::class, 'destroy']);
    });
});

// Admin routes
Route::prefix('admins')->middleware('auth:api')->group(function () {
    Route::get('/', [AdminController::class, 'index']);
    Route::get('/count', [AdminController::class, 'count']);
    Route::get('/{id}', [AdminController::class, 'show']);
    Route::post('/', [AdminController::class, 'store']);
    Route::put('/{id}', [AdminController::class, 'update']);
    Route::delete('/{id}', [AdminController::class, 'destroy']);
    Route::patch('/{id}/activate', [AdminController::class, 'activate']);
    Route::patch('/{id}/deactivate', [AdminController::class, 'deactivate']);
    Route::patch('/{id}/reset-password', [AdminController::class, 'resetPassword']);
});
