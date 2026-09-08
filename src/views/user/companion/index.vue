<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="陪玩名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入陪玩名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable>
                <el-option v-for="dict in business_gender" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="接单区域" prop="city">
              <el-input v-model="queryParams.city" placeholder="请输入接单区域" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option v-for="dict in business_use_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="工作状态" prop="workStatus">
              <el-select v-model="queryParams.workStatus" placeholder="请选择工作状态" clearable>
                <el-option v-for="dict in business_work_status" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['user:companion:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['user:companion:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['user:companion:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['user:companion:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="gameCompanionUserList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="陪玩名称" align="center" prop="name" />
        <el-table-column label="性别" align="center" prop="gender">
          <template #default="scope">
            <dict-tag :options="business_gender" :value="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column label="年龄" align="center" prop="age" />
        <el-table-column label="手机号" align="center" prop="phone" />
        <el-table-column label="头像" align="center" prop="avatarUrl">
          <template #default="scope">
            <el-image
              v-if="scope.row.avatarUrl"
              style="width: 50px; height: 50px"
              :src="scope.row.avatarUrl"
              :preview-src-list="[scope.row.avatarUrl]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="接单区域" align="center" prop="city">
          <template #default="scope">
            {{ findCityName(scope.row.city) }}
          </template>
        </el-table-column>
        <el-table-column label="自我介绍" align="center" prop="introduction" />
        <el-table-column label="标签" align="center" prop="tags" />
        <el-table-column label="小时价格" align="center" prop="pricePerHour" />
        <el-table-column label="接单量" align="center" prop="totalOrders" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="business_use_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="工作状态" align="center" prop="workStatus">
          <template #default="scope">
            <dict-tag :options="business_work_status" :value="scope.row.workStatus" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['user:companion:edit']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['user:companion:remove']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改陪玩表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="650px" append-to-body>
      <el-form ref="gameCompanionUserFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="陪玩名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入陪玩名称" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option v-for="dict in business_gender" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="1" :max="100" placeholder="请输入年龄" controls-position="right" class="w-full" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <image-upload v-model="form.avatar" :limit="1" />
        </el-form-item>
        <el-form-item label="语音介绍" prop="voice">
          <file-upload v-model="voiceId" :limit="1" :file-type="['mp3', 'wav', 'm4a', 'aac', 'amr', 'ogg']" :file-size="10" />
        </el-form-item>
        <el-form-item label="接单区域" prop="city">
          <el-tree-select
            v-model="form.city"
            :props="{ label: 'name' }"
            check-strictly
            filterable
            node-key="id"
            lazy
            :load="handleCityLoad"
            placeholder="请选择接单区域"
          />
        </el-form-item>
        <el-form-item label="自我介绍" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="请输入自我介绍" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="小时价格" prop="pricePerHour">
          <el-input-number v-model="form.pricePerHour" :min="0" :precision="2" placeholder="请输入小时价格" controls-position="right" class="w-full" />
        </el-form-item>
        <el-form-item label="工作状态" prop="workStatus">
          <el-select v-model="form.workStatus" placeholder="请选择工作状态">
            <el-option v-for="dict in business_work_status" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相册" prop="photos">
          <image-upload v-model="photoIds" :limit="5" />
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

<script setup name="GameCompanionUser" lang="ts">
import {
  listGameCompanionUser,
  getGameCompanionUser,
  delGameCompanionUser,
  addGameCompanionUser,
  updateGameCompanionUser
} from '@/api/user/companion';
import { GameCompanionUserVO, GameCompanionUserQuery, GameCompanionUserForm } from '@/api/user/companion/types';
import { listCity } from '@/api/city';
import { CityVO } from '@/api/city/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { business_work_status, business_use_status, business_gender } = toRefs<any>(
  proxy?.useDict('business_work_status', 'business_use_status', 'business_gender')
);

const gameCompanionUserList = ref<GameCompanionUserVO[]>([]);
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
const gameCompanionUserFormRef = ref<ElFormInstance>();
const photoIds = ref('');
const voiceId = ref('');

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: GameCompanionUserForm = {
  id: undefined,
  name: undefined,
  gender: undefined,
  age: undefined,
  phone: undefined,
  avatar: undefined,
  voice: undefined,
  city: undefined,
  introduction: undefined,
  tags: undefined,
  pricePerHour: undefined,
  workStatus: undefined,
  photos: undefined
};
const data = reactive<PageData<GameCompanionUserForm, GameCompanionUserQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    gender: undefined,
    age: undefined,
    phone: undefined,
    avatar: undefined,
    city: undefined,
    introduction: undefined,
    tags: undefined,
    pricePerHour: undefined,
    totalOrders: undefined,
    status: undefined,
    workStatus: undefined,
    params: {}
  },
  rules: {
    name: [{ required: true, message: '陪玩名称不能为空', trigger: 'blur' }],
    gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
    age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
    phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
    city: [{ required: true, message: '接单区域不能为空', trigger: 'change' }],
    pricePerHour: [{ required: true, message: '小时价格不能为空', trigger: 'blur' }]
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

/** 查询陪玩表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listGameCompanionUser(queryParams.value);
  gameCompanionUserList.value = res.rows;
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
  photoIds.value = '';
  voiceId.value = '';
  gameCompanionUserFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: GameCompanionUserVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加陪玩表';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: GameCompanionUserVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getGameCompanionUser(_id);
  Object.assign(form.value, res.data);
  // 如果详情接口未返回头像（null/undefined），删除该字段防止提交时覆盖已有头像
  if (!form.value.avatar) {
    delete form.value.avatar;
  }
  // 将 photos 数组转为逗号分隔的 ossId 字符串供 image-upload 组件回显
  if (res.data.photos && res.data.photos.length > 0) {
    photoIds.value = res.data.photos.join(',');
  }
  voiceId.value = res.data.voice || '';
  dialog.visible = true;
  dialog.title = '修改陪玩表';
};

/** 提交按钮 */
const submitForm = () => {
  gameCompanionUserFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      // 将 photoIds 字符串转回 oss id 数组格式
      if (photoIds.value) {
        form.value.photos = photoIds.value.split(',');
      } else {
        form.value.photos = [];
      }
      form.value.voice = voiceId.value;
      // 构建干净的提交数据，只包含业务字段，避免后端展示字段干扰
      const submitData = {
        id: form.value.id,
        name: form.value.name,
        gender: form.value.gender,
        age: form.value.age,
        phone: form.value.phone,
        avatar: form.value.avatar,
        voice: form.value.voice,
        city: form.value.city,
        introduction: form.value.introduction,
        tags: form.value.tags,
        pricePerHour: form.value.pricePerHour,
        workStatus: form.value.workStatus,
        photos: form.value.photos
      };
      // 头像为空时不发送，避免覆盖已有头像
      if (!submitData.avatar) {
        delete (submitData as any).avatar;
      }
      if (form.value.id) {
        await updateGameCompanionUser(submitData).finally(() => (buttonLoading.value = false));
      } else {
        await addGameCompanionUser(submitData).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: GameCompanionUserVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除陪玩表编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delGameCompanionUser(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'gameCompanion/gameCompanionUser/export',
    {
      ...queryParams.value
    },
    `gameCompanionUser_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  loadCityTree();
});
</script>
