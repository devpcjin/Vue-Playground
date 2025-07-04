<template>
  <div style="display: flex; gap: 2rem">
    <!-- Zod Validation Form -->
    <div>
      <h2>Zod Validation</h2>
      <form @submit.prevent="validateZod">
        <div>
          <label>이름:</label>
          <input v-model="zodName" type="text" />
        </div>
        <div>
          <label>나이:</label>
          <input v-model.number="zodAge" type="number" />
        </div>
        <button type="submit">Zod Validate</button>
      </form>
      <div v-if="zodResult">
        <pre>{{ zodResult }}</pre>
      </div>
    </div>

    <!-- Yup Validation Form -->
    <div>
      <h2>Yup Validation</h2>
      <form @submit.prevent="validateYup">
        <div>
          <label>이름:</label>
          <input v-model="yupName" type="text" />
        </div>
        <div>
          <label>나이:</label>
          <input v-model.number="yupAge" type="number" />
        </div>
        <button type="submit">Yup Validate</button>
      </form>
      <div v-if="yupResult">
        <pre>{{ yupResult }}</pre>
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

<style scoped>
div {
  margin-bottom: 1rem;
}
label {
  display: inline-block;
  width: 3rem;
}
input {
  margin-bottom: 0.5rem;
}
pre {
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>
