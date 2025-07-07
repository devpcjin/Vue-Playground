<template>
  <header class="navbar">
    <div class="navbar-inner">
      <div class="navbar-title">Vue Playground</div>
      <nav class="navbar-menu">
        <router-link to="/" class="navbar-item" :class="{ active: isActive('/') }"
          >Home</router-link
        >
        <div
          class="navbar-item validation-menu"
          @mouseenter="open = true"
          @mouseleave="open = false"
        >
          <span :class="{ active: isValidationActive }">Validation</span>
          <transition name="slide-fade">
            <ul v-if="open" class="submenu">
              <li>
                <router-link to="/validation/zod-vs-yup" class="submenu-item" @click="open = false"
                  >Zod vs Yup Form</router-link
                >
              </li>
              <li>
                <router-link
                  to="/validation/zod-vs-yup/playground"
                  class="submenu-item"
                  @click="open = false"
                  >Zod vs Yup Playground</router-link
                >
              </li>
            </ul>
          </transition>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const open = ref(false);
const route = useRoute();

function isActive(path: string) {
  return route.path === path;
}

const isValidationActive = computed(() => route.path.startsWith('/validation'));
</script>

<style scoped>
.navbar {
  width: 100vw;
  min-width: 0;
  background: #6495ed;
  box-shadow: 0 2px 8px #0002;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 0.5rem 2rem;
}
.navbar-title {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  padding: 1rem 0 0.5rem 0;
  letter-spacing: 1px;
}
.navbar-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.navbar-item {
  color: #e3e9f7;
  font-size: 1.1rem;
  text-decoration: none;
  padding: 0.5rem 0.7rem;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: pointer;
}
.navbar-item.active,
.navbar-item:hover,
.validation-menu > span.active {
  color: #fff;
  background: #4169e1;
}
.validation-menu {
  position: relative;
  cursor: pointer;
}
.validation-menu > span {
  color: #e3e9f7;
  font-size: 1.1rem;
  padding: 0.5rem 0.7rem;
  border-radius: 4px 4px 0 0;
  transition:
    background 0.2s,
    color 0.2s;
}
.validation-menu > span.active,
.validation-menu > span:hover {
  color: #fff;
  background: #4169e1;
}
.submenu {
  position: absolute;
  left: 0;
  top: 2.2rem;
  background: #fff;
  box-shadow: 0 2px 8px #0002;
  border-radius: 0 0 8px 8px;
  min-width: 200px;
  z-index: 10;
  padding: 0.5rem 0;
  animation: slideDown 0.2s;
}
.submenu-item {
  display: block;
  color: #4169e1;
  padding: 0.7rem 1.2rem;
  text-decoration: none;
  font-size: 1rem;
  transition:
    background 0.2s,
    color 0.2s;
}
.submenu-item:hover {
  background: #e3e9f7;
  color: #222;
}
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
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
