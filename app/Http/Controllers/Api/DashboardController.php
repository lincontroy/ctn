<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Auth;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {

        // dd(auth()->user());
        // dd(Auth::user());
        $user = auth()->user();

        $role=null;
        // dd($user->email);
        if($user->email=='lincolnmunene37@gmail.com'){
            $role='admin';
        }else{
            $role="user";
        }

        // dd($user);

        if ($role == 'admin' || $role =='') {
            return response()->json([
                'user_count' => User::count(),
                'all_tasks' => Task::count(),
                'user_id' => $user->id,
                'assigned_tasks' => Task::whereNotNull('user_id')->count(),
                'pending_tasks' => Task::where('status', 'pending')->count(),
                'completed_tasks' => Task::where('status', 'completed')->count(),
                'role' => 'admin',
            ]);
        } else {
            return response()->json([
                'user_id' => $user->id,
                'assigned_tasks' => Task::where('user_id', $user->id)->count(),
                'pending_tasks' => Task::where('user_id', $user->id)->where('status', 'pending')->count(),
                'completed_tasks' => Task::where('user_id', $user->id)->where('status', 'completed')->count(),
                'role' => 'user',
            ]);
        }
    }
}
