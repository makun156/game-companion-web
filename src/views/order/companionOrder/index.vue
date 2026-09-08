<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="订单号" prop="orderNo">
              <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="订单状态" prop="orderStatus">
              <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable>
                <el-option v-for="dict in business_order_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间" prop="createTime">
              <el-date-picker
                v-model="dateRange"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('2000-01-01 00:00:00'), new Date('2000-01-01 23:59:59')]"
                @change="handleDateRangeChange"
              />
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
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['business:companion:order:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="companionOrderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="订单号" align="center" prop="orderNo" width="200" />
        <el-table-column label="用户昵称" align="center" prop="userNickName" min-width="120" />
        <el-table-column label="商户名称" align="center" prop="merchantName" min-width="120" />
        <el-table-column label="陪玩名称" align="center" prop="companionName" min-width="120" />
        <el-table-column label="游戏" align="center" prop="gameName" min-width="100" />
        <el-table-column label="段位" align="center" prop="gameLevelName" min-width="100" />
        <el-table-column label="单价(分/时)" align="center" prop="unitPrice" width="100" />
        <el-table-column label="预约时长" align="center" prop="duration" width="80" />
        <el-table-column label="已支付(分)" align="center" prop="paidAmount" width="100" />
        <el-table-column label="总金额(分)" align="center" prop="totalAmount" width="100" />
        <el-table-column label="下单时间" align="center" prop="createTime" width="160" />
        <el-table-column label="预约时间" align="center" prop="appointmentTime" width="160" />
        <el-table-column label="订单状态" align="center" prop="orderStatus" width="100">
          <template #default="scope">
            <dict-tag :options="business_order_status" :value="scope.row.orderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="80">
          <template #default="scope">
            <el-tooltip content="详情" placement="top">
              <el-button link type="primary" icon="View" @click="handleDetail(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号" :span="2">{{ form.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <dict-tag :options="business_order_status" :value="form.orderStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ form.createTime }}</el-descriptions-item>
        <el-descriptions-item label="总金额(分)">{{ form.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="已支付(分)">{{ form.paidAmount }}</el-descriptions-item>
        <el-descriptions-item label="已退款(分)">{{ form.refundAmount }}</el-descriptions-item>
        <el-descriptions-item label="预约时长(小时)">{{ form.duration }}</el-descriptions-item>
        <el-descriptions-item label="单价(分/小时)">{{ form.unitPrice }}</el-descriptions-item>
        <el-descriptions-item label="预约时间">{{ form.appointmentTime }}</el-descriptions-item>
        <el-descriptions-item label="实际上单时间">{{ form.actualStartTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="实际结束时间">{{ form.actualEndTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ form.userNickName }}</el-descriptions-item>
        <el-descriptions-item label="用户手机号">{{ form.userPhone }}</el-descriptions-item>
        <el-descriptions-item label="陪玩名称">{{ form.companionName }}</el-descriptions-item>
        <el-descriptions-item label="陪玩昵称">{{ form.companionNickName }}</el-descriptions-item>
        <el-descriptions-item label="陪玩手机号">{{ form.companionPhone }}</el-descriptions-item>
        <el-descriptions-item label="游戏名称">{{ form.gameName }}</el-descriptions-item>
        <el-descriptions-item label="段位名称">{{ form.gameLevelName }}</el-descriptions-item>
        <el-descriptions-item label="商户名称">{{ form.merchantName }}</el-descriptions-item>
        <el-descriptions-item label="支付单号">{{ form.payOrderNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="微信交易号">{{ form.transactionId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ form.payTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="取消原因" :span="2">{{ form.cancelReason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="取消时间">{{ form.cancelTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ form.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CompanionOrder" lang="ts">
import { listCompanionOrder, getCompanionOrder } from '@/api/user/companionOrder';
import { CompanionOrderVO, CompanionOrderQuery } from '@/api/user/companionOrder/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { business_order_status } = toRefs<any>(
  proxy?.useDict('business_order_status')
);

const companionOrderList = ref<CompanionOrderVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const dateRange = ref<any[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CompanionOrderVO = {
  id: undefined,
  orderNo: undefined,
  orderStatus: undefined,
  totalAmount: undefined,
  paidAmount: undefined,
  refundAmount: undefined,
  duration: undefined,
  unitPrice: undefined,
  appointmentTime: undefined,
  actualStartTime: undefined,
  actualEndTime: undefined,
  cancelReason: undefined,
  cancelTime: undefined,
  createTime: undefined,
  remark: undefined,
  merchantId: undefined,
  merchantName: undefined,
  userNickName: undefined,
  userPhone: undefined,
  companionName: undefined,
  companionNickName: undefined,
  companionPhone: undefined,
  companionAvatar: undefined,
  gameName: undefined,
  gameLevelName: undefined,
  payOrderNo: undefined,
  transactionId: undefined,
  payTime: undefined
};

const data = reactive<PageData<CompanionOrderVO, CompanionOrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNo: undefined,
    userId: undefined,
    merchantId: undefined,
    companionUserId: undefined,
    gameId: undefined,
    gameLevelId: undefined,
    orderStatus: undefined,
    appointmentTime: undefined,
    params: {}
  },
  rules: {}
});

const { queryParams, form, rules } = toRefs(data);

/** 处理日期范围变化 */
const handleDateRangeChange = (val: any[]) => {
  if (val && val.length === 2) {
    queryParams.value.params['beginCreateTime'] = val[0];
    queryParams.value.params['endCreateTime'] = val[1];
  } else {
    queryParams.value.params['beginCreateTime'] = undefined;
    queryParams.value.params['endCreateTime'] = undefined;
  }
};

/** 查询陪玩订单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCompanionOrder(queryParams.value);
  companionOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = [];
  queryParams.value.params = {};
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: CompanionOrderVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 详情按钮操作 */
const handleDetail = async (row: CompanionOrderVO) => {
  dialog.visible = true;
  dialog.title = '订单详情';
  const res = await getCompanionOrder(row.id);
  Object.assign(form.value, res.data);
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'business/companion/order/export',
    {
      ...queryParams.value
    },
    `companion_order_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
