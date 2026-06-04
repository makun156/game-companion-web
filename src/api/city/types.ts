export interface CityVO {
  /**
   * ID
   */
  id?: number;

  /**
   * 父级ID
   */
  parentId?: number;

  /**
   * 区域名称
   */
  name: string;

  /**
   * 层级
   */
  level: number;

  /**
   * 城市全称
   */
  fullName: string;

  /**
   * 排序
   */
  sort: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 是否有子节点
   */
  hasChildren?: boolean;

  /**
   * 子对象
   */
  children?: CityVO[];
}

export interface CityForm extends BaseEntity {
  /**
   * 区域名称
   */
  name?: string;

  /**
   * 层级
   */
  level?: number;

  /**
   * 城市全称
   */
  fullName?: string;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态
   */
  status?: number;

}

export interface CityQuery {

  /**
   * 区域名称
   */
  name?: string;

  /**
   * 层级
   */
  level?: number;

  /**
   * 城市全称
   */
  fullName?: string;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 状态
   */
  status?: number;

  /**
   * 父级ID（用于懒加载）
   */
  parentId?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
