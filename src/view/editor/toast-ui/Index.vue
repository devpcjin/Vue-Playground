<template>
  <div class="w-full">
    <div :class="validations ? 'w-full border border-red-500' : 'w-full'" ref="editorRoot"></div>

    <div
      v-if="validations"
      class="overflow-visible whitespace-nowrap px-1 pt-1 text-sm text-red-500"
    >
      <span>{{ validations }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Editor from '@toast-ui/editor';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import { useImageUpload } from '@/composables';

const modelValue = defineModel('modelValue', { type: String });

const { uploadImage } = useImageUpload();

const editorRoot = ref(null);
let editorInstance = null;

defineProps({
  validations: {
    type: [Boolean, String],
  },
});

watch(modelValue, newValue => {
  if (!editorInstance) {
    editorInstance.setHTML(newValue);
  } else {
    const current = editorInstance.getHTML();
    if (newValue !== current) {
      editorInstance.setHTML(newValue);
    }
  }
});

onMounted(() => {
  editorInstance = new Editor({
    el: editorRoot.value,
    initialValue: modelValue.value,
    previewStyle: 'vertical',
    height: '400px',
    initialEditType: 'wysiwyg',
    useCommandShortcut: true,
    language: 'ko-KR',
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task'],
      ['indent', 'outdent'],
      ['table', 'link', 'image'],
      ['scrollSync'],
    ],
    plugins: [codeSyntaxHighlight, colorSyntax],
    hooks: {
      addImageBlobHook: async (blob, callback) => {
        const uploadedUrl = await uploadImage(blob);

        callback(uploadedUrl, 'image');
      },
    },
  });
  editorInstance.on('change', () => {
    modelValue.value = editorInstance.getHTML();
  });
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.destroy();
    editorInstance = null;
  }
});
</script>

<style lang="scss">
/* Toast UI Editor 기본 스타일 */
.toastui-editor {
  .toastui-editor-contents {
    text-align: left !important;
  }

  .toastui-editor-contents p {
    text-align: left !important;
  }

  .toastui-editor-contents h1,
  .toastui-editor-contents h2,
  .toastui-editor-contents h3,
  .toastui-editor-contents h4,
  .toastui-editor-contents h5,
  .toastui-editor-contents h6 {
    text-align: left !important;
  }
}

.toastui-editor-popup-body {
  .tui-colorpicker-clearfix {
    position: relative;

    .tui-colorpicker-palette-preview {
      position: absolute;
      top: -3.8px;
    }
  }

  input[type='text'].tui-colorpicker-palette-hex {
    width: 100%;

    &:focus {
      border: 1px solid #007bff;
    }
  }

  button {
    height: 24px;
  }
}
</style>
