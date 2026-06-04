<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="游戏名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入游戏名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="游戏分类" prop="category">
              <el-select v-model="queryParams.category" placeholder="请选择游戏分类" clearable>
                <el-option v-for="dict in business_category" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in business_use_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['ruoyi-business:games:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['ruoyi-business:games:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['ruoyi-business:games:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['ruoyi-business:games:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="gamesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="false" />
        <el-table-column label="游戏名称" align="center" prop="name" />
        <el-table-column label="游戏图标地址" align="center" prop="iconUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.iconUrl" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="游戏分类" align="center" prop="category">
          <template #default="scope">
            <dict-tag :options="business_category" :value="scope.row.category" />
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="business_use_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ruoyi-business:games:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ruoyi-business:games:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改游戏列表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="700px" append-to-body>
      <el-form ref="gamesFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏图标地址" prop="icon">
          <image-upload v-model="form.icon" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="游戏分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择游戏分类">
            <el-option v-for="dict in business_category" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="dict in business_use_status" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Games" lang="ts">
import { listGames, getGames, delGames, addGames, updateGames } from '@/api/games/info';
import { GamesVO, GamesQuery, GamesForm } from '@/api/games/info/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { business_use_status, business_category } = toRefs<any>(proxy?.useDict('business_use_status', 'business_category'));

const gamesList = ref<GamesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const gamesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: GamesForm = {
  id: undefined,
  name: undefined,
  icon: undefined,
  description: undefined,
  category: undefined,
  sort: 1,
  status: undefined
};
const data = reactive<PageData<GamesForm, GamesQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    category: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    name: [{ required: true, message: '游戏名称不能为空', trigger: 'blur' }],
    icon: [{ required: true, message: '游戏图标不能为空', trigger: 'change' }],
    category: [{ required: true, message: '游戏分类不能为空', trigger: 'change' }],
    status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询游戏列表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listGames(queryParams.value);
  gamesList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  gamesFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: GamesVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加游戏列表';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: GamesVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getGames(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改游戏列表';
};

/** 提交按钮 */
const submitForm = () => {
  gamesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateGames(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addGames(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: GamesVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除游戏列表编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delGames(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    '/games/export',
    {
      ...queryParams.value
    },
    `games_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
