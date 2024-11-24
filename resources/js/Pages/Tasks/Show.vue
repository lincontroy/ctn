<template>
  <div>
    <h1 class="mb-4">Task Details</h1>

    <div v-if="task">
      <div class="mb-4"><strong>Title:</strong> {{ task.title }}</div>
      <div class="mb-4">
        <strong>Description:</strong> {{ task.description }}
      </div>
      <div class="mb-4"><strong>Status:</strong> {{ task.status }}</div>
      <div class="mb-4"><strong>Due Date:</strong> {{ task.due_date }}</div>
    </div>

    <div v-else>
      <p>Task not found or data is missing.</p>
    </div>

    <button @click="goBack" class="bg-blue-500 text-white p-2">
      Back to Tasks
    </button>
  </div>
</template>

<script>
export default {
  props: {
    task: Object,
  },
  setup(props) {
    const goBack = () => {
      window.history.back();
    };

    return { task: props.task, goBack };
  },
};
</script>
