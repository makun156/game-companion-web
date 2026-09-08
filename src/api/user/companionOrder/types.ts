import type { CompanionOrderStatus } from './index';

export interface CompanionOrderVO {
  /** 主键 */
  id: string | number;

  /** 订单号 */
  orderNo: string;

  /** 订单状态 */
  orderStatus: string;

  /** 订单总金额（分） */
  totalAmount: number;

  /** 已支付金额（分） */
  paidAmount: number;

  /** 已退款金额（分） */
  refundAmount: number;

  /** 预约时长（小时） */
  duration: number;

  /** 单价（分/小时） */
  unitPrice: number;

  /** 预约开始时间 */
  appointmentTime: string;

  /** 实际上单时间 */
  actualStartTime: string;

  /** 实际结束时间 */
  actualEndTime: string;

  /** 取消原因 */
  cancelReason: string;

  /** 取消时间 */
  cancelTime: string;

  /** 创建时间 */
  createTime: string;

  /** 备注 */
  remark: string;

  // ========== 关联字段 ==========

  /** 商户ID */
  merchantId: number;

  /** 商户名称 */
  merchantName: string;

  /** 下单用户昵称 */
  userNickName: string;

  /** 下单用户手机号 */
  userPhone: string;

  /** 陪玩名称 */
  companionName: string;

  /** 陪玩昵称 */
  companionNickName: string;

  /** 陪玩手机号 */
  companionPhone: string;

  /** 陪玩头像 */
  companionAvatar: string;

  /** 游戏名称 */
  gameName: string;

  /** 游戏段位名称 */
  gameLevelName: string;

  /** 支付订单号 */
  payOrderNo: string;

  /** 微信支付交易号 */
  transactionId: string;

  /** 支付时间 */
  payTime: string;
}

export interface CompanionOrderForm {
  /** 主键 */
  id?: string | number;

  /** 订单号 */
  orderNo?: string;

  /** 下单用户ID */
  userId?: number;

  /** 商户ID */
  merchantId?: number;

  /** 陪玩用户ID */
  companionUserId?: number;

  /** 游戏ID */
  gameId?: number;

  /** 游戏段位ID */
  gameLevelId?: number;

  /** 预约时长（小时） */
  duration?: number;

  /** 单价（分/小时） */
  unitPrice?: number;

  /** 订单总金额（分） */
  totalAmount?: number;

  /** 已支付金额（分） */
  paidAmount?: number;

  /** 已退款金额（分） */
  refundAmount?: number;

  /** 预约开始时间 */
  appointmentTime?: string;

  /** 实际上单时间 */
  actualStartTime?: string;

  /** 实际结束时间 */
  actualEndTime?: string;

  /** 订单状态 */
  orderStatus?: string;

  /** 取消原因 */
  cancelReason?: string;

  /** 取消时间 */
  cancelTime?: string;

  /** 备注 */
  remark?: string;
}

export interface CompanionOrderQuery extends PageQuery {
  /** 订单号 */
  orderNo?: string;

  /** 下单用户ID */
  userId?: number;

  /** 商户ID */
  merchantId?: number;

  /** 陪玩用户ID */
  companionUserId?: number;

  /** 游戏ID */
  gameId?: number;

  /** 游戏段位ID */
  gameLevelId?: number;

  /** 订单状态 */
  orderStatus?: string;

  /** 预约开始时间 */
  appointmentTime?: string;

  /** 下单时间范围参数 */
  params?: any;
}
