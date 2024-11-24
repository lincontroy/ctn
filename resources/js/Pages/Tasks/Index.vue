<template>
  <div>
    <h1>Task List</h1>

    <div v-if="$page.props.flash.success" class="text-green-500">
      {{ $page.props.flash.success }}
    </div>

    <div class="mb-4">
      <label for="status">Filter by Status:</label>
      <select id="status" v-model="status">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <button @click="applyFilter" class="bg-blue-500 text-white p-2 ml-2">
        Apply Filter
      </button>
      <button @click="resetFilter" class="bg-gray-500 text-white p-2 ml-2">
        Reset Filter
      </button>
    </div>

    <div class="mb-4">
      <p v-if="status">Selected Filter: {{ getStatusText() }}</p>
    </div>

    <button @click="createTask" class="bg-blue-500 text-white p-2 mb-4">
      Create New Task
    </button>

    <ul v-if="tasks.data && tasks.data.length">
      <li v-for="task in tasks.data" :key="task.id">
        {{ task.title }} - {{ task.status }}
        <button
          @click="editTask(task.id)"
          class="bg-yellow-500 text-white p-1 ml-2"
        >
          Edit
        </button>
        <button
          @click="deleteTask(task.id)"
          class="bg-red-500 text-white p-1 ml-2"
        >
          Delete
        </button>
      </li>
    </ul>
    <p v-else>No tasks available</p>

    <div class="mt-4">
      <button
        v-if="tasks.prev_page_url"
        @click="navigate(tasks.prev_page_url)"
        class="bg-gray-500 text-white p-2"
      >
        Previous
      </button>
      <button
        v-if="tasks.next_page_url"
        @click="navigate(tasks.next_page_url)"
        class="bg-gray-500 text-white p-2 ml-2"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { Inertia } from "@inertiajs/inertia";

export default {
  props: {
    tasks: Object,
    selectedStatus: String,
  },
  data() {
    return {
      status: this.selectedStatus || "",
    };
  },
  methods: {
    createTask() {
      Inertia.visit("/tasks/create");
    },
    editTask(id) {
      Inertia.visit(`/tasks/${id}/edit`);
    },
    deleteTask(id) {
      if (confirm("Are you sure you want to delete this task?")) {
        Inertia.delete(`/tasks/${id}`);
      }
    },
    applyFilter() {
      Inertia.visit("/tasks", { data: { status: this.status } });
    },
    resetFilter() {
      this.status = "";
      Inertia.visit("/tasks");
    },
    getStatusText() {
      const statusTexts = {
        pending: "Pending",
        in_progress: "In Progress",
        completed: "Completed",
      };
      return statusTexts[this.status] || "All";
    },
    navigate(url) {
      Inertia.visit(url);
    },
  },
};
</script>
