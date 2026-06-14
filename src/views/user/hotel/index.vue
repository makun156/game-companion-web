<template>
  <div class="p-2" v-hasPermi="['user:hotel:list']">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商家名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入商家名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="城市区域" prop="city">
              <el-tree-select
                v-model="queryParams.city"
                :props="{ label: 'name' }"
                check-strictly
                filterable
                clearable
                node-key="id"
                lazy
                :load="handleCityLoad"
                placeholder="请选择城市区域"
              />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="queryParams.phone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable >
                <el-option v-for="dict in business_use_status" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['user:hotel:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['user:hotel:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['user:hotel:remove']">删除</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="hotelList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="商家名称" align="center" prop="name" />
        <el-table-column label="商家logo" align="center" prop="avatarUrl" width="100">
          <template #default="scope">
            <image-preview :src="scope.row.avatarUrl" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="城市区域" align="center" prop="city">
          <template #default="scope">
            {{ findCityName(scope.row.city) }}
          </template>
        </el-table-column>
        <el-table-column label="商家详细地址" align="center" prop="address" />
        <el-table-column label="营业时间" align="center" prop="businessHours" />
        <el-table-column label="联系电话" align="center" prop="phone" />
        <el-table-column label="评分" align="center" prop="rating" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="business_use_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right"  class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['user:hotel:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['user:hotel:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改商家表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="650px" append-to-body>
      <el-form ref="hotelFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="商家logo" prop="avatar">
          <image-upload v-model="form.avatar"/>
        </el-form-item>
        <el-form-item label="城市区域" prop="city">
          <el-tree-select
            v-model="form.city"
            :props="{ label: 'name' }"
            check-strictly
            filterable
            node-key="id"
            lazy
            :load="handleCityLoad"
            placeholder="请选择城市区域"
          />
        </el-form-item>
        <el-form-item label="商家详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入商家详细地址" />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input v-model="form.businessHours" placeholder="请输入营业时间" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="商家介绍" prop="description">
          <el-input v-model="form.description" placeholder="请输入商家介绍" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
                v-for="dict in business_use_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
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

<script setup name="Hotel" lang="ts">
import { listHotel, getHotel, delHotel, addHotel, updateHotel } from '@/api/user/hotel';
import { HotelVO, HotelQuery, HotelForm } from '@/api/user/hotel/types';
import { listCity } from '@/api/city';
import { CityVO } from '@/api/city/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { business_use_status } = toRefs<any>(proxy?.useDict('business_use_status'));

const hotelList = ref<HotelVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

// 城市树形数据
const cityTreeData = ref<any[]>([]);
const allCityTreeData = ref<CityVO[]>([]);

const queryFormRef = ref<ElFormInstance>();
const hotelFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: HotelForm = {
  id: undefined,
  name: undefined,
  avatar: undefined,
  city: undefined,
  address: undefined,
  businessHours: undefined,
  phone: undefined,
  tags: undefined,
  description: undefined,
  status: undefined,
}
const data = reactive<PageData<HotelForm, HotelQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    city: undefined,
    phone: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "商家名称不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "城市区域不能为空", trigger: "change" }
    ],
    phone: [
      { required: true, message: "联系电话不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 加载城市树形数据（一次请求，缓存全量树，逐层懒加载渲染） */
const loadCityTree = async () => {
  const res = await listCity();
  const treeData = proxy?.handleTree<CityVO>(res.data, 'id', 'parentId') || [];
  // 缓存完整树
  allCityTreeData.value = treeData;
  // 只取省份级别，标记是否有子节点
  cityTreeData.value = treeData.map((item) => ({
    id: item.id,
    name: item.name,
    isLeaf: !(item.children && item.children.length > 0)
  }));
};

/** 递归查找子节点 */
const findCityChildren = (data: CityVO[], id: number): CityVO[] | undefined => {
  for (const item of data) {
    if (String(item.id) === String(id)) return item.children;
    if (item.children) {
      const found = findCityChildren(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

/** 城市树懒加载子级 */
const handleCityLoad = (node: any, resolve: (data: any[]) => void) => {
  if (node.level === 0) {
    resolve(cityTreeData.value);
    return;
  }
  const children = findCityChildren(allCityTreeData.value, node.data.id);
  if (children && children.length > 0) {
    resolve(
      children.map((item) => ({
        id: item.id,
        name: item.name,
        isLeaf: !(item.children && item.children.length > 0)
      }))
    );
  } else {
    resolve([]);
  }
};

/** 根据城市ID查找城市名称 */
const findCityName = (id: string | number): string => {
  const findInTree = (data: CityVO[]): string | null => {
    for (const item of data) {
      if (String(item.id) === String(id)) return item.name;
      if (item.children) {
        const found = findInTree(item.children);
        if (found) return found;
      }
    }
    return null;
  };
  return findInTree(allCityTreeData.value) || String(id);
};

/** 查询商家表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listHotel(queryParams.value);
  hotelList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  hotelFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: HotelVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加商家表";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: HotelVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getHotel(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改商家表";
}

/** 提交按钮 */
const submitForm = () => {
  hotelFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateHotel(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addHotel(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: HotelVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除商家表编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delHotel(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

onMounted(() => {
  getList();
  loadCityTree();
});
</script>
