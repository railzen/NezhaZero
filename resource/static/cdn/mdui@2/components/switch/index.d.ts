import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '@mdui/shared/icons/check.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const Switch_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 开关切换组件
 *
 * ```html
 * <mdui-switch></mdui-switch>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event input - 选中状态变更时触发
 * @event invalid - 表单字段验证不通过时触发
 *
 * @slot unchecked-icon - 未选中状态的元素
 * @slot checked-icon - 选中状态的元素
 *
 * @csspart track - 轨道
 * @csspart thumb - 图标容器
 * @csspart unchecked-icon - 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 *
 * @cssprop --shape-corner - 组件轨道的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-thumb - 组件图标容器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Switch extends Switch_base<SwitchEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 是否为禁用状态
     */
    disabled: boolean;
    /**
     * 是否为选中状态
     */
    checked: boolean;
    /**
     * 默认选中状态。在重置表单时，将重置为此状态。此属性只能通过 JavaScript 属性设置
     */
    defaultChecked: boolean;
    /**
     * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
     */
    uncheckedIcon?: string;
    /**
     * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
     *
     * 默认为 `check` 图标，可传入空字符串移除默认图标
     */
    checkedIcon?: string;
    /**
     * 提交表单时，是否必须选中此开关
     */
    required: boolean;
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     */
    form?: string;
    /**
     * 开关的名称，将与表单数据一起提交
     */
    name: string;
    /**
     * 开关的值，将于表单数据一起提交
     */
    value: string;
    /**
     * 是否验证未通过
     */
    private invalid;
    private readonly rippleRef;
    private readonly inputRef;
    private readonly formController;
    private readonly hasSlotController;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    private onDisabledChange;
    private onCheckedChange;
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
    protected render(): TemplateResult;
    /**
     * input[type="checkbox"] 的 change 事件无法冒泡越过 shadow dom
     */
    private onChange;
}
export interface SwitchEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
    input: Event;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-switch': Switch;
    }
}
export {};
