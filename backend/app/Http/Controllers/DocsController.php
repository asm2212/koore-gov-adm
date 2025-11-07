<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Doc;
use Illuminate\Support\Facades\Storage;

class DocsController extends Controller
{
    /**
     * Display a listing of documents
     */
    public function index(): JsonResponse
    {
        $docs = Doc::orderBy('created_at', 'desc')->get();
        return response()->json($docs);
    }

    /**
     * Store a newly created document
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,txt,xls,xlsx,ppt,pptx|max:10240', // 10MB max
        ]);

        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'File is required'], 400);
        }

        $file = $request->file('file');
        $path = $file->store('docs', 'public');
        $fileUrl = Storage::url($path);

        $doc = Doc::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'file_url' => $fileUrl,
            'file_type' => $file->getMimeType(),
        ]);

        return response()->json($doc, 201);
    }

    /**
     * Display the specified document
     */
    public function show(string $id): JsonResponse
    {
        $doc = Doc::find($id);

        if (!$doc) {
            return response()->json(['error' => 'Document not found'], 404);
        }

        return response()->json($doc);
    }

    /**
     * Update the specified document
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $doc = Doc::find($id);

        if (!$doc) {
            return response()->json(['error' => 'Document not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,txt,xls,xlsx,ppt,pptx|max:10240',
        ]);

        $updateData = $request->only(['title', 'description', 'category']);

        if ($request->hasFile('file')) {
            // Delete old file
            $oldPath = str_replace('/storage/', '', $doc->file_url);
            Storage::disk('public')->delete($oldPath);

            // Upload new file
            $file = $request->file('file');
            $path = $file->store('docs', 'public');
            $updateData['file_url'] = Storage::url($path);
            $updateData['file_type'] = $file->getMimeType();
        }

        $doc->update($updateData);

        return response()->json($doc);
    }

    /**
     * Remove the specified document
     */
    public function destroy(string $id): JsonResponse
    {
        $doc = Doc::find($id);

        if (!$doc) {
            return response()->json(['error' => 'Document not found'], 404);
        }

        // Delete file from storage
        $path = str_replace('/storage/', '', $doc->file_url);
        Storage::disk('public')->delete($path);

        // Delete from database
        $doc->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }
}
