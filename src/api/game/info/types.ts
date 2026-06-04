export interface GamesVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 游戏名称
   */
  name: string;

  /**
   * 游戏图标地址
   */
  icon: string;

  /**
   * 游戏图标地址Url
   */
  iconUrl: string;
  /**
   * 描述
   */
  description: string;

  /**
   * 游戏分类ID
   */
  categoryId: string | number;

  /**
   * 排序
   */
  sort: number;

  /**
   * 状态(0-启用[默认] 1-禁用)
   */
  status: number;

}

export interface GamesForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 游戏名称
   */
  name?: string;

  /**
   * 游戏图标地址
   */
  icon?: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 游戏分类ID
   */
  categoryId?: string | number;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态(0-启用[默认] 1-禁用)
   */
  status?: number;

}

export interface GamesQuery extends PageQuery {

  /**
   * 游戏名称
   */
  name?: string;

  /**
   * 游戏分类ID
   */
  categoryId?: string | number;

  /**
   * 状态(0-启用[默认] 1-禁用)
   */
  status?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
