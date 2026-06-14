import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { GameCompanionUserVO, GameCompanionUserForm, GameCompanionUserQuery } from '@/api/user/companion/types';

/**
 * 查询陪玩表列表
 * @param query
 * @returns {*}
 */

export const listGameCompanionUser = (query?: GameCompanionUserQuery): AxiosPromise<GameCompanionUserVO[]> => {
  return request({
    url: '/user/companion/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询陪玩表详细
 * @param id
 */
export const getGameCompanionUser = (id: string | number): AxiosPromise<GameCompanionUserVO> => {
  return request({
    url: '/user/companion/' + id,
    method: 'get'
  });
};

/**
 * 新增陪玩表
 * @param data
 */
export const addGameCompanionUser = (data: GameCompanionUserForm) => {
  return request({
    url: '/user/companion/add',
    method: 'post',
    data: data
  });
};

/**
 * 修改陪玩表
 * @param data
 */
export const updateGameCompanionUser = (data: GameCompanionUserForm) => {
  return request({
    url: '/user/companion/edit',
    method: 'post',
    data: data
  });
};

/**
 * 删除陪玩表
 * @param id
 */
export const delGameCompanionUser = (id: string | number | Array<string | number>) => {
  return request({
    url: '/user/companion/' + id,
    method: 'delete'
  });
};
