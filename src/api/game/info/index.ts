import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { GamesVO, GamesForm, GamesQuery } from '@/api/game/info/types';

/**
 * 查询游戏列表列表
 * @param query
 * @returns {*}
 */

export const listGames = (query?: GamesQuery): AxiosPromise<GamesVO[]> => {
  return request({
    url: '/games/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询游戏列表详细
 * @param id
 */
export const getGames = (id: string | number): AxiosPromise<GamesVO> => {
  return request({
    url: '/games/' + id,
    method: 'get'
  });
};

/**
 * 新增游戏列表
 * @param data
 */
export const addGames = (data: GamesForm) => {
  return request({
    url: '/games',
    method: 'post',
    data: data
  });
};

/**
 * 修改游戏列表
 * @param data
 */
export const updateGames = (data: GamesForm) => {
  return request({
    url: '/games',
    method: 'put',
    data: data
  });
};

/**
 * 删除游戏列表
 * @param id
 */
export const delGames = (id: string | number | Array<string | number>) => {
  return request({
    url: '/games/' + id,
    method: 'delete'
  });
};
