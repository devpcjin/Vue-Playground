<template>
  <div class="w-full">
    <div :class="validations ? 'w-full border border-red-500' : 'w-full'">
      <div ref="editorElement" class="min-h-[200px]"></div>
    </div>
    <div
      v-if="validations"
      class="overflow-visible whitespace-nowrap px-1 pt-1 text-sm text-red-500"
    >
      <span>{{ validations }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Heading } from '@tiptap/extension-heading';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { BulletList } from '@tiptap/extension-bullet-list';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { ListItem } from '@tiptap/extension-list-item';
import { Blockquote } from '@tiptap/extension-blockquote';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { CodeBlock } from '@tiptap/extension-code-block';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@/plugins/tiptap/fontSize';
import { useImageUpload } from '@/composables';

const modelValue = defineModel('modelValue', { type: String });

const editorElement = ref(null);
const editorInstance = ref(null);

defineProps({
  validations: {
    type: [Boolean, String],
  },
});

const { uploadImage } = useImageUpload();

onMounted(async () => {
  if (editorElement.value) {
    editorInstance.value = useEditor({
      content: modelValue.value || '<p>여기에 입력해보세요!</p>',
      extensions: [
        StarterKit.configure({
          // StarterKit에 포함된 확장 프로그램들을 비활성화하여 중복 방지
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          blockquote: false,
          horizontalRule: false,
          codeBlock: false,
        }),
        Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
        Underline,
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: 'text-blue-600 underline' },
        }),
        Image.configure({
          HTMLAttributes: { class: 'max-w-full h-auto rounded' },
        }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        BulletList,
        OrderedList,
        ListItem,
        Blockquote,
        HorizontalRule,
        CodeBlock.configure({
          HTMLAttributes: { class: 'bg-gray-100 p-4 rounded border' },
        }),
        FontFamily,
        FontSize,
      ],
      onUpdate: ({ editor }) => {
        modelValue.value = editor.getHTML();
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
      },
    });

    // 에디터가 완전히 초기화된 후 DOM 마운트
    await nextTick();
    if (editorInstance.value && editorInstance.value.view && editorInstance.value.view.dom) {
      editorElement.value.innerHTML = '';
      editorElement.value.appendChild(editorInstance.value.view.dom);
    }
  }
});

onBeforeUnmount(() => {
  if (editorInstance.value) {
    editorInstance.value.destroy();
    editorInstance.value = null;
  }
});
</script>

<style lang="scss" scoped>
// Tiptap 에디터 스타일링
:deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #9ca3af;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
