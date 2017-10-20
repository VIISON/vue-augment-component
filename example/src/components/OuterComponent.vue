<template>
  <div class="component">
    <h2>Outer Component</h2>
    <ComponentA />
    <ComponentB />
  </div>
</template>

<script>
import ComponentA from './ComponentA';
import ComponentB from './ComponentB';

export default {
  name: 'OuterComponent',
  components: {
    ComponentA,
    ComponentB,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
