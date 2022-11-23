<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">个人中心</span>
          <el-button type="primary" @click="handleEdit">修改<el-icon class="el-icon--right">
              <Upload />
            </el-icon>
          </el-button>
        </div>
      </template>
      <el-upload class="avatar-uploader" action="http://127.0.1:3007/my/update/avatar"
        :headers="{ Authorization: getToken() }" :show-file-list="false" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="store.state.user_pic" :src="store.state.user_pic" class="avatar">
        <i v-else class="avatar-uploader-icon">点击修改头像</i>
      </el-upload>
      <ul class="infoList">
        <li class="listItem">用户名：{{ store.state.username }}</li>
        <li class="listItem">昵称：{{ store.state.nickname }}</li>
        <li class="listItem">邮箱：{{ store.state.email }}</li>
      </ul>
    </el-card>
    <!-- 修改弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="编辑" width="30%" @close="dialogClose(ruleFormRef)">
      <el-form :model="form" ref="ruleFormRef" label-width="5em">
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称">
          </el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: 'PersonalCenter' };
</script>
<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';
import { updateUserInfo } from '@/utils/Api/user/personalCenter';
import { useStore } from 'vuex';
import type { UploadProps } from 'element-plus'
const store = useStore()

// 修改弹窗变量及方法
const ruleFormRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const form = reactive<userinfoForm>({
  nickname: '',
  email: '',
})
const handleEdit = () => {
  form.email = store.state.email
  form.nickname = store.state.nickname
  dialogFormVisible.value = true
}
const dialogClose = (formEl: FormInstance | undefined) => {
  formEl?.resetFields()   // 这里就是重置表单了~
  dialogFormVisible.value = false
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      updateUserInfo(form).then((res) => {
        ElMessage.success('修改成功')
        store.commit('updateUser', {
          username: store.state.username,
          nickname: res.data.nickname,
          email: res.data.email,
          user_pic: store.state.user_pic
        })
        dialogFormVisible.value = false

      })
    }
  })
}
// 更换头像变量及方法
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  console.log(file)
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!(isJPG || isPNG)) {
    ElMessage.error('上传头像图片只能是 JPG 和 PNG格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return (isPNG || isJPG) && isLt2M
}
const handleAvatarSuccess = (res: any) => {
  if (res.code === 1) return ElMessage.error(res.message)
  store.commit('updateUser', {
    username: store.state.username,
    nickname: store.state.nickname,
    email: store.state.email,
    user_pic: `http://127.0.0.1:3007/${res.data.srcUrl}`
  })
  // form.imageUrl = `http://127.0.0.1:3007/${res.srcurl}`//拼接路径
  ElMessage.success('上传图片成功')
}
// onMounted(() => {
//   getUserInfo().then(res => {
//     if (res.code === 0) {
//       userInfo.value = res.data
//       form.nickname = res.data.nickname
//       form.email = res.data.email
//       form.imageUrl = `http://127.0.0.1:3007/${res.data.user_pic}`
//     }
//   })
// })
</script>

<style lang="scss" scoped>
// 用户信息卡片
.box-card {
  width: 480px;
}

// 头部标题及按钮
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 20px;
}

.cardHandler {
  position: absolute;
  right: 0;
  top: 0;
}

// 用户信息列表
.avatar-uploader .el-upload {
  border: 3px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.infoList {
  list-style-type: none;
}

.listItem {
  margin-bottom: 18px;
  font-size: 16px;
}
</style>