<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Create a new admin user
     */
    public function store(Request $request): JsonResponse
    {
        // Check if user is SUPER_ADMIN
        $user = Auth::user();
        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['error' => 'Forbidden: Super admin access required.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['ADMIN', 'WRITER'])],
        ]);

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'active' => true,
        ]);

        return response()->json([
            'message' => 'Admin created',
            'admin' => $admin->only(['id', 'name', 'email', 'role', 'active'])
        ], 201);
    }

    /**
     * Get all admin users
     */
    public function index(): JsonResponse
    {
        // Check if user is SUPER_ADMIN or ADMIN
        $user = Auth::user();
        if (!in_array($user->role, ['SUPER_ADMIN', 'ADMIN'])) {
            return response()->json(['error' => 'Forbidden: Admin access required.'], 403);
        }

        $admins = User::whereIn('role', ['ADMIN', 'WRITER', 'SUPER_ADMIN'])
                     ->where('deleted', false)
                     ->select(['id', 'name', 'email', 'role', 'active', 'created_at'])
                     ->orderBy('created_at', 'desc')
                     ->get();

        return response()->json($admins);
    }

    /**
     * Count admin users
     */
    public function count(): JsonResponse
    {
        $user = Auth::user();
        if (!in_array($user->role, ['SUPER_ADMIN', 'ADMIN'])) {
            return response()->json(['error' => 'Forbidden: Admin access required.'], 403);
        }

        $count = User::whereIn('role', ['ADMIN', 'WRITER', 'SUPER_ADMIN'])
                    ->where('deleted', false)
                    ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Get a specific admin user
     */
    public function show(string $id): JsonResponse
    {
        $user = Auth::user();
        if (!in_array($user->role, ['SUPER_ADMIN', 'ADMIN'])) {
            return response()->json(['error' => 'Forbidden: Admin access required.'], 403);
        }

        $admin = User::whereIn('role', ['ADMIN', 'WRITER', 'SUPER_ADMIN'])
                    ->where('deleted', false)
                    ->find($id);

        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        return response()->json($admin->only(['id', 'name', 'email', 'role', 'active', 'created_at']));
    }

    /**
     * Update an admin user
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();
        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['error' => 'Forbidden: Super admin access required.'], 403);
        }

        $admin = User::whereIn('role', ['ADMIN', 'WRITER'])
                    ->where('deleted', false)
                    ->find($id);

        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'role' => ['sometimes', 'required', Rule::in(['ADMIN', 'WRITER'])],
        ]);

        $admin->update($request->only(['name', 'email', 'role']));

        return response()->json([
            'message' => 'Admin updated',
            'admin' => $admin->only(['id', 'name', 'email', 'role', 'active'])
        ]);
    }

    /**
     * Delete an admin user (soft delete)
     */
    public function destroy(string $id): JsonResponse
    {
        $user = Auth::user();
        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['error' => 'Forbidden: Super admin access required.'], 403);
        }

        $admin = User::whereIn('role', ['ADMIN', 'WRITER'])
                    ->where('deleted', false)
                    ->find($id);

        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        $admin->update(['deleted' => true]);

        return response()->json(['message' => 'Admin deleted']);
    }

    /**
     * Activate an admin user
     */
    public function activate(string $id): JsonResponse
    {
        return $this->toggleActiveStatus($id, true);
    }

    /**
     * Deactivate an admin user
     */
    public function deactivate(string $id): JsonResponse
    {
        return $this->toggleActiveStatus($id, false);
    }

    /**
     * Reset admin password
     */
    public function resetPassword(string $id): JsonResponse
    {
        $user = Auth::user();
        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['error' => 'Forbidden: Super admin access required.'], 403);
        }

        $admin = User::whereIn('role', ['ADMIN', 'WRITER'])
                    ->where('deleted', false)
                    ->find($id);

        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        $newPassword = Str::random(12);
        $admin->update(['password' => Hash::make($newPassword)]);

        // In production, email this instead of returning it
        return response()->json([
            'message' => 'Password reset successfully',
            'newPassword' => $newPassword
        ]);
    }

    /**
     * Toggle active status helper method
     */
    private function toggleActiveStatus(string $id, bool $active): JsonResponse
    {
        $user = Auth::user();
        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['error' => 'Forbidden: Super admin access required.'], 403);
        }

        $admin = User::whereIn('role', ['ADMIN', 'WRITER'])
                    ->where('deleted', false)
                    ->find($id);

        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        $admin->update(['active' => $active]);

        $message = $active ? 'Admin activated' : 'Admin deactivated';

        return response()->json([
            'message' => $message,
            'admin' => $admin->only(['id', 'name', 'email', 'role', 'active'])
        ]);
    }
}
