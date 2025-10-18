import '@mdui/shared/icons/check.js';
import '@mdui/shared/icons/clear.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * @summary 纸片组件
 *
 * ```html
 * <mdui-chip>Chip</mdui-chip>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 * @event change - 选中状态变更时触发
 * @event delete - 点击删除图标时触发
 *
 * @slot - 纸片文本
 * @slot icon - 左侧元素
 * @slot end-icon - 右侧元素
 * @slot selected-icon - 选中状态下的左侧元素
 * @slot delete-icon - 可删除时的右侧删除元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 纸片文本
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart selected-icon - 选中状态下的左侧图标
 * @csspart delete-icon - 可删除时的右侧删除图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Chip extends ButtonBase<ChipEventMap> {
    static styles: CSSResultGroup;
    /**
     * 纸片的形状。可选值包括：
     *
     * * `assist`：用于显示与当前上下文相关的辅助操作，如在点餐页面提供分享、收藏等功能
     * * `filter`：用于对内容进行筛选，如在搜索结果页过滤搜索结果
     * * `input`：用于表示用户输入的信息片段，如在 Gmail 的“收件人”字段中的联系人
     * * `suggestion`：用于提供动态生成的推荐信息，以简化用户操作，如在聊天应用中预测用户可能想发送的信息
     */
    variant: /*用于显示与当前上下文相关的辅助操作，如在点餐页面提供分享、收藏等功能*/ 'assist' | /*用于对内容进行筛选，如在搜索结果页过滤搜索结果*/ 'filter' | /*用于表示用户输入的信息片段，如在 Gmail 的“收件人”字段中的联系人*/ 'input' | /*用于提供动态生成的推荐信息，以简化用户操作，如在聊天应用中预测用户可能想发送的信息*/ 'suggestion';
    /**
     * 是否显示阴影
     */
    elevated: boolean;
    /**
     * 是否可选中
     */
    selectable: boolean;
    /**
     * 是否已选中
     */
    selected: boolean;
    /**
     * 是否可删除。为 `true` 时，纸片右侧会显示删除图标
     */
    deletable: boolean;
    /**
     * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 选中状态下左侧的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
     */
    selectedIcon?: string;
    /**
     * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    /**
     * 可删除时，右侧删除图标的 Material Icons 图标名。也可以通过 `slot="delete-icon"` 设置
     */
    deleteIcon?: string;
    private readonly rippleRef;
    private readonly hasSlotController;
    constructor();
    protected get rippleElement(): Ripple;
    private onSelectedChange;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private onClick;
    private onKeyDown;
    /**
     * 点击删除按钮
     */
    private onDelete;
    private renderIcon;
    private renderLabel;
    private renderEndIcon;
    private renderDeleteIcon;
    private renderInner;
}
export interface ChipEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    invalid: CustomEvent<void>;
    change: CustomEvent<void>;
    delete: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-chip': Chip;
    }
}
