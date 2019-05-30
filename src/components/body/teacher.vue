<template>
  <div>
    <transition 
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
    >
      <div class="alert alert-danger delete" v-if="mydelete">
        <p>确认删除吗？</p>
        <button type="button" class="btn btn-primary mr-2" @click = 'tDelete'>确认</button>
        <button type="button" class="btn btn-secondary ml-2" @click = 'fDelete'>取消</button>
      </div>
    </transition>
    <div class="jumbotron jumbotron-fluid correction" v-if="create">
      <div class="container pt-4 pb-4 content">
        <div class="form-group">
          <label for="exampleFormControlSelect1">课程：</label>
          <select class="form-control" id="exampleFormControlSelect1" v-model="newTest.id">
            <option
              v-for="(val, index) in orgs"
              :key="`${val.id}${index}`"
              :value="val.id"
            >{{ val.full_name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="exampleInputText">作业名称：</label>
          <input type="text" class="form-control" id="exampleInputText" v-model="newTest.name">
        </div>
        <div class="form-group">
          <label for="exampleInputstart">开始时间：</label>
          <input
            type="date"
            class="form-control"
            id="exampleInputstart"
            v-model="newTest.start_time"
          >
        </div>
        <div class="form-group">
          <label for="exampleInputEnd">结束时间：</label>
          <input type="date" class="form-control" id="exampleInputEnd" v-model="newTest.end_time">
        </div>
        <button type="button" class="btn btn-primary mr-2" @click="createTest()">确认</button>
        <button type="button" class="btn btn-secondary ml-2" @click="noCreate">取消</button>
      </div>
    </div>
    <div class="jumbotron jumbotron-fluid correction" v-if="visible">
      <div class="container">
        <div class="content container pt-4 pb-4">
          <div class="form-group">
            <label for="exampleFormControlSelect1">状态：</label>
            <select class="form-control" id="exampleFormControlSelect1" v-model="pg.status">
              <option v-for="(val, key) in status" :value="key" :key="`${val}${key}`">{{ val }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">批改意见</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              v-model="pg.reviewText"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="exampleFormControlFile1">
              附件
              <span class="btn btn-success iconfont">&#xe647; 上传</span>
            </label>
            <input
              type="file"
              class="form-control-file"
              id="exampleFormControlFile1"
              v-show="false"
              @change="upload"
            >
          </div>
          <button type="button" class="btn btn-primary mr-2" @click="save">保存</button>
          <button type="button" class="btn btn-secondary ml-2" @click="cancel">取消</button>
        </div>
      </div>
    </div>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">课程</th>
          <th scope="col">作业名称</th>
          <th scope="col">开始~截止时间</th>
          <th scope="col">状态</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, index) in info" :key="`${val.id}_${index}`">
          <td class="align-middle">{{ val.org_name }}</td>
          <td class="align-middle">{{ val.name }}</td>
          <td class="align-middle">{{ val.start_time }}-{{ val.end_time }}</td>
          <td
            class="align-middle"
          >{{ val.student_count }}个学员/{{ val.work_count }}个提交 {{ val.work_count>0? "-" + val.work_update_time: '' }}</td>
          <td class="align-middle">
            <button
              v-if="val.work_count==0"
              class="btn btn-warning iconfont"
              @click='showDelete(val.assignment_id, index)'
            >&#xe608; 删除</button>
            <!-- @click="remove(val.assignment_id, index)" -->
            <span v-else>
              <button
                class="btn btn-primary iconfont"
                @click="show(index)"
                v-if="!expand"
              >&#xf0021; 展开</button>
              <button class="btn btn-primary iconfont" @click="collapse" v-else>&#xf0022; 收起</button>
              <a
                :href="`http://sandbox_api.estudy.chanke.xyz/teacher/downloadAll?id=${val.assignment_id}`"
              >
                <button class="btn btn-light iconfont">&#xe64a; 下载全部</button>
              </a>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped table-hover" v-if="expand">
      <thead>
        <tr>
          <td scope="col">学员名字</td>
          <td scope="col">学号</td>
          <td scope="col">提交文件</td>
          <td scope="col">提交时间</td>
          <td scope="col">状态</td>
          <td scope="col">操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val,index) in info[0].works" :key="`${val.assignment_id}${index}`">
          <td class="align-middle">{{ val.user.full_name }}</td>
          <td class="align-middle">{{ val.user.name }}</td>
          <td class="align-middle">{{ val.student_upload_name }}</td>
          <td class="align-middle">{{ val.review_time }}</td>
          <td class="align-middle">
            <span v-if="val.status == '0'">待批改</span>
            <span v-if="val.status == '1'">需完善</span>
            <span v-if="val.status == '2'">已完成</span>
          </td>
          <td class="align-middle">
            <a
              :href="`http://sandbox_api.estudy.chanke.xyz/teacher/download?id=${val.id}&type=student`"
            >
              <button class="btn btn-primary iconfont">&#xe64a; 下载</button>
            </a>
            <button class="btn btn-light iconfont" @click="correction(index)">&#xe610; 批改</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from "../../utils/api";
import { setInterval, clearInterval } from 'timers';
export default {
  computed: {
    info() {
      return this.i === ""
        ? this.$store.state.user.info.assignments
        : this.$store.state.user.info.assignments.slice(this.i, this.i + 1);
    },
    create() {
      return this.$store.state.user.create;
    },
    orgs() {
      return this.$store.state.user.info.orgs;
    }
  },
  methods: {
    tDelete() {
      api.defaults.headers.post["Token"] = this.$store.state.user.form.token;
      api.post("/teacher/deleteAssignment", { id: this.valId }).then(() => {
        this.info.splice(this.valIndex, 1);
        this.mydelete = false;
      });
    },
    fDelete () {
      this.mydelete = false;
    },
    show(index) {
      this.expand = true;
      this.i = index;
    },
    collapse() {
      this.expand = false;
      this.i = "";
    },
    correction(index) {
      this.visible = true;
      this.$store.commit("changecorrectioning", true);
      this.correctionIndex = index;
      this.pg.status = this.info[0].works[index].status;
    },
    save() {
      api
        .post("/teacher/review", {
          id: this.info[0].works[this.correctionIndex].id,
          review: this.pg.reviewText,
          status: this.pg.status
        })
        .then(data => {
          console.log(data);
          let user = this.info[0].works[this.correctionIndex].user;
          data.user = user;
          this.info[0].works[this.correctionIndex] = data;
          this.visible = false;
          this.$store.commit("changecorrectioning", false);
          this.correctionIndex = "";
          this.pg.reviewText = "";
        });
    },
    cancel() {
      this.visible = false;
      this.$store.commit("changecorrectioning", false);
      this.correctionIndex = "";
      this.pg.reviewText = "";
    },
    upload($event) {
      let id = this.info[0].works[this.correctionIndex].id;
      let files = $event.target.files[0];
      let formData = new FormData();
      formData.append("file", files);
      formData.append("id", id);
      api.defaults.headers.post["Content-Type"] =
        "multipart/form-data;charset=utf-8;";
      api.defaults.headers.post["Token"] = JSON.parse(
        localStorage.getItem("form")
      ).token;
      api.post("/teacher/upload", formData).then(data => {
        console.log(data);
        $event.target.value = "";
      });
    },
    createTest() {
      api.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";
      api.defaults.headers.post["Token"] = JSON.parse(
        localStorage.getItem("form")
      ).token;
      api
        .post("/teacher/createAssignment", {
          org_id: this.newTest.id,
          name: this.newTest.name,
          start_time: this.newTest.start_time,
          end_time: this.newTest.end_time
        })
        .then(data => {
          console.log(data);
          this.$store.state.user.info.orgs.forEach((val, index) => {
            if (val.id == this.newTest.id) {
              data.student_count = this.$store.state.user.info.orgs[
                index
              ].student_count;
              this.$store.commit("changeCreate", false);
              this.info.unshift(data);
              this.newTest.id = "";
              this.newTest.name = "";
              this.start_time = `${String(new Date().getFullYear())}-${String(
                new Date().getMonth() + 1
              ).padStart(2, "0")}-${String(new Date().getDate()).padEnd(
                2,
                "0"
              )}`;
              this.end_time = `${String(new Date().getFullYear())}-${String(
                new Date().getMonth() + 1
              ).padStart(2, "0")}-${String(new Date().getDate()).padEnd(
                2,
                "0"
              )}`;
            }
          });
        });
    },
    noCreate() {
      this.$store.commit("changeCreate", false);
      this.newTest.id = "";
      this.newTest.name = "";
      this.start_time = `${String(new Date().getFullYear())}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(new Date().getDate()).padEnd(2, "0")}`;
      this.end_time = `${String(new Date().getFullYear())}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(new Date().getDate()).padEnd(2, "0")}`;
    },
    beforeEnter (el) {
      el.style.transform = `translate(0, 0)`;
    },
    enter (el, done) {
      let y = 0;
      let timer1 = setInterval( () => {
        y += 2;
        el.style.transform = `translate(0, ${y}px)`;
        if (y == 100){
          clearInterval(timer1);
          done();
        }
      }, 5)
    },
    afterEnter (el) {
      el.transform = "translate(0, 100px)"
    },
    beforeLeave (el) {
      el.transform = "translate(0, 100px)"
    },
    leave (el, done) {
      let y = 100;
      let timer2 = setInterval( () => {
        y -= 2;
        console.log(y)
        el.style.transform = `translate(0, ${y}px)`;
        if (y <= 0){
          clearInterval(timer2);
          done();
        }
      }, 1)
    },
    afterLeave (el) {
      el.style.transform = `translate(0, 0)`;
    },
    showDelete (id, index) {
      this.mydelete = true;
      this.valId = id;
      this.valIndex = index;
    }
  },
  data() {
    return {
      expand: false,
      i: "",
      visible: false,
      mydelete: false,
      correctionIndex: "",
      valId: '',
      valIndex: '',
      status: {
        "0": "待批改",
        "1": "需完善",
        "2": "已完成"
      },
      pg: {
        status: "",
        reviewText: ""
      },
      newTest: {
        id: "",
        name: "",
        start_time: `${String(new Date().getFullYear())}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}-${String(new Date().getDate()).padEnd(2, "0")}`,
        end_time: `${String(new Date().getFullYear())}-${String(
          new Date().getMonth() + 1
        ).padStart(2, "0")}-${String(new Date().getDate()).padEnd(2, "0")}`
      }
    };
  }
};
</script>

<style lang="scss" src='../../style/teacher.scss' scoped>
</style>

