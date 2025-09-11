<template>
  <div class="p-8 bg-white rounded-xl shadow-lg text-center">
    <h2>SVGO for MODA</h2>
    <div class="my-4 text-lg text-royal-blue font-bold">
      <span>Before: {{ totalOriginalSize }} bytes ({{ totalOriginalSizeKB }} KB)</span>
      &nbsp;|&nbsp;
      <span>After: {{ totalOptimizedSize }} bytes ({{ totalOptimizedSizeKB }} KB)</span>
    </div>
    <div class="mb-4 text-lg font-bold" :style="{ color: reductionRateColor }">
      최적화 효율: {{ reductionRate }}%
    </div>
    <p>아래는 모든 SVG 파일의 최적화 전/후 비교입니다.</p>
    <div v-if="svgList.length === 0" class="my-8 text-gray-500">SVG 파일이 없습니다.</div>
    <div v-else class="mt-8 flex flex-col gap-10">
      <div v-for="svg in svgList" :key="svg.path" class="border-b border-blue-100 pb-8">
        <div class="font-bold text-royal-blue mb-4 text-lg">{{ svg.name }}</div>
        <div class="flex justify-center gap-12 mt-2">
          <div class="flex-1 flex flex-col items-center">
            <div class="font-bold text-royal-blue mb-2">Before</div>
            <div
              class="mx-auto flex justify-center items-center min-h-[120px] min-w-[180px] max-w-[480px] border border-blue-100 bg-blue-50 rounded-lg p-4"
              v-if="svg.originalUrl"
            >
              <img :src="svg.originalUrl" alt="original svg" />
            </div>
            <div class="mt-2 text-gray-500 text-sm">
              {{ svg.originalSize }} bytes ({{ svg.originalSizeKB }} KB)
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center">
            <div class="font-bold text-royal-blue mb-2">After</div>
            <div
              class="mx-auto flex justify-center items-center min-h-[120px] min-w-[180px] max-w-[480px] border border-blue-100 bg-blue-50 rounded-lg p-4"
              v-if="svg.optimizedUrl"
            >
              <img :src="svg.optimizedUrl" alt="optimized svg" />
            </div>
            <div class="mt-2 text-gray-500 text-sm">
              {{ svg.optimizedSize }} bytes ({{ svg.optimizedSizeKB }} KB)
            </div>
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
