<template>
  <div>
    <div class="editHeader">
      <div class="leftBox">
        <input class="titleInput" placeholder="请输入标题" v-model="postForm.title" />
      </div>
      <div class="rightBox">
        <div class="autoSaveTip" v-if="autoSaveTip">文章已于{{ new Date().toTimeString().substring(0, 8) }}自动保存</div>
        <div class="publishBox">
          <el-popover :width="460" title="发布文章" trigger="click" v-model:visible="open">
            <template #reference>
              <!-- <el-button class="publishBtn">{{ id ? '更新' : '发布' }}</el-button> -->
              <el-button class="publishBtn">发布</el-button>
            </template>
            <el-form ref="ruleFormRef" :rules="rules" label-position="right" label-width="100px" :model="postForm"
              class="postForm">
              <el-form-item label="分类" prop="cate_id" style="width: 66%;">
                <el-select v-model="postForm.artcate_ids" placeholder="选择文章分类" :teleported="false" multiple>
                  <el-option v-for="item in options.artcateList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="封面图片" prop="cover_img">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleImage"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="postForm.cover_img" :src="postForm.cover_img" class="avatar">
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>
              </el-form-item>
            </el-form>
            <div class="dialog-footer">
              <el-button @click="open = false">取消</el-button>
              <el-button type="primary" @click="submitEssay(ruleFormRef)">确定</el-button>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <v-md-editor v-model="postForm.content" height="592px" placeholder="请输入内容" :disabled-menus="[]"
      @upload-image="handleUploadImage" @save="save"></v-md-editor>
  </div>
</template>

<script lang="ts">
export default { name: 'EditArticle' };
</script>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, onBeforeUnmount } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getAllCates } from '@/utils/API/article/artcate'
import { addArticle, uploadCover, uploadImgs, getArticleById, updateArticle, saveArticle } from '@/utils/API/article/article'
import type { UploadProps } from 'element-plus'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
// 文章内容
let id = ref<number>(-1)
// 自动保存定时器
let timeId = ref<undefined | NodeJS.Timeout>(undefined)
let autoSaveTip = ref(false)
// 控制提交面板的显隐
let open = ref(false)
const ruleFormRef = ref<FormInstance>()
// 文章分类及封面表单
const postForm = reactive<articlePostForm>({
  artcate_ids: [],
  cover_img: '',
  title: '',
  content: ''
})
// 校验规则
const rules = reactive<FormRules>({
  artcate_ids: [
    { type: "array", required: true, message: '请选择分类', trigger: 'change' },
  ],
  cover_img: [
    {
      required: true,
      message: '请插入封面图片',
      trigger: 'change',
    },
  ],
})
const options = reactive({ artcateList: [] as cateOptionList[] })
watch(postForm, (newValue, oldValue) => {
  autoSave()
}, { deep: true })
/**
*		为防止监听时   多次发送请求   使用防抖/节流
*		防抖:    将多次执行变为最后一次执行
*		节流:   将多次执行变为每隔一段时间执行
*/
const autoSave = () => {
  if (timeId.value) {
    clearTimeout(timeId.value)   //   清除定时器 
    autoSaveTip.value = false    //   不显示提示语
  }
  timeId.value = setTimeout(() => {     //   定时器
    console.log('防抖');
    if (!id.value) {
      saveArticle(postForm).then(res => {
        id.value = res.data
        autoSaveTip.value = true
      })
    } else {
      saveArticle(postForm, id.value).then(res => {
        autoSaveTip.value = true
      })
    }
  }, 2 * 30000)     //   操作结束后2min发送axios请求
}
const save = () => {
  if (!id.value) {
    saveArticle(postForm).then(res => {
      id.value = res.data
      autoSaveTip.value = true
    })
  } else {
    saveArticle(postForm, id.value).then(res => {
      autoSaveTip.value = true
    })
  }
}
// 上传封面变量及方法
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
const handleImage = (img: any) => {
  uploadCover(img).then((res: any) => {
    if (res.code === 1) return ElMessage.error(res.message)
    postForm.cover_img = `http://127.0.0.1:3007${res.data.srcUrl}`//拼接路径
    ElMessage.success('上传封面成功')
  })
}
const reset = () => {
  postForm.title = ''
  postForm.content = ''
  postForm.cover_img = ''
  postForm.artcate_ids = []
}
const handleUploadImage = (event: any, insertImage: any, files: any) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  console.log(files);

  for (let i in files) {
    const formData = new FormData();
    formData.append('file', files[i]);
    uploadImgs(formData).then(res => {
      insertImage({
        url: `http://127.0.0.1:3007${res.data.srcUrl}`,
        desc: 'DESC',
      })
    },
      error => {
        console.log('请求失败了', error.message)
      })
  }
}
const submitEssay = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      const form = {
        ...postForm,
      }
      if (!id.value) {
        addArticle(form).then(res => {
          open.value = false
          reset()
          router.replace({
            name: 'Published',
            params: {
              id: id.value
            }
          })
        })
      } else {
        const article_id = Number(id.value)
        const updateForm = {
          ...form,
        }
        updateArticle(article_id, updateForm).then(res => {
          open.value = false
          reset()
          router.replace({
            name: 'Published',
            params: {
              id: id.value
            }
          })
        })
      }
    }
  })
}
onMounted(() => {
  id.value = Number(route.params.id)
  // 获取分类数据
  getAllCates().then(res => {
    options.artcateList = res.data
    console.log(id.value);

    if (id.value) {
      const essayId = id.value
      // 获取编辑的文章数据
      getArticleById(essayId).then(res => {
        document.title = `写文章 - ${res.data.title}`
        postForm.title = res.data.title
        postForm.content = res.data.content
        postForm.cover_img = res.data.cover_img
        postForm.artcate_ids = res.data.artcates.map((item: any) => {
          if (item.id) {
            return item.id
          }
        })
      })
    }
  })
})
onBeforeUnmount(() => {
  window.clearTimeout(timeId.value);
})
</script>

<style lang="scss" scoped>
.editHeader {
  display: flex;
  align-items: center;
  padding: 0 27px;
  height: 5.334rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  z-index: 100;
}

.leftBox {
  width: 85%;

  .titleInput {
    margin: 0;
    padding: 0;
    font-size: 24px;
    font-weight: 500;
    color: #1d2129;
    border: none;
    outline: none;
    width: 100%;
    overflow: visible;
  }
}

.rightBox {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .autoSaveTip {
    margin-left: 8px;
    margin-right: 8px;
    font-size: 14px;
    white-space: nowrap;
    color: #c9cdd4;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .publishBox {
    margin-left: 8px;
    margin-right: 8px;

    .publishBtn {
      height: 32px;
      padding: 2px 16px;
      font-size: 14px;
      line-height: 22px;
      border: 1px solid #1d7dfa;
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
      box-sizing: border-box;
      background-color: #1d7dfa;
    }
  }
}

.postForm {
  border-top: 1px solid #e5e6eb;
  border-bottom: 1px solid #e5e6eb;
  width: 100%;
  padding-top: 30px;
}

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
  border: 3px solid #d9d9d9;
  border-radius: 6px;
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
</style>