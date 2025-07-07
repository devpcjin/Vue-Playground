<template>
  <div class="main-content">
    <h2>Welcome to the Vue Playground!</h2>
    <p>메뉴를 선택해 다양한 예제를 체험해보세요.</p>
  </div>
</template>

<script setup lang="ts">
// NavBar is global
</script>

<style scoped>
.main-content {
  width: 100%;
  max-width: 1200px;
  min-height: 60vh;
  margin: 0 auto;
  padding: 120px 2rem 2rem 2rem; /* padding-top for fixed NavBar */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
