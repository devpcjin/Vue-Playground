<template>
  <div class="w-full">
    <div :class="validations ? 'w-full border border-red-500' : 'w-full'">
      <!-- Toolbar -->
      <div class="border-b border-gray-200 p-3 bg-gray-50 flex gap-2 flex-wrap">
        <!-- Undo/Redo -->
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200 disabled:opacity-50"
          :disabled="!editor?.can().undo()"
          @click="editor?.chain().focus().undo().run()"
          title="Undo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200 disabled:opacity-50"
          :disabled="!editor?.can().redo()"
          @click="editor?.chain().focus().redo().run()"
          title="Redo"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
            />
          </svg>
        </button>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Text Formatting -->
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('bold') }"
          @click="editor?.chain().focus().toggleBold().run()"
          title="Bold"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
            />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('italic') }"
          @click="editor?.chain().focus().toggleItalic().run()"
          title="Italic"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('underline') }"
          @click="editor?.chain().focus().toggleUnderline().run()"
          title="Underline"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
            />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('strike') }"
          @click="editor?.chain().focus().toggleStrike().run()"
          title="Strikethrough"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v2H3v-2z" />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('code') }"
          @click="editor?.chain().focus().toggleCode().run()"
          title="Code"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
            />
          </svg>
        </button>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Headings -->
        <select
          class="px-3 py-1 text-sm rounded border border-gray-300 bg-white"
          @change="setHeading($event)"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Lists -->
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
          title="Bullet List"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zm16-8V6H8v2h12zm0 5v-2H8v2h12zm0 5v-2H8v2h12z"
            />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          title="Numbered List"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.5L3 13h1v1H2v-1h1l1.5-2H2v-1zm5-3h12v2H7V8zm0 4h12v2H7v-2zm0 4h12v2H7v-2z"
            />
          </svg>
        </button>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Text Alignment -->
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive({ textAlign: 'left' }) }"
          @click="editor?.chain().focus().setTextAlign('left').run()"
          title="Align Left"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 15H3v2h12v-2zm0-8H3v2h12V7zm4 4H3v2h16v-2zm0-8H3v2h16V3zm0 12H3v2h16v-2z"
            />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive({ textAlign: 'center' }) }"
          @click="editor?.chain().focus().setTextAlign('center').run()"
          title="Align Center"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-4h10V7H7v2zM3 3v2h18V3H3z" />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive({ textAlign: 'right' }) }"
          @click="editor?.chain().focus().setTextAlign('right').run()"
          title="Align Right"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive({ textAlign: 'justify' }) }"
          @click="editor?.chain().focus().setTextAlign('justify').run()"
          title="Justify"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
          </svg>
        </button>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Block Elements -->
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('blockquote') }"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          title="Quote"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('codeBlock') }"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          title="Code Block"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
            />
          </svg>
        </button>
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          @click="editor?.chain().focus().setHorizontalRule().run()"
          title="Horizontal Rule"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 11h18v2H3z" />
          </svg>
        </button>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Color & Highlight -->
        <div class="relative">
          <input
            type="color"
            class="w-8 h-8 rounded border border-gray-300 cursor-pointer opacity-0 absolute"
            @input="setTextColor($event)"
            title="Text Color"
          />
          <div
            class="w-8 h-8 rounded border border-gray-300 cursor-pointer flex items-center justify-center bg-gray-100 hover:bg-gray-200"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
              />
            </svg>
          </div>
        </div>
        <div class="relative">
          <input
            type="color"
            class="w-8 h-8 rounded border border-gray-300 cursor-pointer opacity-0 absolute"
            @input="setHighlightColor($event)"
            title="Highlight Color"
          />
          <div
            class="w-8 h-8 rounded border border-gray-300 cursor-pointer flex items-center justify-center bg-yellow-200 hover:bg-yellow-300"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </div>
        </div>

        <span class="mx-1 w-px h-6 bg-gray-300"></span>

        <!-- Link -->
        <button
          class="px-3 py-1 text-sm rounded hover:bg-gray-200"
          :class="{ 'bg-blue-500 text-white': editor?.isActive('link') }"
          @click="setLink"
          title="Link"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
            />
          </svg>
        </button>

        <!-- Image -->
        <button class="px-3 py-1 text-sm rounded hover:bg-gray-200" @click="addImage" title="Image">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            />
          </svg>
        </button>
      </div>

      <!-- Editor Content -->
      <editor-content :editor="editor" class="min-h-[200px]" />
    </div>

    <!-- Validation Error -->
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
import { useEditor, EditorContent } from '@tiptap/vue-3';
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

defineProps({
  validations: {
    type: [Boolean, String],
  },
});

const { uploadImage } = useImageUpload();

const editor = useEditor({
  content: modelValue.value || '<p>여기에 입력해보세요! 🎉</p>',
  extensions: [
    StarterKit.configure({
      heading: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
      blockquote: false,
      horizontalRule: false,
      codeBlock: false,
      link: false,
      underline: false,
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
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4',
    },
  },
});

// Methods
const setHeading = event => {
  const level = event.target.value;
  if (level === 'paragraph') {
    editor.value?.chain().focus().setParagraph().run();
  } else {
    editor.value
      ?.chain()
      .focus()
      .toggleHeading({ level: parseInt(level) })
      .run();
  }
};

const setTextColor = event => {
  const color = event.target.value;
  editor.value?.chain().focus().setColor(color).run();
};

const setHighlightColor = event => {
  const color = event.target.value;
  editor.value?.chain().focus().setHighlight({ color }).run();
};

const setLink = () => {
  const url = window.prompt('Enter URL:');
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run();
  }
};

const addImage = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async event => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        editor.value?.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  };
  input.click();
};

onBeforeUnmount(() => {
  editor.value?.destroy();
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

// 툴바 스타일링
.toolbar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

// 버튼 스타일링
button {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// 색상 입력 스타일링
input[type='color'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
}
</style>
