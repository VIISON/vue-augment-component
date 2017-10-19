<template>
  <div class="outer-container">
    <h2>Viison Wrapper</h2>
    <div class="inner-container">
      <slot></slot>
    </div>
    <span>-- End of wrapper --</span>
  </div>
</template>

<script>
  export default {
    name: 'ViisonWrapper',
  };
</script>

<style scoped>
.outer-container {
  background-color: #b6b6b6;
}
.inner-container {
  background-color: #ffffff;
}
</style>
