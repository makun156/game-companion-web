export interface HotelVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 商家名称
   */
  name: string;

  /**
   * 商家logo
   */
  avatar: string;

  /**
   * 商家logoUrl
   */
  avatarUrl: string;
  /**
   * 城市区域id
   */
  city: number;

  /**
   * 商家详细地址
   */
  address: string;

  /**
   * 营业时间
   */
  businessHours: string;

  /**
   * 联系电话
   */
  phone: string;

  /**
   * 评分
   */
  rating: number;

  /**
   * 状态
   */
  status: string;

}

export interface HotelForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 商家名称
   */
  name?: string;

  /**
   * 商家logo
   */
  avatar?: string;

  /**
   * 城市区域id
   */
  city?: number;

  /**
   * 商家详细地址
   */
  address?: string;

  /**
   * 营业时间
   */
  businessHours?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 标签
   */
  tags?: string;

  /**
   * 商家介绍
   */
  description?: string;

  /**
   * 状态
   */
  status?: string;

}

export interface HotelQuery extends PageQuery {

  /**
   * 商家名称
   */
  name?: string;

  /**
   * 城市区域id
   */
  city?: number;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
