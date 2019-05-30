<template>
  <div id="app">
    <hx-header></hx-header>
    <router-view></router-view>
    <input type="text" :value="loggedin" v-show="false">
  </div>
</template>

<script>
import header from "./components/header";
export default {
  updated() {
    if (this.$store.state.user.loggedin) {
      if (this.$store.state.user.form.is_admin == "0") {
        this.$store.dispatch('chenkeToken')
        this.$router.push(
          `/user/student/${this.$store.state.user.form.avatar}`
        );
      } else {
        this.$store.dispatch('chenkeToken')
        this.$router.push(
          `/user/teacher/${this.$store.state.user.form.avatar}`
        );
      }
    }
  },
  components: {
    "hx-header": header
  },
  computed: {
    loggedin() {
      return this.$store.state.user.loggedin;
    }
  },
  methods: {
    add() {
      console.log(111);
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "iconfont";
  src: url("../font_2fgln9wf7fm/iconfont.eot");
  src: url("../font_2fgln9wf7fm/iconfont.eot?#iefix")
      format("embedded-opentype"),
    url("../font_2fgln9wf7fm/iconfont.woff2") format("woff2"),
    url("../font_2fgln9wf7fm/iconfont.woff") format("woff"),
    url("../font_2fgln9wf7fm/iconfont.ttf") format("truetype"),
    url("../font_2fgln9wf7fm/iconfont.svg#iconfont") format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
