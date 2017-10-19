<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <EssentialLinks />
    <Ecosystem />
  </div>
</template>

<script>
import EssentialLinks from './EssentialLinks';
import Ecosystem from './Ecosystem';

export default {
  name: 'HelloWorld',
  components: {
    EssentialLinks,
    Ecosystem,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
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
