import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CityVO, CityForm, CityQuery } from '@/api/city/types';

/**
 * 查询区域列表
 * @param query
 * @returns {*}
 */

export const listCity = (query?: CityQuery): AxiosPromise<CityVO[]> => {
  return request({
    url: '/city/list',
    method: 'get',
    params: query
  });
};

/**
 * 懒加载子级城市数据
 * @param parentId 父级ID
 */
export const getChildrenCities = (parentId: number): AxiosPromise<CityVO[]> => {
  return request({
    url: '/city/children/' + parentId,
    method: 'get'
  });
};

/**
 * 查询区域详细
 * @param id
 */
export const getCity = (id: string | number): AxiosPromise<CityVO> => {
  return request({
    url: '/city/' + id,
    method: 'get'
  });
};

/**
 * 新增区域
 * @param data
 */
export const addCity = (data: CityForm) => {
  return request({
    url: '/city',
    method: 'post',
    data: data
  });
};

/**
 * 修改区域
 * @param data
 */
export const updateCity = (data: CityForm) => {
  return request({
    url: '/city',
    method: 'put',
    data: data
  });
};

/**
 * 删除区域
 * @param id
 */
export const delCity = (id: string | number | Array<string | number>) => {
  return request({
    url: '/city/' + id,
    method: 'delete'
  });
};
