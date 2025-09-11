<template>
  <v-card class="w-[520px]">
    <v-card-title class="text-center">
      <v-icon class="mr-2">mdi-image-edit</v-icon>
      SVGO Optimizer
    </v-card-title>
    <v-card-text class="text-center">
      <p class="mb-4">SVG 파일을 업로드하면 최적화된 SVG를 다운로드할 수 있습니다.</p>

      <v-file-input
        accept=".svg"
        label="SVG 파일 선택"
        variant="outlined"
        prepend-icon="mdi-file-image"
        @change="onFileChange"
        class="mb-4"
      />

      <v-card v-if="optimizedSvg" variant="outlined" class="mt-8">
        <v-card-title>
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          최적화 결과
        </v-card-title>
        <v-card-text>
          <v-textarea
            readonly
            :value="optimizedSvg"
            rows="10"
            variant="outlined"
            class="font-monospace mb-4"
          />

          <v-row class="justify-center">
            <v-col>
              <v-btn
                @click="downloadOptimizedSvg"
                color="primary"
                variant="elevated"
                block
                full-width
                class="mb-2"
              >
                <v-icon class="mr-2">mdi-download</v-icon>
                최적화 SVG 다운로드
              </v-btn>

              <v-btn
                @click="showPreview = !showPreview"
                color="secondary"
                variant="elevated"
                block
                class="mb-2"
              >
                <v-icon class="mr-2">{{ showPreview ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                {{ showPreview ? '닫기' : '미리 보기' }}
              </v-btn>
            </v-col>
          </v-row>

          <v-expand-transition>
            <div v-if="showPreview">
              <v-divider class="my-4" />
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
                        v-html="originalSvg"
                      />
                      <v-chip class="mt-2" color="info" variant="tonal">
                        {{ originalSize }} bytes ({{ originalSizeKB }} KB)
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
                        v-html="optimizedSvg"
                      />
                      <v-chip class="mt-2" color="success" variant="tonal">
                        {{ optimizedSize }} bytes ({{ optimizedSizeKB }} KB)
                      </v-chip>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>

      <v-alert v-if="errorMsg" type="error" variant="tonal" class="mt-4">
        {{ errorMsg }}
      </v-alert>
    </v-card-text>
  </v-card>
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
