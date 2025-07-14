<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Mail\TaskAssigned;
use Mail;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    public function index()
    {
        return response()->json(Task::with('user')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,in_progress,completed',
            'deadline' => 'nullable|date',
        ]);

        $task = Task::create($validated);
        $user = \App\Models\User::find($validated['user_id']);

        // Send email
        Mail::to($user->email)->send(new TaskAssigned($task, $user));

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}
