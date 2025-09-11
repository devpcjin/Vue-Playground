<template>
  <div class="p-8 bg-white rounded-xl shadow-lg text-center">
    <h2>SVGO Optimizer</h2>
    <p>SVG 파일을 업로드하면 최적화된 SVG를 다운로드할 수 있습니다.</p>
    <input type="file" accept=".svg" @change="onFileChange" class="mt-4" />
    <div v-if="optimizedSvg" class="mt-8">
      <h3>최적화 결과</h3>
      <textarea readonly :value="optimizedSvg" rows="10" class="w-full mt-4"></textarea>
      <div class="flex flex-col gap-2 items-center my-6">
        <button
          @click="downloadOptimizedSvg"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          최적화 SVG 다운로드
        </button>
        <button
          class="px-5 py-2 text-base bg-royal-blue text-white border-none rounded cursor-pointer transition-colors hover:bg-blue-800"
          @click="showPreview = !showPreview"
        >
          {{ showPreview ? '닫기' : '미리 보기' }}
        </button>
      </div>
      <div v-if="showPreview">
        <div class="flex justify-center gap-12 mt-8">
          <div class="flex-1 flex flex-col items-center">
            <div class="font-bold text-royal-blue mb-2">Before</div>
            <div
              class="mx-auto flex justify-center items-center min-h-[120px] min-w-[180px] max-w-[480px] border border-blue-100 bg-blue-50 rounded-lg p-4"
              v-html="originalSvg"
            ></div>
            <div class="mt-2 text-gray-500 text-sm">
              {{ originalSize }} bytes ({{ originalSizeKB }} KB)
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="font-bold text-royal-blue mb-2">After</div>
            <div
              class="mx-auto flex justify-center items-center min-h-[120px] min-w-[180px] max-w-[480px] border border-blue-100 bg-blue-50 rounded-lg p-4"
              v-html="optimizedSvg"
            ></div>
            <div class="mt-2 text-gray-500 text-sm">
              {{ optimizedSize }} bytes ({{ optimizedSizeKB }} KB)
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMsg" class="text-red-600 mt-4">{{ errorMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// @ts-ignore
import { optimize } from 'svgo';

const optimizedSvg = ref('');
const originalSvg = ref('');
const errorMsg = ref('');
const showPreview = ref(false);

const originalSize = computed(() => (originalSvg.value ? new Blob([originalSvg.value]).size : 0));
const optimizedSize = computed(() =>
  optimizedSvg.value ? new Blob([optimizedSvg.value]).size : 0,
);
const originalSizeKB = computed(() => (originalSize.value / 1024).toFixed(2));
const optimizedSizeKB = computed(() => (optimizedSize.value / 1024).toFixed(2));

async function onFileChange(e: Event) {
  errorMsg.value = '';
  optimizedSvg.value = '';
  originalSvg.value = '';
  showPreview.value = false;
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (!file.name.endsWith('.svg')) {
    errorMsg.value = 'SVG 파일만 업로드 가능합니다.';
    return;
  }
  const text = await file.text();
  originalSvg.value = text;
  try {
    const result = optimize(text, { multipass: true });
    if (typeof result.data === 'string') {
      optimizedSvg.value = result.data;
    } else {
      errorMsg.value = '최적화 실패: 결과가 올바르지 않습니다.';
    }
  } catch (err: any) {
    errorMsg.value = '최적화 중 오류 발생: ' + err.message;
  }
}

function downloadOptimizedSvg() {
  const blob = new Blob([optimizedSvg.value], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'optimized.svg';
  a.click();
  URL.revokeObjectURL(url);
}
</script>
