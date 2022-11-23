<template>
  <div>
    <el-form :model="article" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="article.title" placeholder="请输入文章标题" :disabled="true" />
      </el-form-item>
      <el-form-item label="封面图" prop="cover_img">
        <el-image :src="article.cover_img" alt="封面图" class="coverImg" fit="contain">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <icon-picture />
              </el-icon>
            </div>
          </template>
        </el-image>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <el-button key="primary" type="primary" text @click="innerVisible = true">点击查看内容</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="checkSuccess">审核通过</el-button>
      <el-button type="danger" @click="checkFail" v-if="checkState === 0">审核不通过</el-button>
    </div>
    <el-dialog v-model="innerVisible" width="60%" title="文章内容" append-to-body>
      <v-md-preview :text="article.content"></v-md-preview>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="innermostVisible" width="30%" title="审核不通过" append-to-body>
      <el-form ref="ruleFormRef" :model="checkForm" :rules="rule" label-width="9em">
        <el-form-item label="审核不通过原因" prop="check_reason">
          <el-input v-model="checkForm.check_reason" placeholder="请输入文章审核不通过的原因" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innermostVisible = false">关闭</el-button>
        <el-button @click="submitForm(ruleFormRef)" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: 'CheckArticle' };
</script>

<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { ElMessage, FormInstance } from 'element-plus'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { checkArtcile, getArticleById } from '@/utils/API/article/article';

// 获取文章id并监听
const prop = defineProps(['id'])
const emit = defineEmits(['closeDialog', 'getStateCount', 'getArticleList', 'resetId'])
/**
 * 审核弹窗表单项及方法
 */
const article = reactive<checkArticleForm>({
  title: '',
  content: '',
  cover_img: ''
})
const checkState = ref(0)
// 审核通过
const checkSuccess = () => {
  const updateInfo = {
    id: prop.id,
    check_state: 1
  }
  checkArtcile(updateInfo).then(res => {
    ElMessage.success('更新文章状态成功')
    close()
    emit('getStateCount')
    emit('getArticleList')
  })
}
// 审核失败
const checkFail = () => {
  innermostVisible.value = true
}
/**
 * 文章内容弹窗项
 */
// 文章内容弹窗
const innerVisible = ref(false)
/**
 * 审核不通过弹窗项及方法
 */
// 审核不通过原因弹窗
const innermostVisible = ref(false)
// 审核不通过表单
const ruleFormRef = ref<FormInstance>()


const checkForm = reactive({
  check_reason: ''
})
const rule = reactive({
  check_reason: { required: true, message: "审核不通过原因不能为空", trigger: "blur" }

})

const reset = () => {
  article.title = ''
  article.cover_img = ''
  article.content = ''
  checkForm.check_reason = ''
}
const close = () => {
  emit('closeDialog')
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const updateInfo = {
        id: prop.id,
        check_state: 2,
        check_reason: checkForm.check_reason
      }
      checkArtcile(updateInfo).then(res => {
        ElMessage.success('更新文章状态成功')
        innermostVisible.value = false
        close()
        emit('getStateCount')
        emit('getArticleList')
      })
    }
  })
}
watchEffect(() => {
  reset()
  getArticleById(prop.id).then(res => {
    checkState.value = res.data.check_state
    article.title = res.data.title
    article.content = res.data.content
    article.cover_img = res.data.cover_img
  })
}
)
</script>

<style lang="scss" scoped>
.coverImg {
  max-width: 150px;
  max-height: 150px;
  width: 100%;
  height: 150px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>