import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CompanionOrderVO, CompanionOrderForm, CompanionOrderQuery } from '@/api/user/companionOrder/types';

/**
 * 订单状态枚举（与后端 CompanionOrderStatus 对应）
 */
export enum CompanionOrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDING = 'REFUNDING',
  REFUNDED = 'REFUNDED'
}

/** 订单状态中文映射 */
export const CompanionOrderStatusMap: Record<string, string> = {
  [CompanionOrderStatus.PENDING_PAYMENT]: '待支付',
  [CompanionOrderStatus.PAID]: '已支付',
  [CompanionOrderStatus.IN_PROGRESS]: '进行中',
  [CompanionOrderStatus.COMPLETED]: '已完成',
  [CompanionOrderStatus.CANCELLED]: '已取消',
  [CompanionOrderStatus.EXPIRED]: '已过期',
  [CompanionOrderStatus.REFUNDING]: '退款中',
  [CompanionOrderStatus.REFUNDED]: '已退款'
};

/**
 * 分页查询陪玩订单列表
 * @param query 查询参数
 */
export const listCompanionOrder = (query?: CompanionOrderQuery): AxiosPromise<CompanionOrderVO[]> => {
  return request({
    url: '/pay/companion/order/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询陪玩订单详情
 * @param id 主键
 */
export const getCompanionOrder = (id: string | number): AxiosPromise<CompanionOrderVO> => {
  return request({
    url: '/pay/companion/order/' + id,
    method: 'get'
  });
};


