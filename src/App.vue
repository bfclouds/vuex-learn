<template>
  <div id="app">
    <!-- <div>{{ $store.a.state.userInfo.userName }}</div> -->
    <!-- <div>{{ $store.a.getters.getUserName }}</div> -->
    <div>aa{{  $store.state.amount }}</div>
    <div>module a {{ $store.state.a.userInfo.userName }}</div>
    
    <button @click="$store.commit('amountAdd', 3)">点我修改</button>
    <!-- <button @click="$store.actions.setUserName('菠萝飘雪2')">点我修改</button> -->
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted () {
    console.log(this.$store, this.$store.mutations.amountAdd)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
