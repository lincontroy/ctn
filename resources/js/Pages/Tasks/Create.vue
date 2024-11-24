<template>
  <div>
    <h1>Create Task</h1>

    <div v-if="$page.props.flash.success" class="text-green-500">
      {{ $page.props.flash.success }}
    </div>

    <form @submit.prevent="submitForm">
      <div>
        <input
          v-model="form.title"
          type="text"
          placeholder="Task Title"
          class="border p-2"
        />
        <div v-if="form.errors.title" class="text-red-500">
          {{ form.errors.title }}
        </div>
      </div>

      <div>
        <textarea
          v-model="form.description"
          placeholder="Task Description"
          class="border p-2"
        ></textarea>
        <div v-if="form.errors.description" class="text-red-500">
          {{ form.errors.description }}
        </div>
      </div>

      <div>
        <select v-model="form.status" class="border p-2">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <div v-if="form.errors.status" class="text-red-500">
          {{ form.errors.status }}
        </div>
      </div>

      <div>
        <input v-model="form.due_date" type="date" class="border p-2" />
        <div v-if="form.errors.due_date" class="text-red-500">
          {{ form.errors.due_date }}
        </div>
      </div>

      <button type="submit" class="bg-blue-500 text-white p-2">Create</button>
    </form>
  </div>
</template>

<script>
import { useForm } from "@inertiajs/vue3";

export default {
  setup() {
    const form = useForm({
      title: "",
      description: "",
      status: "pending",
      due_date: "",
    });

    const submitForm = () => {
      form.post("/tasks");
    };

    return { form, submitForm };
  },
};
</script>
