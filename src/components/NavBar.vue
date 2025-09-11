<template>
  <header class="w-screen min-w-0 bg-cornflower-blue shadow-lg fixed left-0 top-0 z-[1000]">
    <div class="max-w-6xl mx-auto px-8 pb-2">
      <div class="text-3xl font-bold text-white pt-4 pb-2 tracking-wide">Vue Playground</div>
      <nav class="flex gap-8 items-center mb-2">
        <template v-for="route in navRoutes" :key="route.path">
          <router-link
            v-if="!route.children"
            :to="route.path"
            class="text-blue-100 text-lg no-underline px-3 py-2 rounded-t transition-all duration-200 cursor-pointer hover:text-white hover:bg-royal-blue"
            :class="{ 'text-white bg-royal-blue': isActive(route.path) }"
            >{{ route.meta?.label }}</router-link
          >
          <div
            v-else
            class="relative cursor-pointer"
            @mouseenter="openDropdown = route.path"
            @mouseleave="openDropdown = null"
          >
            <span
              class="text-blue-100 text-lg px-3 py-2 rounded-t transition-all duration-200 hover:text-white hover:bg-royal-blue"
              :class="{ 'text-white bg-royal-blue': isDropdownActive(route) }"
              >{{ route.meta?.label }}</span
            >
            <transition name="slide-fade">
              <ul
                v-if="openDropdown === route.path"
                class="absolute left-0 top-9 bg-white shadow-lg rounded-b min-w-[200px] z-10 py-2 animate-slide-down"
              >
                <li
                  v-for="child in route.children.filter((c: any) => c.meta?.nav)"
                  :key="child.path"
                >
                  <router-link
                    :to="fullChildPath(route, child)"
                    class="block text-royal-blue px-5 py-3 no-underline text-base whitespace-nowrap text-left transition-all duration-200 hover:bg-blue-100 hover:text-gray-800"
                    @click="openDropdown = null"
                  >
                    {{ child.meta?.label }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const openDropdown = ref<string | null>(null);
const route = useRoute();
const router = useRouter();

// Top-level nav routes (with meta.nav)
const navRoutes = computed(() =>
  (router.options.routes as RouteRecordRaw[]).filter(r => r.meta?.nav),
);

function isActive(path: string) {
  return route.path === path;
}

function isDropdownActive(parentRoute: RouteRecordRaw) {
  return route.path.startsWith(parentRoute.path as string);
}

function fullChildPath(parent: RouteRecordRaw, child: RouteRecordRaw) {
  if ((child.path as string).startsWith('/')) return child.path as string;
  return (parent.path as string).replace(/\/$/, '') + '/' + child.path;
}
</script>

<style scoped>
/* 트랜지션 애니메이션 */
.slide-fade-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
