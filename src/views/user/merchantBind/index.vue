<template>
  <div class="p-2" v-hasPermi="['user:merchantBind:list']">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商户名称" prop="merchantName">
              <el-input v-model="queryParams.merchantName" placeholder="请输入商户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="陪玩名称" prop="companionName">
              <el-input v-model="queryParams.companionName" placeholder="请输入陪玩名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="绑定状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择绑定状态" clearable>
                <el-option label="正常" value="0" />
                <el-option label="已解绑" value="1" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['user:merchantBind:add']">新增绑定</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Connection" @click="handleBatchBind" v-hasPermi="['user:merchantBind:add']">批量绑定</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleUnbind()" v-hasPermi="['user:merchantBind:remove']">解绑</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="bindingList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="陪玩名称" align="center" prop="companionName" />
        <el-table-column label="商户名称" align="center" prop="merchantName" />
        <el-table-column label="绑定状态" align="center" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'info'">
              {{ scope.row.status === '0' ? '正常' : '已解绑' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180" />
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="解绑" placement="top">
              <el-button link type="danger" icon="Delete" @click="handleUnbind(scope.row)" v-hasPermi="['user:merchantBind:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 新增绑定对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="bindingFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="选择商户" prop="merchantId">
          <el-select v-model="form.merchantId" placeholder="请选择商户" filterable clearable style="width: 100%">
            <el-option
              v-for="item in merchantOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择陪玩" prop="companionId">
          <el-select v-model="form.companionId" placeholder="请选择陪玩" filterable clearable style="width: 100%">
            <el-option
              v-for="item in companionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
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

    <!-- 批量绑定对话框 -->
    <el-dialog title="批量绑定" v-model="batchDialog.visible" width="500px" append-to-body>
      <el-form ref="batchFormRef" :model="batchForm" label-width="100px">
        <el-form-item label="选择商户" prop="merchantId">
          <el-select v-model="batchForm.merchantId" placeholder="请选择商户" filterable clearable style="width: 100%">
            <el-option
              v-for="item in merchantOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择陪玩" prop="companionIds">
          <el-select v-model="batchForm.companionIds" placeholder="请选择陪玩" multiple filterable style="width: 100%">
            <el-option
              v-for="item in companionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="batchButtonLoading" type="primary" @click="submitBatchBind">确 定</el-button>
          <el-button @click="batchDialog.visible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MerchantBinding" lang="ts">
import {
  listMerchantBinding,
  addMerchantBinding,
  batchBindMerchantBinding,
  unbindMerchantBinding,
  unbindBatchMerchantBinding
} from '@/api/user/merchanBind';
import { MerchantBindingVO, MerchantBindingQuery, MerchantBindingForm, MerchantBindingBatchBindForm } from '@/api/user/merchanBind/types';
import { listHotel } from '@/api/user/hotel';
import { listGameCompanionUser } from '@/api/user/companion';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const bindingList = ref<MerchantBindingVO[]>([]);
const buttonLoading = ref(false);
const batchButtonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const companionOptions = ref<{ id: string | number; name: string }[]>([]);
const merchantOptions = ref<{ id: string | number; name: string }[]>([]);

const queryFormRef = ref<ElFormInstance>();
const bindingFormRef = ref<ElFormInstance>();
const batchFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const batchDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MerchantBindingForm = {
  id: undefined,
  companionId: undefined,
  merchantId: undefined,
  status: undefined
};

const data = reactive<PageData<MerchantBindingForm, MerchantBindingQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companionName: undefined,
    merchantName: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    companionId: [
      { required: true, message: '请选择陪玩', trigger: 'change' }
    ],
    merchantId: [
      { required: true, message: '请选择商户', trigger: 'change' }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

const batchForm = reactive<MerchantBindingBatchBindForm>({
  companionIds: [],
  merchantId: undefined
});

/** 加载陪玩选项 */
const loadCompanionOptions = async () => {
  const res = await listGameCompanionUser({ pageNum: 1, pageSize: 9999, params: {} });
  companionOptions.value = (res.rows || []).map((item: any) => ({
    id: item.id,
    name: item.name
  }));
};

/** 加载商户选项 */
const loadMerchantOptions = async () => {
  const res = await listHotel({ pageNum: 1, pageSize: 9999, params: {} });
  merchantOptions.value = (res.rows || []).map((item: any) => ({
    id: item.id,
    name: item.name
  }));
};

/** 查询绑定关系列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMerchantBinding(queryParams.value);
  bindingList.value = res.rows;
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
  bindingFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MerchantBindingVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增绑定按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '新增绑定';
};

/** 批量绑定按钮操作 */
const handleBatchBind = () => {
  batchForm.companionIds = [];
  batchForm.merchantId = undefined;
  batchFormRef.value?.resetFields();
  batchDialog.visible = true;
};

/** 提交新增绑定 */
const submitForm = () => {
  bindingFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await addMerchantBinding(form.value).finally(() => (buttonLoading.value = false));
      proxy?.$modal.msgSuccess('绑定成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 提交批量绑定 */
const submitBatchBind = async () => {
  if (!batchForm.companionIds || batchForm.companionIds.length === 0) {
    proxy?.$modal.msgWarning('请选择至少一个陪玩');
    return;
  }
  if (!batchForm.merchantId) {
    proxy?.$modal.msgWarning('请选择商户');
    return;
  }
  batchButtonLoading.value = true;
  await batchBindMerchantBinding(batchForm).finally(() => (batchButtonLoading.value = false));
  proxy?.$modal.msgSuccess('批量绑定成功');
  batchDialog.visible = false;
  getList();
};

/** 解绑按钮操作 */
const handleUnbind = async (row?: MerchantBindingVO) => {
  const _ids = row?.id || ids.value;
  if (row) {
    await proxy?.$modal.confirm('是否确认解绑陪玩"' + row.companionName + '"与商户"' + row.merchantName + '"的绑定关系？').finally(() => (loading.value = false));
  } else {
    await proxy?.$modal.confirm('是否确认解绑选中的' + ids.value.length + '条绑定关系？').finally(() => (loading.value = false));
  }
  if (Array.isArray(_ids)) {
    await unbindBatchMerchantBinding(_ids);
  } else {
    await unbindMerchantBinding(_ids);
  }
  proxy?.$modal.msgSuccess('解绑成功');
  await getList();
};

onMounted(() => {
  getList();
  loadCompanionOptions();
  loadMerchantOptions();
});
</script>
