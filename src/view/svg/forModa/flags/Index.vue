<template>
  <div class="svgo-for-moda-page">
    <h2>SVGO for MODA</h2>
    <div class="svg-total-size">
      <span>Before: {{ totalOriginalSize }} bytes ({{ totalOriginalSizeKB }} KB)</span>
      &nbsp;|&nbsp;
      <span>After: {{ totalOptimizedSize }} bytes ({{ totalOptimizedSizeKB }} KB)</span>
    </div>
    <div class="svg-reduction-rate" :style="{ color: reductionRateColor }">
      최적화 효율: {{ reductionRate }}%
    </div>
    <p>아래는 모든 SVG 파일의 최적화 전/후 비교입니다.</p>
    <div v-if="svgList.length === 0" class="empty-msg">SVG 파일이 없습니다.</div>
    <div v-else class="svg-list">
      <div v-for="svg in svgList" :key="svg.path" class="svg-row">
        <div class="svg-filename">{{ svg.name }}</div>
        <div class="svg-compare-block">
          <div class="svg-preview-col">
            <div class="svg-preview-label">Before</div>
            <div class="svg-preview" v-if="svg.originalUrl">
              <img :src="svg.originalUrl" alt="original svg" />
            </div>
            <div class="svg-size">{{ svg.originalSize }} bytes ({{ svg.originalSizeKB }} KB)</div>
          </div>
          <div class="svg-preview-col">
            <div class="svg-preview-label">After</div>
            <div class="svg-preview" v-if="svg.optimizedUrl">
              <img :src="svg.optimizedUrl" alt="optimized svg" />
            </div>
            <div class="svg-size">{{ svg.optimizedSize }} bytes ({{ svg.optimizedSizeKB }} KB)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
// @ts-ignore
// import { optimize } from 'svgo';

interface SvgInfo {
  path: string;
  name: string;
  originalUrl: string;
  optimizedUrl: string;
  originalSize: number;
  optimizedSize: number;
  originalSizeKB: string;
  optimizedSizeKB: string;
}

const svgList = ref<SvgInfo[]>([]);

// showFlags, filteredSvgList 등 토글 관련 코드 제거

const totalOriginalSize = computed(() =>
  svgList.value.reduce((sum, svg) => sum + svg.originalSize, 0),
);
const totalOptimizedSize = computed(() =>
  svgList.value.reduce((sum, svg) => sum + svg.optimizedSize, 0),
);
const totalOriginalSizeKB = computed(() => (totalOriginalSize.value / 1024).toFixed(2));
const totalOptimizedSizeKB = computed(() => (totalOptimizedSize.value / 1024).toFixed(2));

const reductionRate = computed(() => {
  if (totalOriginalSize.value === 0) return '0.00';
  const rate = (1 - totalOptimizedSize.value / totalOriginalSize.value) * 100;
  return rate.toFixed(2);
});

const reductionRateColor = computed(() => {
  const rate = parseFloat(reductionRate.value);
  if (rate < 10) return '#e74c3c'; // 빨간색
  if (rate >= 30) return '#2e8b57'; // 초록색
  return '#222'; // 검정색
});

onMounted(async () => {
  // 1. 원본과 최적화된 SVG 파일을 URL과 raw로 각각 import
  const originalUrls = import.meta.glob('@/assets/moda/Icon/figma/new-flags/*.svg', {
    as: 'url',
    eager: true,
  });
  const optimizedUrls = import.meta.glob('@/assets/moda/Icon/figma-optimize/new-flags/*.svg', {
    as: 'url',
    eager: true,
  });
  const originalRaws = import.meta.glob('@/assets/moda/Icon/figma/new-flags/*.svg', {
    as: 'raw',
    eager: true,
  });
  const optimizedRaws = import.meta.glob('@/assets/moda/Icon/figma-optimize/new-flags/*.svg', {
    as: 'raw',
    eager: true,
  });

  const originalEntries = Object.entries(originalUrls) as [string, string][];
  const optimizedEntries = Object.entries(optimizedUrls) as [string, string][];
  const originalRawMap = new Map(
    Object.entries(originalRaws).map(([path, raw]) => [path.split('/').pop() || path, raw]),
  );
  const optimizedRawMap = new Map(
    Object.entries(optimizedRaws).map(([path, raw]) => [path.split('/').pop() || path, raw]),
  );
  const optimizedUrlMap = new Map(
    optimizedEntries.map(([path, url]) => [path.split('/').pop() || path, url]),
  );

  svgList.value = originalEntries
    .map(([origPath, origUrl]) => {
      const name = origPath.split('/').pop() || origPath;
      const optimizedUrl = optimizedUrlMap.get(name) || '';
      const originalRaw = originalRawMap.get(name) || '';
      const optimizedRaw = optimizedRawMap.get(name) || '';
      const originalSize = new Blob([originalRaw]).size;
      const optimizedSize = new Blob([optimizedRaw]).size;
      return {
        path: origPath,
        name,
        originalUrl: origUrl,
        optimizedUrl,
        originalSize,
        optimizedSize,
        originalSizeKB: (originalSize / 1024).toFixed(2),
        optimizedSizeKB: (optimizedSize / 1024).toFixed(2),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});
</script>

<style scoped>
.svgo-for-moda-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0001;
  text-align: center;
}
.empty-msg {
  margin: 2rem 0;
  color: #888;
}
.svg-list {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.svg-row {
  border-bottom: 1px solid #e3e9f7;
  padding-bottom: 2rem;
}
.svg-filename {
  font-weight: bold;
  color: #4169e1;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.svg-compare-block {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 0.5rem;
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
.svg-total-size {
  margin: 1rem 0 2rem 0;
  font-size: 1.1rem;
  color: #4169e1;
  font-weight: bold;
}
.svg-reduction-rate {
  margin-bottom: 1rem;
  font-size: 1.08rem;
  font-weight: bold;
}
</style>
