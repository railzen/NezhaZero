import '../icon.js';
import { ButtonBase } from './button-base.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
/**
 * @summary 按钮组件
 *
 * ```html
 * <mdui-button>Button</mdui-button>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 按钮的文本
 * @slot icon - 按钮左侧的元素
 * @slot end-icon - 按钮右侧的元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 按钮的文本
 * @csspart icon - 按钮左侧的图标
 * @csspart end-icon - 按钮右侧的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Button extends ButtonBase<ButtonEventMap> {
    static styles: CSSResultGroup;
    /**
     * 按钮的形状。可选值包括：
     *
     * * `elevated`：带阴影的按钮，适用于需要将按钮与背景视觉分离的场景
     * * `filled`：视觉效果强烈，适用于重要流程的最终操作，如“保存”、“确认”等
     * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作，如流程中的“下一步”
     * * `outlined`：带边框的按钮，适用于中等优先级，且次要的操作，如“返回”
     * * `text`：文本按钮，适用于最低优先级的操作
     */
    variant: /*带阴影的按钮，适用于需要将按钮与背景视觉分离的场景*/ 'elevated' | /*视觉效果强烈，适用于重要流程的最终操作，如“保存”、“确认”等*/ 'filled' | /*视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作，如流程中的“下一步”*/ 'tonal' | /*带边框的按钮，适用于中等优先级，且次要的操作，如“返回”*/ 'outlined' | /*文本按钮，适用于最低优先级的操作*/ 'text';
    /**
     * 是否填满父元素宽度
     */
    fullWidth: boolean;
    /**
     * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    private readonly rippleRef;
    protected get rippleElement(): Ripple;
    protected render(): TemplateResult;
    private renderIcon;
    private renderLabel;
    private renderEndIcon;
    private renderInner;
}
export interface ButtonEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-button': Button;
    }
}
