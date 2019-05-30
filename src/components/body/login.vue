<template>
  <div class="container">
    <div
      class="col-10 col-xl-4 col-lg-4 col-md-6 col-sm-6 offset-col-1 offset-xl-4 offset-md-3 offset-sm-3 offset-lg-4 mt-4"
    >
      <form>
        <div class="form-group info">
          <input type="text" class="form-control pl-4" placeholder="请输入用户名" v-model="userName">
          <span class="iconfont">&#xe7d8;</span>
          <span v-if="userNameFlag">用户名是必须的</span>
        </div>
        <div class="form-group info">
          <input type="password" class="form-control pl-4" placeholder="请输入密码" v-model="password">
          <span class="iconfont">&#xe62f;</span>
          <span v-if="passwordFlag">密码是必须的</span>
        </div>
        <button type="button" class="btn btn-primary btn-sm btn-block" @click="login">登陆</button>
      </form>
      <transition 
      v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:after-enter="afterEnter"
      >
        <div class="alert alert-danger mt-4" v-if="error==''?false:true">{{ error }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval, setTimeout } from 'timers';
export default {
  data() {
    return {
      userName: "",
      password: "",
      userNameFlag: false,
      passwordFlag: false
    };
  },
  // 监听输入框是否为空
  watch: {
    userName() {
      if (!this.userName) {
        this.userNameFlag = true;
      } else {
        this.userNameFlag = false;
      }
    },
    password() {
      if (!this.password) {
        this.passwordFlag = true;
      } else {
        this.passwordFlag = false;
      }
    }
  },
  methods: {
      // 点击登陆进行登陆操作
    login() {
      if (!this.password && !this.userName) {
        this.passwordFlag = true;
        this.userNameFlag = true;
        return;
      } else if (!this.userName) {
        this.userNameFlag = true;
        return;
      } else if (!this.password) {
        this.passwordFlag = true;
        return;
      }
      // 当输入框都输入之后，发送请求
      this.$store.dispatch('login', {
          name: this.userName,
          password: this.password
      })
      
    },
    // 计算属性error改变执行提示动画
    beforeEnter (el) {
        el.style.transfrom = 'translateY("-200px")';
        el.style.opacity = 0;
    },
    enter (el, done) {
        let n = 0;
        let timer1 = setInterval(() => {
            n ++;
            el.style.cssText = `transform: translateY(${-(20-n)*10}px);opacity=${n * 0.05};`;
            if(n == 20){
                clearInterval(timer1);
                setTimeout(() => {
                    done();
                }, 2000)
            }
        }, 50)
    },
    afterEnter () {
        this.$store.commit('addError', '')
    }
  },
  // 如果请求出错就执行eror
  computed: {
    error() {
      return this.$store.state.user.error;
    }
  }
};
</script>

<style lang="scss" src='../../style/login.scss'>
</style>

