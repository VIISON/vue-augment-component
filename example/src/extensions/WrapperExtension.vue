<template>
  <div class="extension outer-container">
    <h2>Wrapper Extension</h2>
    <div class="inner-container">
      <slot></slot>
    </div>
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
