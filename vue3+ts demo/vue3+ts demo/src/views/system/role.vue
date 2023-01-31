<template>
  <div class="content-title">角色管理</div>
  <div class="content-container">
    <!-- 搜索栏、表格 -->
    <dataTable ref="dataTableRef" :requestApi="listRolePages" :tableColumn="tableColumn" :otherConfig="otherConfig"
      :pageSizes="[1, 3, 5, 10]" :dict="dict" selection="multiple" :tableColumnConfig="tableColumnConfig"
      :setupConfig="setupConfig" :searchConfig="searchConfig" :searchReset="searchReset"
      :searchBtnConfig="searchBtnConfig" border>
      <!-- 角色项插槽 -->
      <template #status="{ row, index }">
        <el-tag v-if="row.status === 1" type="success">启用</el-tag>
        <el-tag v-else type="info">禁用</el-tag>
      </template>
      <!-- 批量操作按钮插槽 -->
      <template #multiple-operation="{ selectionData }">
        <el-button color="#3c8dbc" :icon="CirclePlus" v-hasPerm="['system:role:add']" @click="handleAdd">新增
        </el-button>
        <el-button color="#3c8dbc" :icon="Remove" @click="handleDelete(selectionData)" v-hasPerm="['system:role:del']"
          :disabled="!selectionData.length">批量删除</el-button>
      </template>
      <!-- 表格操作栏按钮插槽 -->
      <template #setup="{ row, index }">
        <el-button link type="primary" size="small" v-hasPerm="['system:role:edit']"
          @click.stop="openRoleResourceDialog(row)">
          分配资源</el-button>
        <el-button link type="primary" size="small" v-hasPerm="['system:role:edit']" @click="handleUpdate(row)">
          编辑</el-button>
        <el-button link type="primary" size="small" v-hasPerm="['system:role:del']" @click="handleDelete(row)">
          删除</el-button>
      </template>
    </dataTable>

    <!-- 表单弹窗 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" destroy-on-close>
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="formData.role_name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入角色描述" />
        </el-form-item>

        <el-form-item label="状态" props="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFormData">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--分配资源弹窗-->
    <el-dialog :title="'【' + checkedRole.name + '】资源分配'" v-model="resourceDialogVisible" width="800px">
      <el-scrollbar max-height="600px">
        <el-tree ref="resourceRef" node-key="value" show-checkbox :data="resourceOptions" :default-expand-all="true"
          @check-change="handleResourceCheckChange">
          <template #default="{ node, data }" class="resource-tree">
            <span>{{ data.label }}</span>

            <span v-if="data.perms" class="resource-tree-node">
              <el-divider direction="vertical" />
              <span class="node-content">
                <!-- <el-checkbox v-for="perm in data.perms" :key="perm.value" :label="perm.value" border size="small"
                  v-model="btnPerms[perm.value]" @change="(checked: boolean) => checkbtn(checked, perm, node)">{{
                      perm.label
                  }}
                </el-checkbox> -->
                <el-checkbox-group v-model="data.buttons" @change="checkBtn(node)">
                  <el-checkbox v-for="perm in data.perms" :label="perm.permission" border size="small">
                    {{
                      perm.label
                    }}
                  </el-checkbox>
                </el-checkbox-group>
              </span>
            </span>
          </template>
        </el-tree>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleRoleResourceSubmit">确 定</el-button>
          <el-button @click="cancelResourceAssign">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default { name: 'Role' };
</script>


