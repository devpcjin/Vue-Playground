<template>
  <div class="svgo-optimizer-page">
    <h2>SVGO Optimizer</h2>
    <p>SVG 파일을 업로드하면 최적화된 SVG를 다운로드할 수 있습니다.</p>
    <input type="file" accept=".svg" @change="onFileChange" />
    <div v-if="optimizedSvg" class="result-block">
      <h3>최적화 결과</h3>
      <textarea readonly :value="optimizedSvg" rows="10" style="width: 100%"></textarea>
      <div class="button-col">
        <button @click="downloadOptimizedSvg">최적화 SVG 다운로드</button>
        <button class="preview-toggle" @click="showPreview = !showPreview">
          {{ showPreview ? '닫기' : '미리 보기' }}
        </button>
      </div>
      <div v-if="showPreview">
        <div class="svg-compare-block">
          <div class="svg-preview-col">
            <div class="svg-preview-label">Before</div>
            <div class="svg-preview" v-html="originalSvg"></div>
            <div class="svg-size">{{ originalSize }} bytes ({{ originalSizeKB }} KB)</div>
          </div>
          <div class="svg-preview-col">
            <div class="svg-preview-label">After</div>
            <div class="svg-preview" v-html="optimizedSvg"></div>
            <div class="svg-size">{{ optimizedSize }} bytes ({{ optimizedSizeKB }} KB)</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
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

<style scoped>
.svgo-optimizer-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  text-align: center;
}
.result-block {
  margin-top: 2rem;
}
.button-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin: 1.5rem 0 0.5rem 0;
}
.preview-toggle {
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  background: #4169e1;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.preview-toggle:hover {
  background: #274baf;
}
.svg-compare-block {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}
.svg-preview-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.svg-preview-label {
  font-weight: bold;
  color: #4169e1;
  margin-bottom: 0.5rem;
}
.svg-preview {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
  min-width: 180px;
  max-width: 480px;
  border: 1px solid #e3e9f7;
  background: #f8faff;
  border-radius: 8px;
  padding: 1rem;
}
.svg-size {
  margin-top: 0.5rem;
  color: #888;
  font-size: 0.95rem;
}
.error {
  color: #d00;
  margin-top: 1rem;
}
</style>
