export interface GameCompanionUserVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 陪玩名称
   */
  name: string;

  /**
   * 性别(0男 1女)
   */
  gender: string;

  /**
   * 年龄
   */
  age: number;

  /**
   * 手机号
   */
  phone: string;

  /**
   * 头像路径
   */
  avatar: string;

  /**
   * 头像地址
   */
  avatarUrl: string;

  /**
   * 语音介绍oss id
   */
  voice: string;

  /**
   * 语音地址
   */
  voiceUrl: string;

  /**
   * 接单区域id
   */
  city: number;

  /**
   * 自我介绍
   */
  introduction: string;

  /**
   * 标签
   */
  tags: string;

  /**
   * 小时价格
   */
  pricePerHour: number;

  /**
   * 接单量
   */
  totalOrders: number;

  /**
   * 状态
   */
  status: string;

  /**
   * 工作状态
   */
  workStatus: string;

  /**
   * 相册
   */
  photos: string[];
}

export interface GameCompanionUserForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 陪玩名称
   */
  name?: string;

  /**
   * 性别(0男 1女)
   */
  gender?: string;

  /**
   * 年龄
   */
  age?: number;

  /**
   * 手机号
   */
  phone?: string;

  /**
   * 头像路径
   */
  avatar?: string;

  /**
   * 语音介绍oss id
   */
  voice?: string;

  /**
   * 接单区域id
   */
  city?: number;

  /**
   * 自我介绍
   */
  introduction?: string;

  /**
   * 标签
   */
  tags?: string;

  /**
   * 小时价格
   */
  pricePerHour?: number;

  /**
   * 工作状态
   */
  workStatus?: string;

  /**
   * 相册
   */
  photos?: string[];
}

export interface GameCompanionPhotoVo {
  /**
   * 图片oss id
   */
  photo?: string;
  /**
   * 图片地址
   */
  photoUrl?: string;
}

export interface GameCompanionUserQuery extends PageQuery {

  /**
   * 陪玩名称
   */
  name?: string;

  /**
   * 性别(0男 1女)
   */
  gender?: string;

  /**
   * 年龄
   */
  age?: number;

  /**
   * 手机号
   */
  phone?: string;

  /**
   * 头像路径
   */
  avatar?: string;

  /**
   * 接单区域id
   */
  city?: number;

  /**
   * 自我介绍
   */
  introduction?: string;

  /**
   * 标签
   */
  tags?: string;

  /**
   * 小时价格
   */
  pricePerHour?: number;

  /**
   * 接单量
   */
  totalOrders?: number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 工作状态
   */
  workStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
