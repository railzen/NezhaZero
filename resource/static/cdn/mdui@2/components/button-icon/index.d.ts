import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * @summary 图标按钮组件
 *
 * ```html
 * <mdui-button-icon icon="search"></mdui-button-icon>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 图标组件
 * @slot selected-icon 选中状态显示的图标元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart icon - 未选中状态的图标
 * @csspart selected-icon 选中状态的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class ButtonIcon extends ButtonBase<ButtonIconEventMap> {
    static styles: CSSResultGroup;
    /**
     * 图标按钮的形状。可选值包括：
     *
     * * `standard`：适用于最低优先级的操作
     * * `filled`：视觉效果强烈，适用于高优先级的操作
     * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作
     * * `outlined`：适用于中等优先级的操作
     */
    variant: /*适用于最低优先级的操作*/ 'standard' | /*视觉效果强烈，适用于高优先级的操作*/ 'filled' | /*视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作*/ 'tonal' | /*适用于中等优先级的操作*/ 'outlined';
    /**
     * Material Icons 图标名。也可以通过 default slot 设置
     */
    icon?: string;
    /**
     * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
     */
    selectedIcon?: string;
    /**
     * 是否可选中
     */
    selectable: boolean;
    /**
     * 是否已被选中
     */
    selected: boolean;
    private readonly rippleRef;
    private readonly hasSlotController;
    protected get rippleElement(): Ripple;
    private onSelectedChange;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private renderIcon;
}
export interface ButtonIconEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-button-icon': ButtonIcon;
    }
}
