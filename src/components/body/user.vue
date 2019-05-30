<template>
  <div>
    <transition appear
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter">
      <div
        class="alert alert-danger text-center contaniner"
        v-if="!this.$store.state.user.loggedin"
      >请先登陆,一秒后自动跳转</div>
    </transition>
    <router-view v-if="this.$store.state.user.loggedin"></router-view>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      let i = 0;
      let n = 0;
      let timer1 = setInterval(() => {
        i += 0.1;
        el.style.opacity = i;
        n++;
        if (n == 10) {
          clearInterval(timer1);
          setTimeout (() => {
            done();
          }, 1000)
        }
      }, 150);
    },
    afterEnter () {
        this.$router.push('/')
    }
  }
};
</script>

<style>
</style>
