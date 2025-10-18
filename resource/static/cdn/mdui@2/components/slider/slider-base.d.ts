import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';
declare const SliderBase_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
export declare class SliderBase<E> extends SliderBase_base<E> {
    static styles: CSSResultGroup;
    /**
     * 滑块的最小值，默认为 `0`
     */
    min: number;
    /**
     * 滑块的最大值，默认为 `100`
     */
    max: number;
    /**
     * 步进间隔，默认为 `1`
     */
    step: number;
    /**
     * 是否添加刻度标记
     */
    tickmarks: boolean;
    /**
     * 是否隐藏文本提示
     */
    nolabel: boolean;
    /**
     * 是否被禁用
     */
    disabled: boolean;
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     */
    form?: string;
    /**
     * 滑块的名称，该名称将与表单数据一起提交
     */
    name: string;
    /**
     * 是否验证未通过
     *
     * 该验证为根据是否通过 `setCustomValidity` 方法设置了值，来判断是否验证通过
     */
    protected invalid: boolean;
    protected labelVisible: boolean;
    protected readonly inputRef: Ref<HTMLInputElement>;
    protected readonly trackActiveRef: Ref<HTMLElement>;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    /**
     * 用于自定义标签的显示格式的函数。函数参数为滑块的当前值，返回值为期望显示的文本。
     */
    labelFormatter: (value: number) => string;
    private onDisabledChange;
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity(): boolean;
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
     *
     * 如果验证未通过，还会在组件上显示验证失败的提示。
     */
    reportValidity(): boolean;
    /**
     * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
     *
     * @param message 自定义的错误提示文本
     */
    setCustomValidity(message: string): void;
    /**
     * value 不在 min、max 或 step 的限制范围内时，修正 value 的值
     */
    protected fixValue(value: number): number;
    /**
     * 获取候选值组成的数组
     */
    protected getCandidateValues(): number[];
    /**
     * 渲染浮动标签
     */
    protected renderLabel(value: number): TemplateResult;
    protected onChange(): void;
}
export {};
