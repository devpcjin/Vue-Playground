<template>
  <div class="w-full max-w-6xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Tiptap 에디터</h1>
      <p class="text-lg text-gray-600">다양한 기능을 포함한 Tiptap 리치 텍스트 에디터입니다.</p>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="bg-white rounded-lg shadow-lg border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6 py-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- 탭 컨텐츠 -->
      <div class="p-6">
        <!-- 기본 에디터 탭 -->
        <div v-if="activeTab === 'basic'" class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">기본 에디터</h3>
            <p class="text-sm text-gray-600">텍스트 서식, 제목, 목록 등 기본 기능</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 툴바 -->
            <div class="border-b border-gray-200 p-4 bg-gray-50">
              <div class="flex flex-wrap gap-2">
                <!-- 텍스트 스타일 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="basicEditor?.chain().focus().toggleBold().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('bold') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('italic') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <em>I</em>
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().toggleStrike().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('strike') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <s>S</s>
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().toggleCode().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('code') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    &lt;/&gt;
                  </button>
                </div>

                <!-- 제목 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="basicEditor?.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{
                      'bg-blue-500 text-white': basicEditor?.isActive('heading', { level: 1 }),
                    }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    H1
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{
                      'bg-blue-500 text-white': basicEditor?.isActive('heading', { level: 2 }),
                    }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    H2
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{
                      'bg-blue-500 text-white': basicEditor?.isActive('heading', { level: 3 }),
                    }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    H3
                  </button>
                </div>

                <!-- 목록 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="basicEditor?.chain().focus().toggleBulletList().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('bulletList') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    • 목록
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().toggleOrderedList().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('orderedList') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    1. 목록
                  </button>
                </div>

                <!-- 기타 -->
                <div class="flex gap-1">
                  <button
                    @click="basicEditor?.chain().focus().toggleBlockquote().run()"
                    :class="{ 'bg-blue-500 text-white': basicEditor?.isActive('blockquote') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    인용
                  </button>
                  <button
                    @click="basicEditor?.chain().focus().setHorizontalRule().run()"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    구분선
                  </button>
                </div>
              </div>
            </div>

            <!-- 에디터 영역 -->
            <div class="p-6">
              <div @click="focusBasicEditor" class="min-h-[200px] cursor-text">
                <editor-content :editor="basicEditor" />
              </div>
            </div>
          </div>
        </div>

        <!-- 고급 에디터 탭 -->
        <div v-if="activeTab === 'advanced'" class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">고급 에디터</h3>
            <p class="text-sm text-gray-600">테이블, 이미지, 링크 등 고급 기능</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 툴바 -->
            <div class="border-b border-gray-200 p-4 bg-gray-50">
              <div class="flex flex-wrap gap-2">
                <!-- 텍스트 스타일 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="advancedEditor?.chain().focus().toggleBold().run()"
                    :class="{ 'bg-blue-500 text-white': advancedEditor?.isActive('bold') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    @click="advancedEditor?.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-blue-500 text-white': advancedEditor?.isActive('italic') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <em>I</em>
                  </button>
                  <button
                    @click="advancedEditor?.chain().focus().toggleUnderline().run()"
                    :class="{ 'bg-blue-500 text-white': advancedEditor?.isActive('underline') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <u>U</u>
                  </button>
                </div>

                <!-- 링크 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="setLink"
                    :class="{ 'bg-blue-500 text-white': advancedEditor?.isActive('link') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    🔗 링크
                  </button>
                </div>

                <!-- 테이블 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="
                      advancedEditor
                        ?.chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    "
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    📊 테이블
                  </button>
                </div>

                <!-- 이미지 -->
                <div class="flex gap-1">
                  <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    @change="addImage"
                    class="hidden"
                  />
                  <button
                    @click="imageInput?.click()"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    🖼️ 이미지
                  </button>
                </div>
              </div>
            </div>

            <!-- 에디터 영역 -->
            <div class="p-6">
              <div @click="focusAdvancedEditor" class="min-h-[200px] cursor-text">
                <editor-content :editor="advancedEditor" />
              </div>
            </div>
          </div>
        </div>

        <!-- 마크다운 에디터 탭 -->
        <div v-if="activeTab === 'markdown'" class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">마크다운 에디터</h3>
            <p class="text-sm text-gray-600">마크다운 문법을 지원하는 에디터</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 에디터 -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="border-b border-gray-200 p-4 bg-gray-50">
                <h4 class="font-semibold text-gray-800">마크다운 입력</h4>
              </div>
              <div class="p-6">
                <div @click="focusMarkdownEditor" class="min-h-[300px] cursor-text">
                  <editor-content :editor="markdownEditor" />
                </div>
              </div>
            </div>

            <!-- 미리보기 -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="border-b border-gray-200 p-4 bg-gray-50">
                <h4 class="font-semibold text-gray-800">HTML 미리보기</h4>
              </div>
              <div class="p-6">
                <div v-html="markdownHtml" class="prose max-w-none"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 커스텀 에디터 탭 -->
        <div v-if="activeTab === 'custom'" class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">커스텀 에디터</h3>
            <p class="text-sm text-gray-600">색상, 폰트 크기 등 커스터마이징 기능</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg">
            <!-- 툴바 -->
            <div class="border-b border-gray-200 p-4 bg-gray-50">
              <div class="flex flex-wrap gap-2">
                <!-- 텍스트 스타일 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <button
                    @click="customEditor?.chain().focus().toggleBold().run()"
                    :class="{ 'bg-blue-500 text-white': customEditor?.isActive('bold') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    @click="customEditor?.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-blue-500 text-white': customEditor?.isActive('italic') }"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    <em>I</em>
                  </button>
                </div>

                <!-- 색상 선택 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <input
                    type="color"
                    @input="setTextColor"
                    value="#000000"
                    class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    title="텍스트 색상"
                  />
                  <button
                    @click="customEditor?.chain().focus().unsetColor().run()"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    색상 제거
                  </button>
                </div>

                <!-- 폰트 크기 -->
                <div class="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                  <select
                    @change="setFontSize"
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                  >
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px" selected>16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                    <option value="32px">32px</option>
                  </select>
                </div>

                <!-- 배경색 -->
                <div class="flex gap-1">
                  <input
                    type="color"
                    @input="setHighlight"
                    value="#ffff00"
                    class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    title="하이라이트 색상"
                  />
                  <button
                    @click="customEditor?.chain().focus().unsetHighlight().run()"
                    class="px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                  >
                    하이라이트 제거
                  </button>
                </div>
              </div>
            </div>

            <!-- 에디터 영역 -->
            <div class="p-6">
              <div @click="focusCustomEditor" class="min-h-[200px] cursor-text">
                <editor-content :editor="customEditor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 에디터 내용 미리보기 -->
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">현재 에디터 내용 (JSON)</h3>
      <pre class="bg-white p-4 rounded border text-sm overflow-auto max-h-64">{{
        currentEditorContent
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlock from '@tiptap/extension-code-block';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '@/plugins/tiptap/fontSize';

const activeTab = ref('basic');
const imageInput = ref<HTMLInputElement>();

const tabs = [
  { id: 'basic', name: '기본 에디터' },
  { id: 'advanced', name: '고급 에디터' },
  { id: 'markdown', name: '마크다운 에디터' },
  { id: 'custom', name: '커스텀 에디터' },
];

// 기본 에디터
const basicEditor = useEditor({
  content: '<p>여기에 텍스트를 입력해보세요!</p>',
  extensions: [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3] }),
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    HorizontalRule,
  ],
});

