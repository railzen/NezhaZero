import '@mdui/jq/methods/closest.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 单选框组组件。需配合 `<mdui-radio>` 组件使用
 *
 * ```html
 * <mdui-radio-group value="chinese">
 * ..<mdui-radio value="chinese">Chinese</mdui-radio>
 * ..<mdui-radio value="english">English</mdui-radio>
 * </mdui-radio-group>
 * ```
 *
 * @event change - 选中值变化时触发
 * @event input - 选中值变化时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - `<mdui-radio>` 元素
 */
export declare class RadioGroup extends MduiElement<RadioGroupEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 是否禁用此组件
     */
    disabled: boolean;
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     */
    form?: string;
    /**
     * 单选框组的名称，将与表单数据一起提交
     */
    name: string;
    /**
     * 单选框组的名称，将于表单数据一起提交
     */
    value: string;
    /**
     * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
     */
    defaultValue: string;
    /**
     * 提交表单时，是否必须选中其中一个单选框
     */
    required: boolean;
    /**
     * 是否验证未通过
     */
    private invalid;
    private isInitial;
    private readonly inputRef;
    private readonly formController;
    private readonly definedController;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string;
    private get items();
    private get itemsEnabled();
    private onValueChange;
    private onInvalidChange;
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
    private updateRadioFocusable;
    private onClick;
    /**
     * 在内部的 `<mdui-radio>` 上按下按键时，在 `<mdui-radio>` 之间切换焦点
     */
    private onKeyDown;
    private onSlotChange;
    /**
     * slot 中的 mdui-radio 的 checked 变更时触发的事件
     */
    private onCheckedChange;
    private updateItems;
}
export interface RadioGroupEventMap {
    change: CustomEvent<void>;
    input: CustomEvent<void>;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-radio-group': RadioGroup;
    }
}
