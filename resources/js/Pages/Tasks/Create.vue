<template>
  <div>
    <h1>Create Task</h1>
    <form @submit.prevent="submitForm">
      <input v-model="form.title" type="text" placeholder="Task Title" />
      <textarea
        v-model="form.description"
        placeholder="Task Description"
      ></textarea>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import { useForm } from "@inertiajs/inertia-vue3";

export default {
  setup() {
    const form = useForm({
      title: "",
      description: "",
      status: "pending",
      due_date: "",
    });

    function submitForm() {
      form.post("/tasks");
    }

    return { form, submitForm };
  },
};
</script>

