import '@mdui/jq/methods/css.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '@mdui/shared/icons/cancel--outlined.js';
import '@mdui/shared/icons/error.js';
import '@mdui/shared/icons/visibility-off.js';
import '@mdui/shared/icons/visibility.js';
import '../button-icon.js';
import '../icon.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const TextField_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 文本框组件
 *
 * ```html
 * <mdui-text-field label="Text Field"></mdui-text-field>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在文本框的值变更，且失去焦点时触发
 * @event input - 在文本框的值变更时触发
 * @event invalid - 表单字段验证不通过时触发
 * @event clear - 在点击由 `clearable` 属性生成的清空按钮时触发。可以通过调用 `event.preventDefault()` 阻止清空文本框
 *
 * @slot icon - 左侧图标
 * @slot end-icon - 右侧图标
 * @slot error-icon - 验证失败状态的右侧图标
 * @slot prefix - 左侧文本
 * @slot suffix - 右侧文本
 * @slot clear-button - 清空按钮
 * @slot clear-icon - 清空按钮中的图标
 * @slot toggle-password-button - 密码显示状态切换按钮
 * @slot show-password-icon - 显示密码状态下，密码显示状态切换按钮中的图标
 * @slot hide-password-icon - 隐藏密码状态下，密码显示状态切换按钮中的图标
 * @slot helper - 底部的帮助文本
 *
 * @csspart container - 文本框容器
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart error-icon - 验证失败状态的右侧图标
 * @csspart prefix - 左侧文本
 * @csspart suffix - 右侧文本
 * @csspart label - 上方的标签文本
 * @csspart input - 内部的 `<input>` 或 `<textarea>` 元素
 * @csspart clear-button - 清空按钮
 * @csspart clear-icon - 清空按钮中的图标
 * @csspart toggle-password-button - 密码显示状态切换按钮
 * @csspart show-password-icon - 显示密码状态下，密码显示状态切换按钮中的图标
 * @csspart hide-password-icon - 隐藏密码状态下，密码显示状态切换按钮中的图标
 * @csspart supporting - 底部辅助信息容器，包括 helper、error、counter
 * @csspart helper - 底部的帮助文本
 * @csspart error - 底部的错误描述文本
 * @csspart counter - 底部右侧的字数统计
 */
export declare class TextField extends TextField_base<TextFieldEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 文本框的形状。默认为 `filled`。可选值包括：
     *
     * * `filled`：带背景色的文本框，视觉效果较强
     * * `outlined`：带边框的文本框，视觉效果较弱
     */
    variant: /*带背景色的文本框，视觉效果较强*/ 'filled' | /*带边框的文本框，视觉效果较弱*/ 'outlined';
    /**
     * 文本框输入类型。默认为 `text`。可选值包括：
     *
     * * `text`：默认值。文本字段
     * * `number`：只能输入数字。拥有动态键盘的设备上会显示数字键盘
     * * `password`：用于输入密码，其值会被遮盖
     * * `url`：用于输入 URL，会验证 URL 格式。在支持动态键盘的设备上有相应的键盘
     * * `email`：用于输入邮箱地址，会验证邮箱格式。在支持动态键盘的设备上有相应的键盘
     * * `search`：用于搜索框。拥有动态键盘的设备上的回车图标会变成搜索图标
     * * `tel`：用于输入电话号码。拥有动态键盘的设备上会显示电话数字键盘
     * * `hidden`：隐藏该控件，但其值仍会提交到服务器
     * * `date`：输入日期的控件（年、月、日，不包括时间）。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮
     * * `datetime-local`：输入日期和时间的控件，不包括时区。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮
     * * `month`：输入年和月的控件，没有时区
     * * `time`：用于输入时间的控件，不包括时区
     * * `week`：用于输入以年和周数组成的日期，不带时区
     */
    type: /*默认值。文本字段*/ 'text' | /*只能输入数字。拥有动态键盘的设备上会显示数字键盘*/ 'number' | /*用于输入密码，其值会被遮盖*/ 'password' | /*用于输入 URL，会验证 URL 格式。在支持动态键盘的设备上有相应的键盘*/ 'url' | /*用于输入邮箱地址，会验证邮箱格式。在支持动态键盘的设备上有相应的键盘*/ 'email' | /*用于搜索框。拥有动态键盘的设备上的回车图标会变成搜索图标*/ 'search' | /*用于输入电话号码。拥有动态键盘的设备上会显示电话数字键盘*/ 'tel' | /*隐藏该控件，但其值仍会提交到服务器*/ 'hidden' | /*输入日期的控件（年、月、日，不包括时间）。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮*/ 'date' | /*输入日期和时间的控件，不包括时区。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮*/ 'datetime-local' | /*输入年和月的控件，没有时区*/ 'month' | /*用于输入时间的控件，不包括时区*/ 'time' | /*用于输入以年和周数组成的日期，不带时区*/ 'week';
    /**
     * 文本框名称，将与表单数据一起提交
     */
    name: string;
    /**
     * 文本框的值，将与表单数据一起提交
     */
    value: string;
    /**
     * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
     */
    defaultValue: string;
    /**
     * 标签文本
     */
    label?: string;
    /**
     * 占位符文本
     */
    placeholder?: string;
    /**
     * 文本框底部的帮助文本。也可以通过 `slot="helper"` 设置
     */
    helper?: string;
    /**
     * 是否仅在获得焦点时，显示底部的帮助文本
     */
    helperOnFocus: boolean;
    /**
     * 是否可清空文本框内容
     */
    clearable: boolean;
    /**
     * 可清空文本框时，显示在文本框右侧的清空按钮的 Material Icons 图标名。也可以通过 `slot="clear-icon"` 设置
     */
    clearIcon?: string;
    /**
     * 是否将文本右对齐
     */
    endAligned: boolean;
    /**
     * 文本框的前缀文本。只在文本框聚焦或有值时显示。也可以通过 `slot="prefix"` 设置
     */
    prefix: string;
    /**
     * 文本框的后缀文本。只在文本框聚焦或有值时显示。也可以通过 `slot="suffix"` 设置
     */
    suffix?: string;
    /**
     * 文本框的前缀图标的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 文本框的后缀图标的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    /**
     * 表单字段验证失败时，显示在文本框右侧的 Material Icons 图标名。也可以通过 `slot="error-icon"` 设置
     */
    errorIcon?: string;
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     */
    form?: string;
    /**
     * 是否为只读模式
     */
    readonly: boolean;
    /**
     * 是否禁用输入框
     */
    disabled: boolean;
    /**
     * 提交表单时，是否必须填写该字段
     */
    required: boolean;
    /**
     * 文本框的固定显示行数
     */
    rows?: number;
    /**
     * 是否根据输入内容自动调整文本框高度
     */
    autosize: boolean;
    /**
     * `autosize` 为 `true` 时，文本框的最小行数
     */
    minRows?: number;
    /**
     * `autosize` 为 `true` 时，文本框的最大行数
     */
    maxRows?: number;
    /**
     * 允许输入的最小字符数
     */
    minlength?: number;
    /**
     * 允许输入的最大字符数
     */
    maxlength?: number;
    /**
     * 是否显示字数统计，只在 `maxlength` 被指定时有效
     */
    counter: boolean;
    /**
     * 当 `type` 为 `number` 时，允许输入的最小数值
     */
    min?: number;
    /**
     * 当 `type` 为 `number` 时，允许输入的最大数值
     */
    max?: number;
    /**
     * `type` 为 `number` 时，数值增减的步长
     */
    step?: number;
    /**
     * 用于表单验证的正则表达式
     */
    pattern?: string;
    /**
     * `type` 为 `password` 时，设置此属性会添加一个切换按钮，用于在明文和密文之间切换
     */
    togglePassword: boolean;
    /**
     * 密码切换按钮的 Material Icons 图标，当密码为明文时显示。也可以通过 `slot="show-password-icon"` 设置
     */
    showPasswordIcon?: string;
    /**
     * 密码切换按钮的 Material Icons 图标，当密码为密文时显示。也可以通过 `slot="hide-password-icon"` 设置
     */
    hidePasswordIcon?: string;
    /**
     * iOS 的非标准属性，用于控制文本首字母是否自动大写。在 iOS5 及以后的版本上有效。可选值包括：
     *
     * * `none`：禁用首字母大写
     * * `sentences`：句子首字母大写
     * * `words`：单词首字母大写
     * * `characters`：所有字母大写
     */
    autocapitalize: /*禁用首字母大写*/ 'none' | /*句子首字母大写*/ 'sentences' | /*单词首字母大写*/ 'words' | /*所有字母大写*/ 'characters';
    /**
     * `input` 元素的 `autocorrect` 属性
     */
    autocorrect?: string;
    /**
     * `input` 元素的 `autocomplete` 属性
     */
    autocomplete?: string;
    /**
     * `input` 元素的 `enterkeyhint` 属性，用于定制虚拟键盘上的 Enter 键的显示文本或图标。具体显示效果取决于用户使用的设备和语言。可选值包括：
     *
     * * `enter`：插入新行
     * * `done`：完成输入，关闭虚拟键盘
     * * `go`：导航到输入文本的目标
     * * `next`：移动到下一个输入项
     * * `previous`：移动到上一个输入项
     * * `search`：导航到搜索结果
     * * `send`：发送文本信息
     */
    enterkeyhint?: /*插入新行*/ 'enter' | /*完成输入，关闭虚拟键盘*/ 'done' | /*导航到输入文本的目标*/ 'go' | /*移动到下一个输入项*/ 'next' | /*移动到上一个输入项*/ 'previous' | /*导航到搜索结果*/ 'search' | /*发送文本信息*/ 'send';
    /**
     * 是否启用拼写检查
     */
    spellcheck: boolean;
    /**
     * `input` 元素的 `inputmode` 属性，用于定制虚拟键盘的类型。可选值包括：
     *
     * * `none`：无虚拟键盘。在需要实现自己的键盘输入控件时很有用
     * * `text`：标准文本输入键盘
     * * `decimal`：小数输入键盘，除了数字之外可能会有小数点 `.` 或者千分符逗号 `,`
     * * `numeric`：显示 0-9 的数字键盘
     * * `tel`：手机数字键盘，包含 0-9 数字、星号 `*` 或者井号 `#` 键
     * * `search`：为搜索输入优化的虚拟键盘，提交按钮通常会显示 `search` 或者 “搜索”
     * * `email`：为邮件地址输入优化的虚拟键盘，通常会有 `@ .` 等键
     * * `url`：为 URL 输入优化的虚拟键盘，通常会有 `. / #` 等键
     */
    inputmode?: /*无虚拟键盘。在需要实现自己的键盘输入控件时很有用*/ 'none' | /*标准文本输入键盘*/ 'text' | /*小数输入键盘，除了数字之外可能会有小数点 `.` 或者千分符逗号 `,`*/ 'decimal' | /*显示 0-9 的数字键盘*/ 'numeric' | /*手机数字键盘，包含 0-9 数字、星号 `*` 或者井号 `#` 键*/ 'tel' | /*为搜索输入优化的虚拟键盘，提交按钮通常会显示 `search` 或者 “搜索”*/ 'search' | /*为邮件地址输入优化的虚拟键盘，通常会有 `@ .` 等键*/ 'email' | /*为 URL 输入优化的虚拟键盘，通常会有 `. / #` 等键*/ 'url';
    /**
     * 是否验证未通过
     *
     * 该验证为浏览器原生验证 API，基于 `type`、`required`、`minlength`、`maxlength` 及 `pattern` 等属性的验证结果
     */
    private invalid;
    /**
     * 该属性设置为 true 时，则在样式上为 text-field 赋予 invalid 的状态。实际是否验证通过仍需根据 invalid 属性判断
     * 该属性仅供 mdui 内部使用，当前 select 组件使用了该属性
     */
    private invalidStyle;
    /**
     * 该属性设置为 true 时，则在样式上为 text-field 赋予聚焦状态。实际是否聚焦仍然由 focusableMixin 控制
     * 该属性仅供 mdui 内部使用，当前 select 组件使用了该属性
     */
    private focusedStyle;
    private isPasswordVisible;
    private hasValue;
    /**
     * 通过该属性传入了错误文案时，会优先显示该文案。需要配合 invalid=true 或 invalidStyle=true 使用
     * 当前仅供 select 组件使用
     */
    private error;
    private observeResize?;
    private readonly inputRef;
    private readonly formController;
    private readonly hasSlotController;
    /**
     * 该属性设为 true 时，即使设置了 readonly，仍可以显示 clearable
     * 当前仅供 select 组件使用
     */
    private readonlyButClearable;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string;
    /**
     * 获取当前值，并转换为 `number` 类型；或设置一个 `number` 类型的值。
     * 如果值无法被转换为 `number` 类型，则会返回 `NaN`。
     */
    get valueAsNumber(): number;
    set valueAsNumber(newValue: number);
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    /**
     * 是否显示聚焦状态样式
     */
    private get isFocusedStyle();
    /**
     * 是否渲染为 textarea。为 false 时渲染为 input
     */
    private get isTextarea();
    private onDisabledChange;
    private onValueChange;
    private onRowsChange;
    private onMaxRowsChange;
    private onMinRowsChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * 选中文本框中的文本
     */
    select(): void;
    /**
     * 选中文本框中特定范围的内容
     *
     * @param start 被选中的第一个字符的位置索引，从 `0` 开始。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
     * @param end 被选中的最后一个字符的*下一个*位置索引。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
     * @param direction 一个表示选择方向的字符串，可能的值有：`forward`、`backward`、`none`
     */
    setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void;
    /**
     * 将文本框中特定范围的文本替换为新的文本
     * @param replacement 要插入的字符串
     * @param start 要替换的字符的起止位置的索引。默认为当前用户选中的字符的起始位置的索引
     * @param end 要替换的字符的结束位置的索引。默认为当前用户选中的字符的结束位置的索引
     * @param selectMode 文本被替换后，选取的状态。可选值为：
     * * `select`：选择新插入的文本
     * * `start`：将光标移动到新插入的文本的起始位置
     * * `end`：将光标移动到新插入的文本的结束位置
     * * `preserve`：默认值。尝试保留选取
     */
    setRangeText(replacement: string, start: number, end: number, selectMode?: 'select' | 'start' | 'end' | 'preserve'): void;
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
    private setCustomValidityInternal;
    private onChange;
    private onClear;
    private onInput;
    private onInvalid;
    private onKeyDown;
    /**
     * textarea 不支持 pattern 属性，所以在 keyup 时执行验证
     */
    private onTextAreaKeyUp;
    private onTogglePassword;
    private getPatternErrorMsg;
    private setTextareaHeight;
    private renderLabel;
    private renderPrefix;
    private renderSuffix;
    private renderRightIcon;
    private renderClearButton;
    private renderTogglePasswordButton;
    private renderInput;
    private renderTextArea;
    /**
     * @param hasError 是否包含错误提示
     * @param hasHelper 是否含 helper 属性或 helper slot
     */
    private renderHelper;
    private renderCounter;
}
export interface TextFieldEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
    input: CustomEvent<void>;
    invalid: CustomEvent<void>;
    clear: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-text-field': TextField;
    }
}
export {};
