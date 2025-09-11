<template>
  <v-row class="w-full">
    <!-- Zod Validation Form -->
    <v-col col="8">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Zod Validation
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="validateZod">
            <v-text-field v-model="zodName" label="이름" variant="outlined" class="mb-4" />
            <v-text-field
              v-model.number="zodAge"
              label="나이"
              type="number"
              variant="outlined"
              class="mb-4"
            />
            <v-btn type="submit" color="primary" variant="elevated" block> Zod Validate </v-btn>
          </v-form>
        </v-card-text>
        <v-card-text v-if="zodResult">
          <v-alert :type="zodResult.includes('✅') ? 'success' : 'error'" variant="tonal">
            <pre class="text-caption text-left">{{ zodResult }}</pre>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Yup Validation Form -->
    <v-col>
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
          Yup Validation
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="validateYup">
            <v-text-field v-model="yupName" label="이름" variant="outlined" class="mb-4" />
            <v-text-field
              v-model.number="yupAge"
              label="나이"
              type="number"
              variant="outlined"
              class="mb-4"
            />
            <v-btn type="submit" color="success" variant="elevated" block> Yup Validate </v-btn>
          </v-form>
        </v-card-text>
        <v-card-text v-if="yupResult">
          <v-alert :type="yupResult.includes('✅') ? 'success' : 'error'" variant="tonal">
            <pre class="text-caption text-left">{{ yupResult }}</pre>
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