// 고급 에디터
const advancedEditor = useEditor({
  content: '<p>고급 기능을 사용해보세요!</p>',
  extensions: [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3] }),
    Underline,
    TextStyle,
    Color,
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
  ],
});

// 마크다운 에디터
const markdownEditor = useEditor({
  content: '<p>마크다운 문법을 사용해보세요!</p>',
  extensions: [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    BulletList,
    OrderedList,
    ListItem,
    Blockquote,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-blue-600 underline' },
    }),
    Image.configure({
      HTMLAttributes: { class: 'max-w-full h-auto rounded' },
    }),
    CodeBlock.configure({
      HTMLAttributes: { class: 'bg-gray-100 p-4 rounded border' },
    }),
  ],
});

// 커스텀 에디터
const customEditor = useEditor({
  content: '<p>커스터마이징 기능을 사용해보세요!</p>',
  extensions: [
    StarterKit,
    Heading.configure({ levels: [1, 2, 3] }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Blockquote,
    HorizontalRule,
    FontFamily,
    FontSize,
  ],
});

// 현재 에디터 내용
const currentEditorContent = computed(() => {
  switch (activeTab.value) {
    case 'basic':
      return basicEditor.value?.getJSON() || {};
    case 'advanced':
      return advancedEditor.value?.getJSON() || {};
    case 'markdown':
      return markdownEditor.value?.getJSON() || {};
    case 'custom':
      return customEditor.value?.getJSON() || {};
    default:
      return {};
  }
});

// 마크다운 HTML
const markdownHtml = computed(() => {
  return markdownEditor.value?.getHTML() || '';
});

// 포커스 함수들
const focusBasicEditor = () => basicEditor.value?.commands.focus();
const focusAdvancedEditor = () => advancedEditor.value?.commands.focus();
const focusMarkdownEditor = () => markdownEditor.value?.commands.focus();
const focusCustomEditor = () => customEditor.value?.commands.focus();

// 고급 에디터 함수들
const setLink = () => {
  const url = window.prompt('URL을 입력하세요:');
  if (url) {
    advancedEditor.value?.chain().focus().setLink({ href: url }).run();
  }
};

const addImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      advancedEditor.value?.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  }
};

