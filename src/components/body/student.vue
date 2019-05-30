<template>
  <div>
    <transition name='fade'>
      <div v-if="is_s" class="alert alert-success text-center info">{{ infos }}</div>
    </transition>
    <transition name='scale'>
    <div :class="`alert alert-${color} opinion` " v-if='visible'>
      <h4 class = 'p-2'>{{ title }}</h4>
      <p class = 'p-2'>{{ yijian }}</p>
      <p v-if='uploadName'>
        <a :href="`http://sandbox_api.estudy.chanke.xyz/student/download?id=${id}&type=teacher`">
          <button :class = '`btn btn-sm btn-${btColor} iconfont`'>&#xe603; 附件</button>
        </a>
      </p>
      <button :class = '`btn btn-${btColor} btn-sm float-right`' @click='none'>确认</button>
    </div>
    </transition>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">课程</th>
          <th scope="col">作业名称</th>
          <th scope="col">开始~截至时间</th>
          <th scope="col">操作</th>
          <th scope="col">状态</th>
          <th scope="col">信息</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, index) in info" :key="`${val.assignment_id}${index}`">
          <td class="align-middle">{{ val.org_name }}</td>
          <td class="align-middle">{{ val.name }}</td>
          <td class="align-middle">{{ val.start_time }} - {{ val.end_time }}</td>
          <td class="align-middle">
            <label :for="`upload_${index}`">
              <span class="btn btn-light iconfont">&#xe647; 上传</span>
            </label>&nbsp;
            <input
              type="file"
              :id="`upload_${index}`"
              hidden
              @change="upload(val.assignment_id, $event)"
            >
            <a
              :href="`http://sandbox_api.estudy.chanke.xyz/student/download?id=${val.work.id}&type=student`"
              v-if="val.work"
            >
              <button class="btn btn-success iconfont">&#xe64a; 下载</button>
            </a>
          </td>
          <td class="align-middle">
            <span v-if="!val.work">待提交</span>
            <span v-else-if="val.work.status == 0">待批改</span>
            <span v-else-if="val.work.status == 1">待完善</span>
            <span v-else-if="val.work.status == 2">已完成</span>
          </td>
          <td class="align-middle">
            <span v-if="!val.work"></span>
            <span
              v-else-if="val.work.status == 0"
            >{{val.work.teacher_download_time == "0000-00-00"?val.work.commit_time + "提交": "老师" + val.work.teacher_download_time + "下载" }}</span>
            <span v-else-if="val.work.status == 1">
              <p>{{ val.work.review_time }}老师提交修改意见</p>
              <button
                class="btn btn-light btn-sm iconfont"
                @click="changeVisible(val.work.teacher_review, val.work.teacher_upload_name, val.work.id)"
              >&#xe605; 查看详情</button>
            </span>
            <span v-else-if="val.work.status == 2">
              <p>{{ val.work.review_time }}老师点评完成</p>
              <button class="btn btn-light btn-sm iconfont"
              @click="review(val.work.teacher_review, val.work.teacher_upload_name, val.work.id)"
              >&#xe507; 查看点评</button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from "../../utils/api";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      is_s: false,
      infos: "上传成功",
      visible: false,
      uploadName: "",
      id: "",
      yijian: "",
      title: "",
      color: "",
      btColor: ""
    };
  },
  computed: {
    info() {
      return this.$store.state.user.info;
    }
  },
  methods: {
    upload(id, $event) {
      let files = $event.target.files[0];
      let formData = new FormData();
      formData.append("file", files);
      formData.append("id", id);
      api.defaults.headers.post["Content-Type"] =
        "multipart/form-data;charset=utf-8;";
      api.defaults.headers.post["Token"] = JSON.parse(
        localStorage.getItem("form")
      ).token;
      api.post("/student/upload", formData).then(data => {
        console.log(data);
        this.is_s = true;
        $event.target.value = "";
      });
    },
    changeVisible(val, uploadName, id) {
      this.visible = true;
      this.yijian = val;
      this.title = "修改意见";
      this.color = "danger";
      this.btColor = "secondary";
      this.uploadName = uploadName;
      this.id = id;
    },
    none () {
      this.visible = false;
      this.yijian = '';
      this.title = "";
      this.color = "";
      this.btColor = "";
      this.uploadName = '';
      this.id = '';
    },
    review (val, uploadName, id) {
      this.visible = true;
      this.yijian = val;
      this.title = "批改意见";
      this.color = "success";
      this.btColor = "info";
      this.uploadName = uploadName;
      this.id = id;
    }
  },
  watch: {
    is_s() {
      setTimeout(() => {
        this.is_s = false;
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped src='../../style/student.scss'>
</style>

