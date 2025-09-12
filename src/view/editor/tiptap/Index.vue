<template>
  <div class="w-full max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Simple Tiptap Editor</h1>

    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <!-- Toolbar -->
      <div class="border-b border-gray-200 p-3 bg-gray-50 flex gap-2 flex-wrap">
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('bold') }"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <strong>B</strong>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('italic') }"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <em>I</em>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('strike') }"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <s>S</s>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('code') }"
          @click="editor?.chain().focus().toggleCode().run()"
        >
          <span>&lt;/&gt;</span>
        </button>
        <span class="mx-1 w-px h-6 bg-gray-300"></span>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('heading', { level: 1 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          H1
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('heading', { level: 2 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          H2
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('heading', { level: 3 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          H3
        </button>
        <span class="mx-1 w-px h-6 bg-gray-300"></span>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          • List
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          1. List
        </button>
        <span class="mx-1 w-px h-6 bg-gray-300"></span>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          @click="editor?.chain().focus().undo().run()"
          :disabled="!editor?.can().undo()"
        >
          Undo
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          @click="editor?.chain().focus().redo().run()"
          :disabled="!editor?.can().redo()"
        >
          Redo
        </button>
      </div>

      <!-- Editor area -->
      <div class="p-4">
        <div class="min-h-[180px] cursor-text" @click="focusEditor">
          <editor-content :editor="editor" />
        </div>
      </div>
    </div>

    <!-- HTML Preview + Save -->
    <div class="mt-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Content (Formatted HTML)</h3>
        <div class="flex gap-2">
          <button class="px-3 py-1 text-sm rounded border" @click="copyHtml">복사</button>
          <button class="px-3 py-1 text-sm rounded border" @click="saveAsHtml">HTML로 저장</button>
        </div>
      </div>
      <pre class="bg-gray-50 border rounded p-4 text-sm overflow-auto max-h-64">{{
        formattedHtml
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

const rawHtml = ref('');
const formattedHtml = ref('');

function formatHtml(html: string): string {
  if (!html) return '';
  // 1) 태그 사이 줄바꿈
  const withLineBreaks = html.replace(/>\s*</g, '>$LB$<');
  // 2) 간단 들여쓰기 규칙
  const lines = withLineBreaks.split('$LB$');
  const result: string[] = [];
  let indent = 0;
  const indentUnit = '  ';
  const isClosing = (s: string) => /^<\//.test(s.trim());
  const isSelfClosing = (s: string) => /<[^>]+\/>$/.test(s.trim());
  const isOpening = (s: string) => /^<[^/!][^>]*?>$/.test(s.trim());

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isClosing(trimmed)) {
      indent = Math.max(0, indent - 1);
    }

    result.push(indentUnit.repeat(indent) + trimmed);

    if (isOpening(trimmed) && !isSelfClosing(trimmed)) {
      indent += 1;
    }
  }

  return result.join('\n');
}

const editor = useEditor({
  content: '<p>여기에 입력해 보세요!</p>',
  extensions: [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3] }),
    BulletList,
    OrderedList,
    ListItem,
  ],
  onUpdate: ({ editor }) => {
    rawHtml.value = editor.getHTML();
    formattedHtml.value = formatHtml(rawHtml.value);
  },
});

const focusEditor = () => editor.value?.commands.focus();

const saveAsHtml = () => {
  rawHtml.value = editor.value?.getHTML() || '';
  formattedHtml.value = formatHtml(rawHtml.value);
  // TODO: 서버 전송/저장 로직으로 formattedHtml.value 사용
  console.log('Formatted HTML to save:', formattedHtml.value);
};

const copyHtml = async () => {
  const html = formattedHtml.value || formatHtml(editor.value?.getHTML() || '');
  try {
    await navigator.clipboard.writeText(html);
    // eslint-disable-next-line no-alert
    alert('클립보드에 복사되었습니다.');
  } catch (e) {
    console.warn('클립보드 복사 실패', e);
  }
};

onMounted(() => {
  if (editor.value) {
    rawHtml.value = editor.value.getHTML();
    formattedHtml.value = formatHtml(rawHtml.value);
  }
  setTimeout(() => focusEditor(), 100);
});

onBeforeUnmount(() => editor.value?.destroy());
</script>

<style>
.ProseMirror {
  outline: none;
  min-height: 160px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
}
.ProseMirror:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.ProseMirror p {
  margin: 0.5em 0;
}
.ProseMirror ul,
.ProseMirror ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}
</style>
