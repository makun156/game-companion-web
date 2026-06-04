<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="区域名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入区域名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="层级" prop="level">
              <el-select v-model="queryParams.level" placeholder="请选择层级" clearable>
                <el-option v-for="dict in business_city_level" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="城市全称" prop="fullName">
              <el-input v-model="queryParams.fullName" placeholder="请输入城市全称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="queryParams.sort" placeholder="请输入排序" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd()" v-hasPermi="['city:info:add']">新增</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>
      <el-table
        ref="cityTableRef"
        v-loading="loading"
        :data="cityList"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        lazy
        :load="handleLoadChildren"
      >
        <el-table-column label="区域名称" prop="name" />
        <el-table-column label="层级" align="center" prop="level">
          <template #default="scope">
            <dict-tag :options="business_city_level" :value="scope.row.level" />
          </template>
        </el-table-column>
        <el-table-column label="城市全称" align="center" prop="fullName" />
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="business_use_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['city:info:edit']" />
            </el-tooltip>
            <el-tooltip content="新增" placement="top" v-if="scope.row.level < 3">
              <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['city:info:add']" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="false">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['city:info:remove']" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改区域对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="cityFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="层级" prop="level">
          <el-select v-model="form.level" placeholder="请选择层级">
            <el-option v-for="dict in formLevelOptions" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市全称" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入城市全称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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

<script setup name="City" lang="ts">
import { listCity, getCity, delCity, addCity, updateCity } from '@/api/city';
import { CityVO, CityQuery, CityForm } from '@/api/city/types';

// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: any;
  return function(this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

type CityOption = {
  id: number;
  name: string;
  children?: CityOption[];
};

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { business_city_level, business_use_status } = toRefs<any>(proxy?.useDict('business_city_level', 'business_use_status'));

const cityList = ref<CityVO[]>([]);
const allCityData = ref<CityVO[]>([]); // 缓存完整树数据，展开时从内存取子级
const buttonLoading = ref(false);
const showSearch = ref(true);
const loading = ref(false);
const searchLoading = ref(false); // 搜索加载状态

const queryFormRef = ref<ElFormInstance>();
const cityFormRef = ref<ElFormInstance>();
const cityTableRef = ref<ElTableInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const formLevelOptions = ref<any[]>([]); // 新增时根据父级层级过滤后的层级选项

const initFormData: CityForm = {
  name: undefined,
  level: undefined,
  fullName: undefined,
  sort: undefined,
  status: undefined
};

const data = reactive<PageData<CityForm, CityQuery>>({
  form: { ...initFormData },
  queryParams: {
    name: undefined,
    level: undefined,
    fullName: undefined,
    sort: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    name: [{ required: true, message: '区域名称不能为空', trigger: 'blur' }],
    level: [{ required: true, message: '层级不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询区域列表，只展示省份，展开时从内存取子级渲染 */
const getList = async () => {
  loading.value = true;
  const res = await listCity(queryParams.value);
  const treeData = proxy?.handleTree<CityVO>(res.data, 'id', 'parentId') || [];
  // 缓存完整树
  allCityData.value = treeData;
  // 只取省份级别展示，标记有子节点
  cityList.value = treeData.map(item => ({
    ...item,
    children: undefined,
    hasChildren: (item.children && item.children.length > 0) || false
  }));
  loading.value = false;
};

/** 懒加载子级数据（从缓存树中查找，不发额外请求） */
const findChildrenById = (data: CityVO[], id: string | number): CityVO[] | undefined => {
  for (const item of data) {
    if (String(item.id) === String(id)) return item.children;
    if (item.children) {
      const found = findChildrenById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

const handleLoadChildren = (row: CityVO, _treeNode: any, resolve: (data: CityVO[]) => void) => {
  const children = findChildrenById(allCityData.value, row.id!);
  if (children && children.length > 0) {
    resolve(children.map(item => ({
      ...item,
      children: undefined,
      hasChildren: (item.children && item.children.length > 0) || false
    })));
  } else {
    resolve([]);
  }
};

/** 搜索按钮操作（带防抖） */
const handleQuery = debounce(() => {
  getList();
}, 300);

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 取消按钮
const cancel = () => {
  reset();
  dialog.visible = false;
};

// 表单重置
const reset = () => {
  form.value = { ...initFormData };
  cityFormRef.value?.resetFields();
};

/** 新增按钮操作 */
const handleAdd = (row?: CityVO) => {
  reset();
  if (row != null && row.id) {
    form.value.parentId = row.id;
    // 过滤掉当前行及以上的层级，只展示下一级
    formLevelOptions.value = business_city_level.value.filter((item: any) => parseInt(item.value) > row.level!);
    // 自动选中下一级
    if (formLevelOptions.value.length > 0) {
      form.value.level = parseInt(formLevelOptions.value[0].value);
    }
  } else {
    form.value.parentId = 0;
    formLevelOptions.value = business_city_level.value;
  }
  dialog.visible = true;
  dialog.title = '添加区域';
};

/** 修改按钮操作 */
const handleUpdate = async (row: CityVO) => {
  reset();
  formLevelOptions.value = business_city_level.value; // 修改时展示所有层级选项
  if (row != null) {
    form.value.parentId = row.parentId;
  }
  const res = await getCity(row.id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改区域';
};

/** 提交按钮 */
const submitForm = () => {
  cityFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCity(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCity(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row: CityVO) => {
  await proxy?.$modal.confirm('是否确认删除区域编号为"' + row.id + '"的数据项？');
  loading.value = true;
  await delCity(row.id).finally(() => (loading.value = false));
  await getList();
  proxy?.$modal.msgSuccess('删除成功');
};

onMounted(() => {
  getList();
});
</script>
