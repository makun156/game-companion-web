export interface GameCategoryVO {
  /**
   * 主键ID
   */
  id: number;

  /**
   * 游戏类别名称
   */
  name: string;

  /**
   * 排序
   */
  sort: number;

  /**
   * 状态
   */
  status: number;

}

export interface GameCategoryForm extends BaseEntity {
  /**
   * 游戏类别名称
   */
  name?: string;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态
   */
  status?: number;

}

export interface GameCategoryQuery extends PageQuery {

  /**
   * 游戏类别名称
   */
  name?: string;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态
   */
  status?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
