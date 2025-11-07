<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query('page', 1));
        $limit = min(50, (int) $request->query('limit', 10));
        
        $query = News::whereNull('deleted_at');
        
        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }
        
        if ($request->has('language')) {
            $query->where('language', $request->query('language'));
        }
        
        $total = $query->count();
        $news = $query->orderBy('created_at', 'desc')
                     ->skip(($page - 1) * $limit)
                     ->take($limit)
                     ->get();
        
        return response()->json([
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'totalPages' => ceil($total / $limit),
            'data' => $news,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => ['nullable', Rule::in(['TRENDING', 'TODAY', 'WEEKLY', 'GENERAL'])],
            'language' => ['nullable', Rule::in(['EN', 'AM'])],
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('news', 'public');
                $images[] = [
                    'url' => Storage::url($path),
                    'path' => $path,
                ];
            }
        }

        $news = News::create([
            'title' => $request->title,
            'content' => $request->content,
            'author_id' => Auth::id(),
            'category' => $request->category ?? 'GENERAL',
            'language' => $request->language,
            'images' => $images,
        ]);

        return response()->json(['data' => $news], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $news = News::whereNull('deleted_at')->find($id);
        
        if (!$news) {
            return response()->json(['error' => 'News not found'], 404);
        }

        return response()->json(['data' => $news]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $news = News::whereNull('deleted_at')->find($id);
        
        if (!$news) {
            return response()->json(['error' => 'News not found'], 404);
        }

        // Check permission
        $user = Auth::user();
        if ($user->id !== $news->author_id && $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Forbidden: You don\'t have permission to update this news'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'category' => ['nullable', Rule::in(['TRENDING', 'TODAY', 'WEEKLY', 'GENERAL'])],
            'language' => ['nullable', Rule::in(['EN', 'AM'])],
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $updateData = $request->only(['title', 'content', 'category', 'language']);

        if ($request->hasFile('images')) {
            // Delete old images
            if ($news->images) {
                foreach ($news->images as $image) {
                    if (isset($image['path'])) {
                        Storage::disk('public')->delete($image['path']);
                    }
                }
            }

            // Upload new images
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('news', 'public');
                $images[] = [
                    'url' => Storage::url($path),
                    'path' => $path,
                ];
            }
            $updateData['images'] = $images;
        }

        $news->update($updateData);

        return response()->json(['data' => $news]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $news = News::whereNull('deleted_at')->find($id);
        
        if (!$news) {
            return response()->json(['error' => 'News not found'], 404);
        }

        // Check permission
        $user = Auth::user();
        if ($user->id !== $news->author_id && $user->role !== 'ADMIN') {
            return response()->json(['error' => 'Forbidden: You don\'t have permission to delete this news'], 403);
        }

        // Delete images
        if ($news->images) {
            foreach ($news->images as $image) {
                if (isset($image['path'])) {
                    Storage::disk('public')->delete($image['path']);
                }
            }
        }

        // Soft delete
        $news->update(['deleted_at' => now()]);

        return response()->json(null, 204);
    }
}
