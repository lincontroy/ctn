<template>
  <div>
    <h1>Task List</h1>

    <!-- Success -->
    <div v-if="$page.props.flash.success" class="text-green-500">
      {{ $page.props.flash.success }}
    </div>

    <!-- Button to create a new task -->
    <button @click="createTask" class="bg-blue-500 text-white p-2 mb-4">
      Create New Task
    </button>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} - {{ task.status }}
        <!-- Edit button -->
        <button
          @click="editTask(task.id)"
          class="bg-yellow-500 text-white p-1 ml-2"
        >
          Edit
        </button>
        <!-- Delete button -->
        <button
          @click="deleteTask(task.id)"
          class="bg-red-500 text-white p-1 ml-2"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { Inertia } from "@inertiajs/inertia";

export default {
  props: {
    tasks: Array,
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
  },
};
</script>