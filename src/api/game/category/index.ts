import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { GameCategoryVO, GameCategoryForm, GameCategoryQuery } from '@/api/game/category/types';

/**
 * 查询游戏类别列表
 * @param query
 * @returns {*}
 */

export const listGameCategory = (query?: GameCategoryQuery): AxiosPromise<GameCategoryVO[]> => {
  return request({
    url: '/gameCategory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询游戏类别详细
 * @param id
 */
export const getGameCategory = (id: string | number): AxiosPromise<GameCategoryVO> => {
  return request({
    url: '/gameCategory/' + id,
    method: 'get'
  });
};

/**
 * 新增游戏类别
 * @param data
 */
export const addGameCategory = (data: GameCategoryForm) => {
  return request({
    url: '/gameCategory',
    method: 'post',
    data: data
  });
};

/**
 * 修改游戏类别
 * @param data
 */
export const updateGameCategory = (data: GameCategoryForm) => {
  return request({
    url: '/gameCategory',
    method: 'put',
    data: data
  });
};

/**
 * 删除游戏类别
 * @param id
 */
export const delGameCategory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/gameCategory/' + id,
    method: 'delete'
  });
};
