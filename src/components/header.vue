<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <h3 class="navbar-brand">eStudy</h3>
    <div
      class="collapse navbar-collapse justify-content-end"
      id="navbarNav"
      v-if="form.is_admin && (form.is_admin == 0)"
    >
      <ul class="navbar-nav">
        <li class="nav-item active pt-2">
          <span class="nav-link p-0">{{ form.full_name }}</span>
          <span class="nav-link p-0">学号：{{ form.name }}</span>
        </li>
        <li class="nav-item pt-2">
          <span class="nav-link" v-for="(val, i) in student.orgs" :key="`${val}${i}`">{{ val }}</span>
        </li>
        <li class="nav-item pt-2">
          <span class="nav-link">{{ student.stats.uncommitted }}个作业待提交</span>
        </li>
        <li class="nav-item pt-2">
          <span class="nav-link">{{ student.stats.revising }}个作业待批改</span>
        </li>
        <li class="nav-item pt-2">
          <span class="nav-link">{{ student.stats.improvable }}个作业需完善</span>
        </li>
        <li class="nav-item pt-2">
          <span class="nav-link">{{ student.stats.finished }}个作业已完成</span>
        </li>
        <li class="nav-item">
          <a class="nav-link warehouse" href="http://vipgit.chanke.xyz/user/login" target="_blank">
            <button class="btn btn-light iconfont">&#xe614; 代码仓库</button>
          </a>
        </li>
        <li class="nav-item">
          <span class="nav-link">
            <button class="btn btn-light iconfont" @click="logout">&#xe64f; 退出</button>
          </span>
        </li>
      </ul>
    </div>
    <div
      class="collapse navbar-collapse justify-content-end"
      id="navbarNav"
      v-if="form.is_admin && (form.is_admin == 1)"
    >
      <ul class="navbar-nav">
        <li class="nav-item active pt-2">
          <span class="nav-link">{{ form.name }}</span>
        </li>
        <li class="nav-item pt-2 ml-2">
            <button class="btn btn-primary iconfont" v-if='!correctioning' @click = 'create'>&#xe64d; 新建作业</button>
        </li>
        <li class="nav-item">
          <a class="nav-link warehouse pr-1" href="http://vipgit.chanke.xyz/user/login" target="_blank">
            <button class="btn btn-light iconfont">&#xe614; 代码仓库</button>
          </a>
        </li>
        <li class="nav-item">
          <span class="nav-link pl-0">
            <button class="btn btn-light iconfont" @click="logout">&#xe64f; 退出</button>
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { api } from "../utils/api";
export default {
  created() {
    if (this.$store.state.user.loggedin && this.form.is_admin == 0) {
      api
        .get("/student/detail", { headers: { Token: this.form.token } })
        .then(data => {
          this.student.orgs = data.orgs;
          this.student.stats = data.stats;
          this.student.assignments = data.assignments;
          this.$store.commit("changeinfo", this.student.assignments);
        });
    } else if (this.$store.state.user.loggedin && this.form.is_admin == 1) {
      api
        .get("/teacher/detail", { headers: { Token: this.form.token } })
        .then(data => {
          console.log(data);
          this.teacher.orgs = data.orgs;
          this.teacher.stats = data.stats;
          this.teacher.assignments = data.assignments;
          this.$store.commit("changeinfo", this.teacher);
        });
    }
  },
  data() {
    return {
      student: {
        orgs: [],
        stats: {},
        assignments: []
      },
      teacher: {
        orgs: [],
        stats: {},
        assignments: []
      }
    };
  },
  computed: {
    form() {
      return this.$store.state.user.form;
    },
    loggedin() {
      return this.$store.state.user.loggedin;
    },
    correctioning () {
      return this.$store.state.user.correctioning;
    }
  },
  watch: {
    loggedin(val) {
      if (val) {
        this.load();
      }
    }
  },
  methods: {
    load() {
      if (this.$store.state.user.loggedin && this.form.is_admin == 0) {
      api
        .get(`/student/detail`, { headers: { Token: this.form.token } })
        .then(data => {
          console.log(data);
          this.student.orgs = data.orgs;
          this.student.stats = data.stats;
          this.student.assignments = data.assignments;
          this.$store.commit("changeinfo", this.student.assignments);
        });
      }else if(this.$store.state.user.loggedin && this.form.is_admin == 1) {
        api
        .get("/teacher/detail", { headers: { Token: this.form.token } })
        .then(data => {
          console.log(data);
          this.teacher.orgs = data.orgs;
          this.teacher.stats = data.stats;
          this.teacher.assignments = data.assignments;
          this.$store.commit("changeinfo", this.teacher);
        });
      }
    },
    logout() {
      localStorage.removeItem("form");
      this.$store.commit("changeForm", {});
      this.$store.commit("changeLoggedin", false);
      this.$store.commit("changeinfo", {});
      this.$router.push("/");
    },
    create () {
      this.$store.commit('changeCreate', true)
    }
  }
};
</script>

<style lang="scss">
</style>
