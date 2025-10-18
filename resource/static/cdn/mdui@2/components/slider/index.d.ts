import { SliderBase } from './slider-base.js';
import type { Ripple } from '../ripple/index.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * @summary 滑块组件
 *
 * ```html
 * <mdui-slider></mdui-slider>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在值发生变更，且失去焦点时，将触发该事件
 * @event input - 值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @csspart track-inactive - 未激活状态的轨道
 * @csspart track-active - 已激活状态的轨道
 * @csspart handle - 操作杆
 * @csspart label 提示文本
 * @csspart tickmark - 刻度标记
 */
export declare class Slider extends SliderBase<SliderEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 滑块的值，将于表单数据一起提交
     */
    value: number;
    /**
     * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
     */
    defaultValue: number;
    private readonly rippleRef;
    private readonly handleRef;
    private readonly formController;
    protected get rippleElement(): Ripple;
    private onValueChange;
    connectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    /**
     * <input /> 用于提供拖拽操作
     * <input class="invalid" /> 用于提供 html5 自带的表单错误提示
     */
    protected render(): TemplateResult;
    private updateStyle;
    private onInput;
}
export interface SliderEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
    input: Event;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-slider': Slider;
    }
}
