import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../chip.js';
import '../dropdown.js';
import '../menu.js';
import '../text-field.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const Select_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 选择框组件。需配合 `<mdui-menu-item>` 组件使用
 *
 * ```html
 * <mdui-select>
 * ..<mdui-menu-item value="item-1">Item 1</mdui-menu-item>
 * ..<mdui-menu-item value="item-2">Item 2</mdui-menu-item>
 * </mdui-select>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中的值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 * @event clear - 在点击由 `clearable` 属性生成的清空按钮时触发。可以通过调用 `event.preventDefault()` 阻止清空选择框
 *
 * @slot - `<mdui-menu-item>` 元素
 * @slot icon - 左侧图标
 * @slot end-icon - 右侧图标
 * @slot error-icon - 验证失败状态的右侧图标
 * @slot prefix - 左侧文本
 * @slot suffix - 右侧文本
 * @slot clear-button - 清空按钮
 * @slot clear-icon - 清空按钮中的图标
 * @slot helper - 底部的帮助文本
 *
 * @csspart chips - 多选时，放置选中值对应的 chip 的容器
 * @csspart chip - 多选时，每一个选中的值对应的 chip
 * @csspart chip__button - chip 内部的 `<button>` 元素
 * @csspart chip__label - chip 内部的文本
 * @csspart chip__delete-icon - chip 内部的删除图标
 * @csspart text-field - 文本框，即 [`<mdui-text-field>`](/docs/2/components/text-field) 元素
 * @csspart text-field__container - text-field 内部的文本框容器
 * @csspart text-field__icon - text-field 内部的左侧图标
 * @csspart text-field__end-icon - text-field 内部的右侧图标
 * @csspart text-field__error-icon - text-field 内部的验证失败状态的右侧图标
 * @csspart text-field__prefix - text-field 内部的左侧文本
 * @csspart text-field__suffix - text-field 内部的右侧文本
 * @csspart text-field__label - text-field 内部的标签文本
 * @csspart text-field__input - text-field 内部的 `<input>` 元素
 * @csspart text-field__clear-button - text-field 内部的清空按钮
 * @csspart text-field__clear-icon - text-field 内部的清空按钮中的图标
 * @csspart text-field__supporting - text-field 内部的底部辅助信息容器，包括 helper 和 error
 * @csspart text-field__helper - text-field 内部的底部帮助文本
 * @csspart text-field__error - text-field 内部的底部错误描述文本
 * @csspart menu - 下拉菜单，即 [`<mdui-menu>`](/docs/2/components/menu) 元素
 */
export declare class Select extends Select_base<SelectEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 选择框的样式。可选值包括：
     *
     * * `filled`：带背景色的选择框，视觉效果较强
     * * `outlined`：带边框的选择框，视觉效果较弱
     */
    variant: /*带背景色的选择框，视觉效果较强*/ 'filled' | /*带边框的选择框，视觉效果较弱*/ 'outlined';
    /**
     * 是否支持多选
     */
    multiple: boolean;
    /**
     * 选择框的名称，将与表单数据一起提交
     */
    name: string;
    /**
     * 选择框的值，将与表单数据一起提交。
     *
     * 如果未指定 `multiple` 属性，该值为字符串；如果指定了 `multiple` 属性，该值为字符串数组。HTML 属性只能设置字符串值；如果需要设置数组值，请通过 JavaScript 属性设置。
     */
    value: string | string[];
    /**
     * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
     */
    defaultValue: string | string[];
    /**
     * 标签文本
     */
    label?: string;
    /**
     * 占位符文本
     */
    placeholder?: string;
    /**
     * 选择框底部的帮助文本。也可以通过 `slot="helper"` 设置
     */
    helper?: string;
    /**
     * 是否可以清空选择框
     */
    clearable: boolean;
    /**
     * 当选择框可清空时，显示在选择框右侧的清空按钮的 Material Icons 图标名。也可以通过 `slot="clear-icon"` 设置
     */
    clearIcon?: string;
    /**
     * 选择框的位置。可选值包括：
     *
     * * `auto`：自动判断位置
     * * `bottom`：位于下方
     * * `top`：位于上方
     */
    placement: /*自动判断位置*/ 'auto' | /*位于下方*/ 'bottom' | /*位于上方*/ 'top';
    /**
     * 文本是否右对齐
     */
    endAligned: boolean;
    /**
     * 选择框的前缀文本。仅在聚焦状态，或选择框有值时才会显示。也可以通过 `slot="prefix"` 设置
     */
    prefix: string;
    /**
     * 选择框的后缀文本。仅在聚焦状态，或选择框有值时才会显示。也可以通过 `slot="suffix"` 设置
     */
    suffix?: string;
    /**
     * 选择框的前缀图标的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 选择框的后缀图标的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    /**
     * 表单字段验证失败时，显示在选择框右侧的 Material Icons 图标名。也可以通过 `slot="error-icon"` 设置
     */
    errorIcon?: string;
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     */
    form?: string;
    /**
     * 是否为只读状态
     */
    readonly: boolean;
    /**
     * 是否为禁用状态
     */
    disabled: boolean;
    /**
     * 提交表单时，是否必须填写该字段
     */
    required: boolean;
    /**
     * 是否验证未通过
     *
     * 该验证为浏览器原生验证 API，基于 `required` 属性的验证结果
     */
    private invalid;
    private readonly menuItems;
    private observeResize?;
    private readonly menuRef;
    private readonly textFieldRef;
    private readonly hiddenInputRef;
    private readonly formController;
    private readonly hasSlotController;
    private readonly definedController;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string;
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
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
    private getMenuItemLabelByValue;
    private resizeMenu;
    private onDropdownOpen;
    private onDropdownClose;
    private onValueChange;
    /**
     * multiple 为 true 时，点 chip 的删除按钮，删除其中一个值
     */
    private onDeleteOneValue;
    private onClear;
    /**
     * 焦点在 text-field 上时，按下回车键，打开下拉选项
     */
    private onTextFieldKeyDown;
}
export interface SelectEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
    invalid: CustomEvent<void>;
    clear: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-select': Select;
    }
}
export {};
