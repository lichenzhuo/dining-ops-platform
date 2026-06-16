<template>
  <div class="screen-layout">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.screen-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $screen-bg;
  color: $screen-text-primary;
}
</style>
