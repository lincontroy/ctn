'use client';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, X } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    deadline: Date;
    user_id: number;
    user?: {
        name: string;
    };
}

interface User {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/tasks' },
];

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        user_id: '',
        deadline: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            setNotification({ type: 'error', message: 'Failed to load tasks' });
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(data);
        } catch {
            setNotification({ type: 'error', message: 'Failed to load users' });
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const method = editingTask ? 'PUT' : 'POST';
        const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to save task');
            }

            setNotification({ type: 'success', message: `Task ${editingTask ? 'updated' : 'created'} successfully!` });
            setIsModalOpen(false);
            setEditingTask(null);
            setFormData({ title: '', description: '', status: 'pending', user_id: '' , deadline: '',});
            fetchTasks();
        } catch (err: any) {
            setNotification({ type: 'error', message: err.message });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            setNotification({ type: 'success', message: 'Task deleted successfully' });
            fetchTasks();
        }
    };

    const openModal = (task?: Task, view = false) => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                user_id: task.user_id.toString(),
                deadline: task.deadline || '',
            });
            setEditingTask(task);
            setIsViewMode(view);
        } else {
            setFormData({ title: '', description: '', status: 'pending', user_id: '',deadline:'' });
            setEditingTask(null);
            setIsViewMode(false);
        }
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {notification && (
                    <div className={`fixed top-4 right-4 p-4 rounded shadow-md ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {notification.message}
                    </div>
                )}

                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
                    <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">+ Add Task</button>
                </div>

                <div className="p-4">
                    <table className="min-w-full table-auto border text-sm dark:text-white">
                        <thead className="bg-gray-200 dark:bg-gray-800">
                            <tr>
                                <th className="p-2 border">Title</th>
                                <th className="p-2 border">User</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Deadline</th>
                                <th className="p-2 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="border hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="p-2 border">{task.title}</td>
                                    <td className="p-2 border">{task.user?.name}</td>
                                    <td className="p-2 border capitalize">{task.status.replace('_', ' ')}</td>
                                    <td className="p-2 border">{task.deadline || '—'}</td>
                                    <td className="p-2 border text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openModal(task, true)} className="text-blue-500"><Eye size={18} /></button>
                                            <button onClick={() => openModal(task)} className="text-green-500"><Pencil size={18} /></button>
                                            <button onClick={() => handleDelete(task.id)} className="text-red-500"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">No tasks found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                                <X size={20} />
                            </button>
                            <h3 className="text-xl mb-4 text-gray-800 dark:text-white">
                                {isViewMode ? 'Task Details' : editingTask ? 'Edit Task' : 'New Task'}
                            </h3>

                            <div className="space-y-4">
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Task Title"
                                    disabled={isViewMode}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    disabled={isViewMode}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                />
                                <select
                                    name="user_id"
                                    value={formData.user_id}
                                    onChange={handleInputChange}
                                    disabled={isViewMode}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <option value="">Assign to user</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    disabled={isViewMode}
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                >
                                 

                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <label className="block text-sm text-gray-700 dark:text-gray-300">Deadline</label>
                                    <input
                                        name="deadline"
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                        disabled={isViewMode}
                                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />


                                {!isViewMode && (
                                    <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded">
                                        {editingTask ? 'Update' : 'Create'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
