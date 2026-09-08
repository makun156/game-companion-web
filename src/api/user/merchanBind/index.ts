import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MerchantBindingVO, MerchantBindingForm, MerchantBindingQuery, MerchantBindingBatchBindForm } from '@/api/user/merchanBind/types';

/**
 * 查询陪玩与商户绑定关系列表
 */
export const listMerchantBinding = (query?: MerchantBindingQuery): AxiosPromise<MerchantBindingVO[]> => {
  return request({
    url: '/user/merchantBind/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询绑定关系详细
 */
export const getMerchantBinding = (id: string | number): AxiosPromise<MerchantBindingVO> => {
  return request({
    url: '/user/merchantBind/' + id,
    method: 'get'
  });
};

/**
 * 新增绑定关系
 */
export const addMerchantBinding = (data: MerchantBindingForm) => {
  return request({
    url: '/user/merchantBind',
    method: 'post',
    data: data
  });
};

/**
 * 批量绑定陪玩到商户
 */
export const batchBindMerchantBinding = (data: MerchantBindingBatchBindForm) => {
  return request({
    url: '/user/merchantBind/batch-bind',
    method: 'post',
    params: data
  });
};

/**
 * 解绑（软删除）
 */
export const unbindMerchantBinding = (id: string | number) => {
  return request({
    url: '/user/merchantBind/' + id,
    method: 'delete'
  });
};

/**
 * 批量解绑
 */
export const unbindBatchMerchantBinding = (ids: (string | number)[]) => {
  return request({
    url: '/user/merchantBind/batch/' + ids,
    method: 'delete'
  });
};

/**
 * 根据商户ID查询绑定的陪玩列表
 */
export const listCompanionsByMerchant = (merchantId: string | number): AxiosPromise<MerchantBindingVO[]> => {
  return request({
    url: '/user/merchantBind/companions/' + merchantId,
    method: 'get'
  });
};

/**
 * 根据陪玩ID查询绑定的商户列表
 */
export const listMerchantsByCompanion = (companionId: string | number): AxiosPromise<MerchantBindingVO[]> => {
  return request({
    url: '/user/merchantBind/merchants/' + companionId,
    method: 'get'
  });
};