// 커스텀 에디터 함수들
const setTextColor = (event: Event) => {
  const target = event.target as HTMLInputElement;
  customEditor.value?.chain().focus().setColor(target.value).run();
};

const setFontSize = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  customEditor.value?.chain().focus().setFontSize(target.value).run();
};

const setHighlight = (event: Event) => {
  const target = event.target as HTMLInputElement;
  customEditor.value?.chain().focus().setHighlight({ color: target.value }).run();
};

onMounted(() => {
  // 에디터 초기화 후 포커스 설정
  setTimeout(() => {
    focusBasicEditor();
  }, 100);
});

onBeforeUnmount(() => {
  basicEditor.value?.destroy();
  advancedEditor.value?.destroy();
  markdownEditor.value?.destroy();
  customEditor.value?.destroy();
});
</script>

<style>
/* Tiptap 에디터 스타일 */
.ProseMirror {
  outline: none;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
}

.ProseMirror:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ProseMirror p {
  margin: 0.5em 0;
}

.ProseMirror h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

.ProseMirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

.ProseMirror h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin: 1em 0 0.5em 0;
}

.ProseMirror ul,
.ProseMirror ol {
  margin: 1em 0;
  padding-left: 2em;
}

.ProseMirror blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1em 0;
  color: #6b7280;
}

.ProseMirror code {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-family: 'Courier New', monospace;
}

.ProseMirror pre {
  background-color: #f3f4f6;
  padding: 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 1em 0;
}

.ProseMirror pre code {
  background: none;
  padding: 0;
  font-size: 0.9em;
}

.ProseMirror hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2em 0;
}

.ProseMirror table {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.ProseMirror table th,
.ProseMirror table td {
  border: 1px solid #e5e7eb;
  padding: 0.5em 1em;
  text-align: left;
}

.ProseMirror table th {
  background-color: #f9fafb;
  font-weight: bold;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}

.ProseMirror a {
  color: #2563eb;
  text-decoration: underline;
}

.ProseMirror a:hover {
  color: #1d4ed8;
}

/* 마크다운 에디터 전용 스타일 */
#markdown .ProseMirror {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
