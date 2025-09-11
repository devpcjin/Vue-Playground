<template>
  <div class="flex gap-8">
    <!-- Zod Validation Form -->
    <div class="flex-1">
      <h2>Zod Validation</h2>
      <form @submit.prevent="validateZod" class="space-y-4">
        <div>
          <label class="inline-block w-12">이름:</label>
          <input v-model="zodName" type="text" class="mb-2" />
        </div>
        <div>
          <label class="inline-block w-12">나이:</label>
          <input v-model.number="zodAge" type="number" class="mb-2" />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Zod Validate
        </button>
      </form>
      <div v-if="zodResult" class="mt-4">
        <pre class="bg-gray-100 p-2 rounded">{{ zodResult }}</pre>
      </div>
    </div>

    <!-- Yup Validation Form -->
    <div class="flex-1">
      <h2>Yup Validation</h2>
      <form @submit.prevent="validateYup" class="space-y-4">
        <div>
          <label class="inline-block w-12">이름:</label>
          <input v-model="yupName" type="text" class="mb-2" />
        </div>
        <div>
          <label class="inline-block w-12">나이:</label>
          <input v-model.number="yupAge" type="number" class="mb-2" />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Yup Validate
        </button>
      </form>
      <div v-if="yupResult" class="mt-4">
        <pre class="bg-gray-100 p-2 rounded">{{ yupResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userSchema as zodUserSchema } from '@/validation/zodExample';
import { userSchema as yupUserSchema } from '@/validation/yupExample';

const zodName = ref('');
const zodAge = ref<number | null>(null);
const zodResult = ref('');

const yupName = ref('');
const yupAge = ref<number | null>(null);
const yupResult = ref('');

function validateZod() {
  const result = zodUserSchema.safeParse({ name: zodName.value, age: zodAge.value });
  if (result.success) {
    zodResult.value = '✅ 성공: ' + JSON.stringify(result.data, null, 2);
  } else {
    zodResult.value = '❌ 실패: ' + JSON.stringify(result.error.format(), null, 2);
  }
}

async function validateYup() {
  try {
    const data = await yupUserSchema.validate(
      { name: yupName.value, age: yupAge.value },
      { abortEarly: false },
    );
    yupResult.value = '✅ 성공: ' + JSON.stringify(data, null, 2);
  } catch (err: any) {
    if (err.inner) {
      const errors = err.inner.map((e: any) => e.message).join('\n');
      yupResult.value = '❌ 실패: ' + errors;
    } else {
      yupResult.value = '❌ 실패: ' + err.message;
    }
  }
}
</script>