<script setup lang="ts">
import dataTable from '@/components/table/table.vue'
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue';
import {
  listRolePages,
  updateRole,
  getRoleFormDetail,
  addRole,
  deleteRoles,
  getRoleResources,
  updateRoleResource
} from '@/utils/Api/user/role';
import { listMenuOptions } from '@/utils/Api/user/menu';
import { ElForm, ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { Search, CirclePlus, Remove } from '@element-plus/icons-vue';

/**
 * 表格参数
 */
const dataTableRef = ref()
const tableState = reactive({
  tableColumn: [
    { prop: 'role_id', label: '角色编号' },
    { prop: 'role_name', label: '角色名称' },
    { prop: 'remark', label: '角色描述' },
    { prop: 'status', label: '状态', dictCode: 'status', slot: true },
    { prop: 'create_time', label: '创建时间' },
    { prop: 'update_time', label: '更新时间' },
  ],
  tableColumnConfig: {
    align: "center"
  },
  otherConfig: {
    list: 'rows'
  },
  setupConfig: {
    fixed: "right",
    align: "center"
  },
  dict: {
    status: [
      { code: 0, name: '停用' },
      { code: 1, name: '启用' }
    ]
  },
  searchConfig: [
    { type: 'input', prop: 'role_name', label: "角色名称" },
    {
      type: 'select',
      prop: 'status',
      label: '状态',
      selectList: [
        { code: 0, name: '停用' },
        { code: 1, name: '启用' }
      ],
      listLabel: 'name',
      listValue: 'code',
    }
  ],
  searchReset: {
    role_name: undefined,
    status: undefined
  },
  searchBtnConfig: {
    color: "#3c8dbc"
  }
})
const { tableColumn, tableColumnConfig, otherConfig, setupConfig, dict, searchConfig, searchReset, searchBtnConfig } = toRefs(tableState)

const dataFormRef = ref(ElForm);
const resourceRef = ref(ElTree);
const state = reactive({
  roleList: [] as RoleItem[],
  total: 0,
  dialog: {
    title: '',
    visible: false
  },
  formData: {} as RoleFormData,
  rules: {
    role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
  },
  resourceDialogVisible: false,
  resourceOptions: [] as menuOptionsItem[],
  btnPerms: {} as any,
  buttons: [] as any[],
  // 勾选的菜单ID
  checkedMenuIds: new Set([]),
  allPermIds: [] as number[],
  // 选中的角色
  checkedRole: {
    id: 0,
    name: ''
  }
});
const {
  dialog,
  formData,
  rules,
  resourceDialogVisible,
  checkedRole,
  resourceOptions,
  btnPerms,
  buttons
} = toRefs(state);
function handleQuery() {
  dataTableRef.value.getData()
}

function handleAdd() {
  state.dialog = {
    title: '添加角色',
    visible: true
  };
}
function handleUpdate(row: any) {
  state.dialog = {
    title: '修改角色',
    visible: true
  };
  const roleId = row.role_id;
  getRoleFormDetail(roleId).then(({ data }) => {
    state.formData = data;
  });
}
function submitFormData() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData.role_id) {
        updateRole(state.formData.role_id as any, state.formData).then(() => {
          ElMessage.success('修改角色成功');
          cancel();
          handleQuery();
        });
      } else {
        addRole(state.formData).then(() => {
          cancel();
          ElMessage.success('新增角色成功');
          handleQuery();
        });
      }
    }
  });
}
/**
 * 取消
 */
function cancel() {
  dialog.value.visible = false;
  formData.value.role_id = undefined;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
}
/**
 *  删除
 */
function handleDelete(rows: RoleItem | RoleItem[]) {
  let ids: number | number[];
  if (Array.isArray(rows)) {
    ids = rows.map((item) => item.role_id)
  } else {
    ids = rows.role_id
  }
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteRoles({ role_ids: ids }).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}
const handleResourceCheckChange = (
  data: Resource,
  isCheck: boolean,
) => {
  // console.log('data', data);
  // console.log('isCheck', isCheck);
  // console.log('sonHasCheck', sonHasCheck);
  if (isCheck === false) {
    data.buttons = []
  }
  // if (isCheck === true) {
  //   if (data.perms) {
  //     data.buttons = data.perms.map((item) => {
  //       return item.permission;
  //     })
  //   }
  // }
  // if (data.perms) {
  //   data.perms.forEach(item => {
  //     btnPerms.value[item.value] = isCheck;
  //   });
  // }
};
function checkBtn(node: any) {
  // btnPerms.value
  if (buttons.value.length > 0) {
    const has = buttons.value.some((item, key) => {
      if (item.menu_id === node.data.value) {
        buttons.value[key].btns = node.data.buttons
        return true
      }
    })
    if (!has) {
      buttons.value.push({ 'menu_id': node.data.value, 'btns': node.data.buttons })
    }
  } else {
    buttons.value.push({ 'menu_id': node.data.value, 'btns': node.data.buttons })
  }
}
/**
 * 资源分配
 */
