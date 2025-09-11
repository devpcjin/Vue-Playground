<template>
  <v-container max-width="900">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-code-tags</v-icon>
        Zod vs Yup Playground
      </v-card-title>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-label class="text-h6 mb-2"> Zod Schema </v-label>
            <v-textarea
              v-model="zodSchemaText"
              rows="8"
              variant="outlined"
              class="font-monospace"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="text-h6 mb-2"> Yup Schema </v-label>
            <v-textarea
              v-model="yupSchemaText"
              rows="8"
              variant="outlined"
              class="font-monospace"
            />
          </v-col>
        </v-row>

        <v-row class="mb-4">
          <v-col cols="12">
            <v-label class="text-h6 mb-2">
              <v-icon class="mr-1">mdi-code-json</v-icon>
              Input Value (JSON or string)
            </v-label>
            <v-textarea v-model="inputText" rows="4" variant="outlined" class="font-monospace" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-btn @click="validateZod" color="primary" variant="elevated" block class="mb-4">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Zod Validate
            </v-btn>
            <v-alert
              v-if="zodResult"
              :type="
                zodResult.includes('✅')
                  ? 'success'
                  : zodResult.includes('❌')
                    ? 'error'
                    : 'warning'
              "
              variant="tonal"
            >
              <pre class="text-caption">{{ zodResult }}</pre>
            </v-alert>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn @click="validateYup" color="success" variant="elevated" block class="mb-4">
              <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
              Yup Validate
            </v-btn>
            <v-alert
              v-if="yupResult"
              :type="
                yupResult.includes('✅')
                  ? 'success'
                  : yupResult.includes('❌')
                    ? 'error'
                    : 'warning'
              "
              variant="tonal"
            >
              <pre class="text-caption">{{ yupResult }}</pre>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
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
