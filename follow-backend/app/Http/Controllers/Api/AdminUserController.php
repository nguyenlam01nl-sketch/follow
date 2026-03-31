<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    // LIST + SEARCH + FILTER + PAGINATION
    public function index(Request $request)
    {
        $query = User::query();

        // search
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('username', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        // filter role
        if ($role = $request->role) {
            $query->where('role', $role);
        }

        // filter status
        if ($status = $request->status) {
            $query->where('status', $status);
        }

        $users = $query->latest()->paginate(10);

        return response()->json($users);
    }

    // DETAIL
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // UPDATE (role + status)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'role' => $request->role ?? $user->role,
            'status' => $request->status ?? $user->status,
        ]);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'user' => $user
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json([
            'message' => 'Xoá user thành công'
        ]);
    }
}