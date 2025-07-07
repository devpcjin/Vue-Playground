<template>
  <div style="max-width: 900px; margin: 0 auto; padding: 2rem">
    <h2>Zod vs Yup Playground</h2>
    <div style="display: flex; gap: 2rem">
      <div style="flex: 1">
        <label><b>Zod Schema</b></label>
        <textarea
          v-model="zodSchemaText"
          rows="8"
          style="width: 100%; font-family: monospace"
        ></textarea>
      </div>
      <div style="flex: 1">
        <label><b>Yup Schema</b></label>
        <textarea
          v-model="yupSchemaText"
          rows="8"
          style="width: 100%; font-family: monospace"
        ></textarea>
      </div>
    </div>
    <div style="margin: 1.5rem 0">
      <label><b>Input Value (JSON or string)</b></label>
      <textarea v-model="inputText" rows="4" style="width: 100%; font-family: monospace"></textarea>
    </div>
    <div style="display: flex; gap: 2rem">
      <div style="flex: 1">
        <button @click="validateZod">Zod Validate</button>
        <div v-if="zodResult" style="margin-top: 1rem">
          <pre>{{ zodResult }}</pre>
        </div>
      </div>
      <div style="flex: 1">
        <button @click="validateYup">Yup Validate</button>
        <div v-if="yupResult" style="margin-top: 1rem">
          <pre>{{ yupResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as z from 'zod';
import * as yup from 'yup';

const zodSchemaText = ref(`z.object({
  name: z.string().min(2),
  age: z.number().min(0)
})`);
const yupSchemaText = ref(`yup.object({
  name: yup.string().min(2),
  age: yup.number().min(0)
})`);
const inputText = ref(`{"name": "홍길동", "age": 20}`);

const zodResult = ref('');
const yupResult = ref('');

function parseInput() {
  try {
    return JSON.parse(inputText.value);
  } catch {
    return inputText.value;
  }
}

function validateZod() {
  zodResult.value = '';
  try {
    const schema = Function('z', `return (${zodSchemaText.value})`)(z);
    const result = schema.safeParse(parseInput());
    if (result.success) {
      zodResult.value = '✅ 성공: ' + JSON.stringify(result.data, null, 2);
    } else {
      zodResult.value = '❌ 실패: ' + JSON.stringify(result.error.format(), null, 2);
    }
  } catch (e: any) {
    zodResult.value = '⚠️ 스키마 오류: ' + e.message;
  }
}

function validateYup() {
  yupResult.value = '';
  try {
    const schema = Function('yup', `return (${yupSchemaText.value})`)(yup);
    schema
      .validate(parseInput(), { abortEarly: false })
      .then((data: any) => {
        yupResult.value = '✅ 성공: ' + JSON.stringify(data, null, 2);
      })
      .catch((err: any) => {
        if (err.inner) {
          const errors = err.inner.map((e: any) => e.message).join('\n');
          yupResult.value = '❌ 실패: ' + errors;
        } else {
          yupResult.value = '❌ 실패: ' + err.message;
        }
      });
  } catch (e: any) {
    yupResult.value = '⚠️ 스키마 오류: ' + e.message;
  }
}
</script>
