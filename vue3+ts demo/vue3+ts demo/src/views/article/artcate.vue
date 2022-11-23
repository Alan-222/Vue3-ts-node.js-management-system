<template>
  <div class="content-title">文章分类管理</div>
  <div class="content-container">
    <el-form class="table-Handler" :model="queryParams" ref="queryFormRef">
      <el-row :gutter="15">
        <el-col :span="1.5">
          <el-button color="#3c8dbc" :icon="CirclePlus" @click="handleAdd" v-hasPerm="['artcate:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button color="#3c8dbc" :icon="CirclePlus" @click="handleDelete" :disabled="select.multiple"
            v-hasPerm="['artcate:del']">删除</el-button>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="name" label="文章分类名称" v-hasPerm="['artcate:query']">
            <el-input placeholder="请输入文章分类名称" v-model="queryParams.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="alias" label="文章分类别名" v-hasPerm="['artcate:query']">
            <el-input placeholder="请输入文章分类别名" v-model="queryParams.alias"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-button color="#3c8dbc" :icon="Search" @click="handleQuery" v-hasPerm="['artcate:query']">搜索</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button color="#3c8dbc" :icon="Refresh" @click="resetQuery(queryFormRef)" v-hasPerm="['artcate:query']">重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table ref="multipleTableRef" :data="tableData.data" v-loading="loading"
      @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="id" label="分类id" align="center" />
      <el-table-column prop="name" label="分类名称" align="center" />
      <el-table-column prop="alias" label="分类别名" align="center" />
      <el-table-column label="状态" align="center" width="150">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleCheck(scope.row.id)">详情</el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row.id)" v-hasPerm="['artcate:edit']">编辑
          </el-button>
          <el-button link type="primary" size="small" @click="handleDelete(scope.row)" v-hasPerm="['artcate:del']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="queryParams.currentPage" v-model:page-size="queryParams.pageSize"
      :page-sizes="[1, 3, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="cateTotal"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top:20px" />
    <!-- 新增、编辑、详情弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="25%">
      <!-- 新增及编辑弹窗表单 -->
      <el-form :model="form" ref="editFormRef" :rules="rules" label-width="6em" :disabled="formDisabled">
        <el-form-item prop="name" label="分类名称">
          <el-input v-model="form.name" placeholder="请输入分类名称">
          </el-input>
        </el-form-item>
        <el-form-item prop="alias" label="分类别名">
          <el-input v-model="form.alias" placeholder="请输入分类别名">
          </el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose(editFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(editFormRef)" :loading="buttonLoading" v-if="showBtn">保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: 'Artcate' };
</script>

<script setup lang="ts">
import { CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElTable, ElMessageBox, ElMessage, FormInstance } from 'element-plus'
import { getArtcateList, deleteCatesById, getCatesById, updateArtcate, addArtcate } from '@/utils/API/article/artcate'

/**
 * 调用获取分类列表
 */
onMounted(() => {
  console.log(queryFormRef.value);

  // 获取分类列表
  getCatesListByPage()
})
/**
 * 获取分类列表
 */
// 分页参数
const queryParams = reactive<queryParams>({
  currentPage: 1,    // 当前页
  pageSize: 10,       // 每页条数
  name: undefined,
  alias: undefined
})
const queryFormRef = ref<FormInstance>()
let cateTotal = ref(0) // 数据总条数
let loading = ref(false)
let tableData = reactive({ data: [] })
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const select = reactive({
  ids: [],
  multiple: true
})
const handleSelectionChange = (selection: any) => {
  select.ids = selection.map((item: any) => item.id);
  select.multiple = !selection.length;
}
// 按照分页显示数据的函数
const getCatesListByPage = () => {
  loading.value = true
  // 发送ajax请求 把分页数据发送给后端
  getArtcateList(queryParams)
    .then(res => {
      // 接收后端返回的数据总条数 total 和 对应页码的数据 data
      let { count, rows } = res.data;
      // 赋值给对应的变量即可
      cateTotal.value = count;
      tableData.data = rows;
      // 如果当前页没有数据 且 排除第一页
      if (!rows.length && queryParams.currentPage !== 1) {
        // 页码减去 1
        queryParams.currentPage -= 1;
        // 再调用自己
        getCatesListByPage();
      }
    })
    .finally(() => {
      loading.value = false
    })
}
// 每页显示条数改变 就会触发这个函数
const handleSizeChange = (val: number) => {
  // 保存每页显示的条数
  queryParams.pageSize = val;
  queryParams.currentPage = 1;
  // 调用分页函数
  getCatesListByPage();
}
// 当前页码改变 就会触发这个函数
const handleCurrentChange = (val: number) => {
  // 保存当前页码
  queryParams.currentPage = val;
  // 调用分页函数
  getCatesListByPage();
}
/**
 * 分类编辑弹窗
 */
// 分类编辑弹窗变量及方法
let title = ref('')
let dialogFormVisible = ref(false)
let formDisabled = ref(false)
let showBtn = ref(true)
const editFormRef = ref<FormInstance>()
const rules = reactive({
  name: [
    { required: true, message: '分类名不能为空', trigger: 'blur' },
  ],
  alias: [
    { required: true, message: '分类别名不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '分类别名只能字母数字组成', trigger: 'blur' }
  ],
})
const form = reactive<artcateUpdateForm>({
  id: 0,
  name: '',
  alias: '',
  status: 1
})
const buttonLoading = ref(false)
const reset = () => {
  form.id = 0
  form.name = ''
  form.alias = ''
  form.status = 1
}
const resetQuery = (formEl: FormInstance | undefined) => {
  queryParams.name = undefined
  queryParams.alias = undefined
  formEl?.resetFields()
  getCatesListByPage();
}
const dialogClose = (formEl: FormInstance | undefined) => {
  dialogFormVisible.value = false
  formEl?.resetFields()
  reset()
  formDisabled.value = false
  showBtn.value = true
}
const handleQuery = () => {
  queryParams.currentPage = 1
  getCatesListByPage()
}
const handleAdd = () => {
  title.value = "添加分类信息"
  reset()
  dialogFormVisible.value = true
  formDisabled.value = false
  showBtn.value = true
}
const handleCheck = (id: number) => {
  loading.value = true
  reset()
  getCatesById(id).then(res => {
    loading.value = false
    form.id = res.data.id
    form.name = res.data.name
    form.alias = res.data.alias
    form.status = res.data.status
    dialogFormVisible.value = true
    title.value = '查看分类信息'
    formDisabled.value = true
    showBtn.value = false
  })
}
const handleEdit = (id: number) => {
  loading.value = true
  reset()
  formDisabled.value = false
  getCatesById(id).then(res => {
    loading.value = false
    form.id = res.data.id
    form.name = res.data.name
    form.alias = res.data.alias
    form.status = res.data.status
    dialogFormVisible.value = true
    title.value = "编辑分类信息"
    formDisabled.value = false
    showBtn.value = true
  })
}
const handleDelete = (row: artcateUpdateForm) => {
  const ids = row.id || select.ids
  ElMessageBox.confirm(
    '是否确认删除用户编号为「' + ids + '」的数据项?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    loading.value = true
    deleteCatesById({ ids: ids }).then(res => {
      loading.value = false
      ElMessage.success(
        '删除成功'
      )
      const totalPage = Math.ceil((cateTotal.value - 1) / queryParams.pageSize) // 总页数
      queryParams.currentPage = queryParams.currentPage > totalPage ? totalPage : queryParams.currentPage
      queryParams.currentPage = queryParams.currentPage < 1 ? 1 : queryParams.currentPage
      getCatesListByPage()
    })
      .finally(() => {
        loading.value = false
      })
  })
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      buttonLoading.value = true
      if (form.id) {
        updateArtcate(form)
          .then((res) => {
            ElMessage.success('修改文章分类成功')
            // 关闭弹窗
            dialogClose(editFormRef.value)
            // 重新获取表格数据
            getCatesListByPage()
          })
          .finally(() => {
            buttonLoading.value = false
          })
      } else {
        addArtcate({ name: form.name, alias: form.alias })
          .then((res) => {
            ElMessage.success('新增文章分类成功')
            // 关闭弹窗
            dialogClose(editFormRef.value)
            // 重新获取表格数据
            getCatesListByPage()
          })
          .finally(() => {
            buttonLoading.value = false
          })
      }
    }
  })
}

</script>
