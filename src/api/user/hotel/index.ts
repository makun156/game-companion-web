import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HotelVO, HotelForm, HotelQuery } from '@/api/user/hotel/types';

/**
 * 查询商家表列表
 * @param query
 * @returns {*}
 */

export const listHotel = (query?: HotelQuery): AxiosPromise<HotelVO[]> => {
  return request({
    url: '/user/hotel/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商家表详细
 * @param id
 */
export const getHotel = (id: string | number): AxiosPromise<HotelVO> => {
  return request({
    url: '/user/hotel/' + id,
    method: 'get'
  });
};

/**
 * 新增商家表
 * @param data
 */
export const addHotel = (data: HotelForm) => {
  return request({
    url: '/user/hotel',
    method: 'post',
    data: data
  });
};

/**
 * 修改商家表
 * @param data
 */
export const updateHotel = (data: HotelForm) => {
  return request({
    url: '/user/hotel',
    method: 'put',
    data: data
  });
};

/**
 * 删除商家表
 * @param id
 */
export const delHotel = (id: string | number | Array<string | number>) => {
  return request({
    url: '/user/hotel/' + id,
    method: 'delete'
  });
};
