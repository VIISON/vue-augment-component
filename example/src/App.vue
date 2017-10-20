<template>
  <div id="app">
    <h2>Outer app component</h2>
    <OuterComponent />
  </div>
</template>

<script>
  import OuterComponent from './components/OuterComponent';

  export default {
    name: 'app',
    components: {
      OuterComponent,
    },
  };
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.component {
  border: 1px solid #77cc77;
  padding: 10px;
  margin: 10px 0;
}

.extension {
  border: 1px solid #eeaa77;
  padding: 10px;
  margin: 10px 0;
}
</style>
