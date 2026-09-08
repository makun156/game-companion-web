export interface MerchantBindingVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 陪玩ID
   */
  companionId: string | number;

  /**
   * 陪玩名称
   */
  companionName: string;

  /**
   * 商户ID
   */
  merchantId: string | number;

  /**
   * 商户名称
   */
  merchantName: string;

  /**
   * 绑定状态：0-正常 1-已解绑
   */
  status: string;
}

export interface MerchantBindingForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 陪玩ID
   */
  companionId?: string | number;

  /**
   * 商户ID
   */
  merchantId?: string | number;

  /**
   * 绑定状态
   */
  status?: string;
}

export interface MerchantBindingQuery extends PageQuery {
  /**
   * 陪玩名称
   */
  companionName?: string;

  /**
   * 商户名称
   */
  merchantName?: string;

  /**
   * 绑定状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface MerchantBindingBatchBindForm {
  companionIds: (string | number)[];
  merchantId: string | number;
}
