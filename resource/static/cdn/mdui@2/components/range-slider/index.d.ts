import '@mdui/jq/methods/css.js';
import { SliderBase } from '../slider/slider-base.js';
import type { Ripple } from '../ripple/index.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * @summary 范围滑块组件
 *
 * ```html
 * <mdui-range-slider></mdui-range-slider>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 值发生变更，且失去焦点时，将触发该事件
 * @event input - 值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @csspart track-inactive - 未激活状态的轨道
 * @csspart track-active - 已激活状态的轨道
 * @csspart handle - 操作杆
 * @csspart label - 提示文本
 * @csspart tickmark - 刻度标记
 */
export declare class RangeSlider extends SliderBase<RangeSliderEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 默认值。在重置表单时，将重置为该默认值。此属性只能通过 JavaScript 属性设置
     */
    defaultValue: number[];
    /**
     * 当前操作的是哪一个 handle
     */
    private currentHandle;
    private hoverHandle?;
    private readonly rippleStartRef;
    private readonly rippleEndRef;
    private readonly handleStartRef;
    private readonly handleEndRef;
    private readonly formController;
    private _value;
    /**
     * 滑块的值，为数组格式，将于表单数据一起提交。
     *
     * **NOTE**：该属性无法通过 HTML 属性设置初始值，如果要修改该值，只能通过修改 JavaScript 属性值实现。
     */
    get value(): number[];
    set value(_value: number[]);
    protected get rippleElement(): Ripple[];
    connectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    /**
     * <input /> 用于提供拖拽操作
     * <input class="invalid" /> 用于提供 html5 自带的表单错误提示
     */
    protected render(): TemplateResult;
    protected getRippleIndex: () => 0 | 1;
    private updateStyle;
    private onInput;
}
export interface RangeSliderEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
    input: Event;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-range-slider': RangeSlider;
    }
}
