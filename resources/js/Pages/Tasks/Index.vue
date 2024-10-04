<template>
  <div>
    <h1>Task List</h1>

    <!-- Success -->
    <div v-if="$page.props.flash.success" class="text-green-500">
      {{ $page.props.flash.success }}
    </div>

    <!-- Filter by Status -->
    <div class="mb-4">
      <label for="status">Filter by Status:</label>
      <select id="status" v-model="status">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <!-- Button to apply the filter -->
      <button @click="applyFilter" class="bg-blue-500 text-white p-2 ml-2">
        Apply Filter
      </button>

      <!-- Button to reset the filter -->
      <button @click="resetFilter" class="bg-gray-500 text-white p-2 ml-2">
        Reset Filter
      </button>
    </div>

    <!-- Display the selected filter -->
    <div class="mb-4">
      <p v-if="status">Selected Filter: {{ getStatusText() }}</p>
    </div>

    <!-- Button to create a new task -->
    <button @click="createTask" class="bg-blue-500 text-white p-2 mb-4">
      Create New Task
    </button>

    <!-- Task List -->
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

    <!-- Pagination -->
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
    tasks: Array,
    selectedStatus: String,
  },
  data() {
    return {
      status: this.selectedStatus || "", // Initialize the status with the value from props
    };
  },
  methods: {
    /**
     * Redirects to the task creation page.
     */
    createTask() {
      Inertia.visit("/tasks/create");
    },

    /**
     * Redirects to the task edit page.
     *
     * @param {Number} id The ID of the task to edit.
     */
    editTask(id) {
      Inertia.visit(`/tasks/${id}/edit`);
    },

    /**
     * Deletes the task with the given ID after confirmation.
     *
     * @param {Number} id The ID of the task to delete.
     */
    deleteTask(id) {
      if (confirm("Are you sure you want to delete this task?")) {
        Inertia.delete(`/tasks/${id}`);
      }
    },

    /**
     * Applies the selected filter by status.
     */
    applyFilter() {
      Inertia.visit("/tasks", { data: { status: this.status } });
    },

    /**
     * Resets the filter by clearing the selected status.
     */
    resetFilter() {
      this.status = "";
      Inertia.visit("/tasks");
    },

    /**
     * Returns the text for the currently selected status filter.
     *
     * @returns {String} The text representation of the selected status.
     */
    getStatusText() {
      switch (this.status) {
        case "pending":
          return "Pending";
        case "in_progress":
          return "In Progress";
        case "completed":
          return "Completed";
        default:
          return "All";
      }
    },

    /**
     * Navigate to the given URL for pagination.
     *
     * @param {String} url The URL to navigate to.
     */
    navigate(url) {
      Inertia.visit(url);
    },
  },
};
</script>