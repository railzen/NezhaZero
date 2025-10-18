import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../circular-progress.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
type RenderButtonOptions = {
    id?: string;
    className?: string;
    part?: string;
    content?: TemplateResult | TemplateResult[];
    tabindex?: number;
};
declare const ButtonBase_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/anchor.js").AnchorMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
export declare class ButtonBase<E> extends ButtonBase_base<E> {
    static styles: CSSResultGroup;
    /**
     * 是否禁用
     */
    disabled: boolean;
    /**
     * 是否处于加载中状态
     */
    loading: boolean;
    /**
     * 按钮的名称，将与表单数据一起提交。
     *
     * **Note**：仅在未设置 `href` 属性时，此属性才有效。
     */
    name: string;
    /**
     * 按钮的初始值，将与表单数据一起提交。
     *
     * **Note**：仅在未设置 `href` 属性时，此属性才有效。
     */
    value: string;
    /**
     * 按钮的类型。默认类型为 `button`。可选类型包括：
     *
     * * `submit`：点击按钮会提交表单数据到服务器
     * * `reset`：点击按钮会将表单中的所有字段重置为初始值
     * * `button`：此类型的按钮没有默认行为
     *
     * **Note**：仅在未指定 `href` 属性时，此属性才有效。
     */
    type: /*此按钮将表单数据提交给服务器*/ 'submit' | /*此按钮重置所有组件为初始值*/ 'reset' | /*此按钮没有默认行为*/ 'button';
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     *
     * **Note**：仅在未指定 `href` 属性时，此属性才有效。
     */
    form?: string;
    /**
     * 指定提交表单的 URL。
     *
     * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
     *
     * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
     */
    formAction?: string;
    /**
     * 指定提交表单到服务器的内容类型。可选值包括：
     *
     * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
     * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
     * * `text/plain`：HTML5 新增，用于调试
     *
     * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
     *
     * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
     */
    formEnctype?: /*未指定该属性时的默认值*/ 'application/x-www-form-urlencoded' | /*当表单包含 `<input type="file">` 元素时使用*/ 'multipart/form-data' | /*HTML5 新增，用于调试*/ 'text/plain';
    /**
     * 指定提交表单时使用的 HTTP 方法。可选值包括：
     *
     * * `post`：表单数据包含在表单内容中，发送到服务器
     * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
     *
     * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
     *
     * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
     */
    formMethod?: /*表单数据包含在表单内容中，发送到服务器*/ 'post' | /*表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法*/ 'get';
    /**
     * 如果设置了此属性，表单提交时将不执行表单验证。
     *
     * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
     *
     * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
     */
    formNoValidate: boolean;
    /**
     * 提交表单后接收到的响应应显示在何处。可选值包括：
     *
     * * `_self`：默认选项，在当前框架中打开
     * * `_blank`：在新窗口中打开
     * * `_parent`：在父框架中打开
     * * `_top`：在整个窗口中打开
     *
     * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
     *
     * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
     */
    formTarget?: /*默认选项，在当前框架中打开*/ '_self' | /*在新窗口中打开*/ '_blank' | /*在父框架中打开*/ '_parent' | /*在整个窗口中打开*/ '_top';
    private readonly formController;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState | undefined;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string | undefined;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement | null;
    protected get focusDisabled(): boolean;
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
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected renderLoading(): TemplateResult;
    protected renderButton({ id, className, part, content, }: RenderButtonOptions): TemplateResult;
    protected isButton(): boolean;
}
export {};
