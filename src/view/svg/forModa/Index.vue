<template>
  <v-card class="!pt-[20px]">
    <v-card-title class="text-center">
      <v-icon class="mr-2">mdi-image-multiple</v-icon>
      SVGO for MODA
    </v-card-title>
    <v-card-text class="text-center">
      <div class="w-[600px] mx-auto">
        <div class="w-full flex justify-end">
          <v-checkbox v-model="showFlags" label="국기 포함" color="primary" />
        </div>
        <v-row class="justify-center mb-4">
          <v-col cols="12" md="6">
            <v-chip color="info" variant="tonal" size="large" class="mr-2">
              Before: {{ totalOriginalSize }} bytes ({{ totalOriginalSizeKB }} KB)
            </v-chip>
          </v-col>
          <v-col cols="12" md="6">
            <v-chip color="success" variant="tonal" size="large">
              After: {{ totalOptimizedSize }} bytes ({{ totalOptimizedSizeKB }} KB)
            </v-chip>
          </v-col>
        </v-row>

        <v-alert
          :color="
            reductionRateColor === '#e74c3c'
              ? 'error'
              : reductionRateColor === '#2e8b57'
                ? 'success'
                : 'info'
          "
          variant="tonal"
          class="mb-4"
        >
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          최적화 효율: {{ reductionRate }}%
        </v-alert>

        <p class="mb-4">아래는 모든 SVG 파일의 최적화 전/후 비교입니다.</p>
      </div>

      <v-alert v-if="filteredSvgList.length === 0" type="info" variant="tonal" class="my-8">
        <v-icon class="mr-2">mdi-information</v-icon>
        SVG 파일이 없습니다.
      </v-alert>

      <v-expansion-panels v-else class="mt-8">
        <v-expansion-panel v-for="svg in filteredSvgList" :key="svg.path" class="mb-4">
          <v-expansion-panel-title>
            <v-icon class="mr-2">mdi-file-image</v-icon>
            {{ svg.name }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row class="justify-center">
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-center">
                    <v-icon class="mr-2">mdi-image</v-icon>
                    Before
                  </v-card-title>
                  <v-card-text class="text-center">
                    <div
                      class="mx-auto flex justify-center items-center min-h-[120px] min-w-[180px] max-w-[480px] border border-grey-lighten-2 bg-grey-lighten-5 rounded-lg p-4"
                      v-if="svg.originalUrl"
                    >
                      <img :src="svg.originalUrl" alt="original svg" />
                    </div>
                    <v-chip class="mt-2" color="info" variant="tonal">
                      {{ svg.originalSize }} bytes ({{ svg.originalSizeKB }} KB)
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-center">
                    <v-icon class="mr-2">mdi-image-edit</v-icon>
                    After
                  </v-card-title>
                  <v-card-text class="text-center">
                    <div
                      class="mx-auto flex justify-center items-center min-h-[120px] min-w-[180px] max-w-[480px] border border-grey-lighten-2 bg-grey-lighten-5 rounded-lg p-4"
                      v-if="svg.optimizedUrl"
                    >
                      <img :src="svg.optimizedUrl" alt="optimized svg" />
                    </div>
                    <v-chip class="mt-2" color="success" variant="tonal">
                      {{ svg.optimizedSize }} bytes ({{ svg.optimizedSizeKB }} KB)
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
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

// flag_*.svg 포함 여부 토글
const showFlags = ref(true);

// 토글에 따라 보여줄 리스트
const filteredSvgList = computed(() =>
  showFlags.value ? svgList.value : svgList.value.filter(svg => !svg.name.startsWith('flag_')),
);

const totalOriginalSize = computed(() =>
  filteredSvgList.value.reduce((sum, svg) => sum + svg.originalSize, 0),
);
const totalOptimizedSize = computed(() =>
  filteredSvgList.value.reduce((sum, svg) => sum + svg.optimizedSize, 0),
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
  const originalUrls = import.meta.glob('@/assets/moda/Icon/figma/*.svg', {
    as: 'url',
    eager: true,
  });
  const optimizedUrls = import.meta.glob('@/assets/moda/Icon/figma-optimize/*.svg', {
    as: 'url',
    eager: true,
  });
  const originalRaws = import.meta.glob('@/assets/moda/Icon/figma/*.svg', {
    as: 'raw',
    eager: true,
  });
  const optimizedRaws = import.meta.glob('@/assets/moda/Icon/figma-optimize/*.svg', {
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