function openRoleResourceDialog(row: RoleItem) {
  resourceDialogVisible.value = true;
  const roleId: any = row.role_id;
  checkedRole.value = {
    id: roleId,
    name: row.role_name
  };
  // 获取所有的资源
  listMenuOptions().then(res => {
    // resourceOptions.value = res.data;
    resourceOptions.value = mergeTreeButton(res.data, row.buttons)
    // 获取角色拥有的资源
    getRoleResources(roleId).then(({ data }) => {
      // console.log(data);
      // 勾选的菜单回显
      const checkedMenuIds = data.menuIds;
      resourceRef.value.setCheckedKeys(checkedMenuIds);
      buttons.value = data.buttons
      nextTick(() => {
        // 勾选的权限回显
        // const rolePermIds = data.permIds;
        // state.allPermIds = filterResourcePermIds(res.data, []);
        // if (state.allPermIds) {
        //   state.allPermIds.forEach(permId => {
        //     if (rolePermIds.indexOf(permId) > -1) {
        //       btnPerms.value[permId] = true;
        //     } else {
        //       btnPerms.value[permId] = false;
        //     }
        //   });
        // }
      });
    });
  });
}
/** 组合次菜单 button */
function mergeTreeButton(tree: menuOptions, buttons = []) {
  tree.forEach((item, key) => {
    tree[key].buttons = []
    console.log(buttons);
    buttons.filter((_item: buttons) => {
      if (_item.menu_id === item.value) {
        tree[key].buttons = _item.btns
        return true
      }
    })
    if (item.children && item.children.length > 0) {
      mergeTreeButton(item.children, buttons)
    }
  })
  return tree
}
// const filterResourcePermIds = (resources: Resource[], permIds: number[]) => {
//   resources.forEach(resource => {
//     if (resource.perms) {
//       resource.perms.forEach(perm => {
//         permIds.push(perm.value);
//       });
//     }
//     if (resource.children) {
//       filterResourcePermIds(resource.children, permIds);
//     }
//   });
//   return permIds;
// };
/**
 * 分配资源提交
 */
function handleRoleResourceSubmit() {
  const checkedMenuIds: any[] = resourceRef.value
    .getCheckedNodes(false, true)
    .map((node: any) => node.value);
  // const checkedPermIds = [] as number[];
  // if (state.allPermIds) {
  //   state.allPermIds.forEach(permId => {
  //     if (btnPerms.value[permId]) {
  //       checkedPermIds.push(permId);
  //     }
  //   });
  // }
  // console.log(checkedMenuIds);
  const RoleResource = {
    menu_ids: checkedMenuIds,
    buttons: buttons.value
  };
  updateRoleResource(checkedRole.value.id, RoleResource).then(res => {
    ElMessage.success('分配权限成功');
    state.resourceDialogVisible = false;
    handleQuery();
  });
}
/**
 * 取消资源分配
 */
function cancelResourceAssign() {
  state.resourceDialogVisible = false;
}
</script>

<style lang="scss" scoped>
.resource-tree {
  display: flex;
  align-items: center;

  .resource-tree-node {
    // flex: 1;
    flex-wrap: wrap;
    display: flex;
    font-size: 14px;
    justify-content: flex-end;
    height: auto;

    // margin: 0 30px;
    .node-content {
      // width: 400px;
      // display: flex;
      // justify-content: flex-end;
      // flex-wrap: wrap;
    }

    .el-divider--vertical {
      height: 2em !important;
    }
  }
}

:deep(.el-tree-node__content) {
  height: auto !important;
}

.el-checkbox-group {
  // width: 100%;
  // display: flex;
  // align-items: flex-end;
  // flex-wrap: wrap;
  float: right;

  &:hover {
    background-color: var(--el-tree-node-hover-bg-color);
  }

  &:active {
    background-color: var(--el-tree-node-hover-bg-color);
  }
}

.el-checkbox.el-checkbox--small {
  margin: 0 5px;
  z-index: 999;
  background: #fff;
}
</style>