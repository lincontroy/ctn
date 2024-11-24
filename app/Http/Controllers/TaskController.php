<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

/**
 * Handles task management actions such as creating, updating, and deleting tasks.
 */
class TaskController extends Controller
{
    /**
     * Display tasks with optional status filtering.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function listTasks(Request $request): \Inertia\Response
    {
        $statusFilter = $request->input('status');

        $tasks = Task::when($statusFilter, function ($query, $statusFilter) {
            return $query->where('status', $statusFilter);
        })->paginate(5);

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'selectedStatus' => $statusFilter,
        ]);
    }

    /**
     * Show the form to create a new task.
     *
     * @return \Inertia\Response
     */
    public function showCreateForm(): \Inertia\Response
    {
        return Inertia::render('Tasks/Create');
    }

    /**
     * Store a new task in the database.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function createTask(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'required|date',
        ]);

        Task::create($validatedData);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display a specific task.
     *
     * @param Task $task
     * @return \Inertia\Response
     */
    public function showTask(Task $task): \Inertia\Response
    {
        return Inertia::render('Tasks/Show', ['task' => $task]);
    }

    /**
     * Show the form to edit a task.
     *
     * @param Task $task
     * @return \Inertia\Response
     */
    public function showEditForm(Task $task): \Inertia\Response
    {
        return Inertia::render('Tasks/Edit', ['task' => $task]);
    }

    /**
     * Update a task in the database.
     *
     * @param Request $request
     * @param Task $task
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateTask(Request $request, Task $task): \Illuminate\Http\RedirectResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'required|date',
        ]);

        $task->update($validatedData);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Delete a task from the database.
     *
     * @param Task $task
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteTask(Task $task): \Illuminate\Http\RedirectResponse
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}