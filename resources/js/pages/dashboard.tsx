import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

const statusOptions = ['all', 'pending', 'in_progress', 'completed'] as const;

export default function Dashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [assignedTasks, setAssignedTasks] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [allTasks, setAllTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [tasks, setTasks] = useState<any[]>([]);
  const [role, setRole] = useState('');
  const [filter, setFilter] = useState<typeof statusOptions[number]>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/dashboard-summary');
        const data = res.data;

        console.log(data);
        setRole(data.role);
        if (data.role === 'admin') {
          setCustomerCount(data.user_count);
          setAllTasks(data.all_tasks);
        }

        setAssignedTasks(data.assigned_tasks);
        setUserId(data.user_id);

        setPendingTasks(data.pending_tasks);
        setCompletedTasks(data.completed_tasks);
      } catch (err) {
        console.error('Dashboard data error', err);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Tasks fetch error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchTasks();
  }, []);

  const userTasks = tasks.filter((task) => task.user_id === userId);

const filteredTasks =
  filter === 'all'
    ? userTasks
    : userTasks.filter((task) => task.status === filter);


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {role === 'admin' && (
            <div className="rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="mt-2 text-3xl font-bold">{customerCount.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-blue-100">All users</span>
            </div>
          )}

          {role === 'admin' && (
            <div className="rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">All Tasks</h2>
              <p className="mt-2 text-3xl font-bold">{allTasks.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-green-100">All tasks</span>
            </div>
          )}

          <div className="rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">Assigned Tasks</h2>
            <p className="mt-2 text-3xl font-bold">{assignedTasks.toLocaleString()}</p>
            <span className="block mt-1 text-sm text-teal-100">Assigned tasks</span>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">Pending Tasks</h2>
            <p className="mt-2 text-3xl font-bold">{pendingTasks.toLocaleString()}</p>
            <span className="block mt-1 text-sm text-purple-100">Pending tasks</span>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">Completed Tasks</h2>
            <p className="mt-2 text-3xl font-bold">{completedTasks.toLocaleString()}</p>
            <span className="block mt-1 text-sm text-indigo-100">Completed tasks</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 mt-6">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          {statusOptions.map((option) => (
            <button
              key={option}
              className={clsx(
                'px-3 py-1 text-sm rounded-full border',
                filter === option
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100'
              )}
              onClick={() => setFilter(option)}
            >
              {option.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Task Table */}
        {loading ? (
          <div className="mt-10 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200 mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{task.description || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={clsx(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          {
                            pending: 'bg-yellow-100 text-yellow-700',
                            in_progress: 'bg-blue-100 text-blue-700',
                            completed: 'bg-green-100 text-green-700',
                          }[task.status]
                        )}
                      >
                        {task.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {task.user?.name || 'Unassigned'}
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No tasks to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
