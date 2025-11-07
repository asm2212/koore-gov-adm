<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Submit a new contact message (Public route)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        $contactMessage = ContactMessage::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Message submitted successfully.',
            'data' => $contactMessage,
        ], 201);
    }

    /**
     * Get all contact messages (Admin only)
     */
    public function index(Request $request): JsonResponse
    {
        // Check admin permission
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['error' => 'Forbidden: Admin access required.'], 403);
        }

        $query = ContactMessage::whereNull('deleted_at');

        if ($request->has('responded')) {
            $responded = $request->query('responded') === 'true';
            $query->where('responded', $responded);
        }

        $messages = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['messages' => $messages]);
    }

    /**
     * Get a single message by ID (Admin only)
     */
    public function show(string $id): JsonResponse
    {
        // Check admin permission
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['error' => 'Forbidden: Admin access required.'], 403);
        }

        $message = ContactMessage::whereNull('deleted_at')->find($id);

        if (!$message) {
            return response()->json(['error' => 'Message not found.'], 404);
        }

        return response()->json(['message' => $message]);
    }

    /**
     * Mark a message as responded (Admin only)
     */
    public function markAsResponded(string $id): JsonResponse
    {
        // Check admin permission
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['error' => 'Forbidden: Admin access required.'], 403);
        }

        $message = ContactMessage::whereNull('deleted_at')->find($id);

        if (!$message) {
            return response()->json(['error' => 'Message not found.'], 404);
        }

        $message->update(['responded' => true]);

        return response()->json([
            'message' => 'Message marked as responded.',
            'data' => $message,
        ]);
    }
}
