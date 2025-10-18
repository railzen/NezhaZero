import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { msg } from '@lit/localize';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '@mdui/shared/icons/cancel--outlined.js';
import '@mdui/shared/icons/error.js';
import '@mdui/shared/icons/visibility-off.js';
import '@mdui/shared/icons/visibility.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { onLocaleReady, offLocaleReady } from '../../internal/localize.js';
import '../button-icon.js';
import '../icon.js';
import { style } from './style.js';
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
let TextField = class TextField extends FocusableMixin(MduiElement) {
    constructor() {
        super(...arguments);
        /**
         * 文本框的形状。默认为 `filled`。可选值包括：
         *
         * * `filled`：带背景色的文本框，视觉效果较强
         * * `outlined`：带边框的文本框，视觉效果较弱
         */
        this.variant = 'filled';
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
        this.type = 'text';
        /**
         * 文本框名称，将与表单数据一起提交
         */
        this.name = '';
        /**
         * 文本框的值，将与表单数据一起提交
         */
        this.value = '';
        /**
         * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
         */
        this.defaultValue = '';
        /**
         * 是否仅在获得焦点时，显示底部的帮助文本
         */
        this.helperOnFocus = false;
        /**
         * 是否可清空文本框内容
         */
        this.clearable = false;
        /**
         * 是否将文本右对齐
         */
        this.endAligned = false;
        /**
         * 是否为只读模式
         */
        this.readonly = false;
        /**
         * 是否禁用输入框
         */
        this.disabled = false;
        /**
         * 提交表单时，是否必须填写该字段
         */
        this.required = false;
        /**
         * 是否根据输入内容自动调整文本框高度
         */
        this.autosize = false;
        /**
         * 是否显示字数统计，只在 `maxlength` 被指定时有效
         */
        this.counter = false;
        /**
         * `type` 为 `password` 时，设置此属性会添加一个切换按钮，用于在明文和密文之间切换
         */
        this.togglePassword = false;
        /**
         * 是否启用拼写检查
         */
        this.spellcheck = false;
        /**
         * 是否验证未通过
         *
         * 该验证为浏览器原生验证 API，基于 `type`、`required`、`minlength`、`maxlength` 及 `pattern` 等属性的验证结果
         */
        this.invalid = false;
        /**
         * 该属性设置为 true 时，则在样式上为 text-field 赋予 invalid 的状态。实际是否验证通过仍需根据 invalid 属性判断
         * 该属性仅供 mdui 内部使用，当前 select 组件使用了该属性
         */
        this.invalidStyle = false;
        /**
         * 该属性设置为 true 时，则在样式上为 text-field 赋予聚焦状态。实际是否聚焦仍然由 focusableMixin 控制
         * 该属性仅供 mdui 内部使用，当前 select 组件使用了该属性
         */
        this.focusedStyle = false;
        this.isPasswordVisible = false;
        this.hasValue = false;
        /**
         * 通过该属性传入了错误文案时，会优先显示该文案。需要配合 invalid=true 或 invalidStyle=true 使用
         * 当前仅供 select 组件使用
         */
        this.error = '';
        this.inputRef = createRef();
        this.formController = new FormController(this);
        this.hasSlotController = new HasSlotController(this, 'icon', 'end-icon', 'helper', 'input');
        /**
         * 该属性设为 true 时，即使设置了 readonly，仍可以显示 clearable
         * 当前仅供 select 组件使用
         */
        this.readonlyButClearable = false;
    }
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity() {
        return this.inputRef.value.validity;
    }
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage() {
        return this.inputRef.value.validationMessage;
    }
    /**
     * 获取当前值，并转换为 `number` 类型；或设置一个 `number` 类型的值。
     * 如果值无法被转换为 `number` 类型，则会返回 `NaN`。
     */
    get valueAsNumber() {
        return (this.inputRef.value?.valueAsNumber ??
            parseFloat(this.value));
    }
    set valueAsNumber(newValue) {
        const input = document.createElement('input');
        input.type = 'number';
        input.valueAsNumber = newValue;
        this.value = input.value;
    }
    get focusElement() {
        return this.inputRef.value;
    }
    get focusDisabled() {
        return this.disabled;
    }
    /**
     * 是否显示聚焦状态样式
     */
    get isFocusedStyle() {
        // @ts-ignore
        return this.focused || this.focusedStyle;
    }
    /**
     * 是否渲染为 textarea。为 false 时渲染为 input
     */
    get isTextarea() {
        return (this.rows && this.rows > 1) || this.autosize;
    }
    onDisabledChange() {
        // 禁用状态始终为验证通过，所以 disabled 变更时需要重新校验
        this.inputRef.value.disabled = this.disabled;
        this.invalid = !this.inputRef.value.checkValidity();
    }
    async onValueChange() {
        this.hasValue = !['', null].includes(this.value);
        if (this.hasUpdated) {
            await this.updateComplete;
            this.setTextareaHeight();
            // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
            const form = this.formController.getForm();
            if (form && formResets.get(form)?.has(this)) {
                this.invalid = false;
                formResets.get(form).delete(this);
            }
            else {
                this.invalid = !this.inputRef.value.checkValidity();
            }
        }
    }
    onRowsChange() {
        this.setTextareaHeight();
    }
    async onMaxRowsChange() {
        if (!this.autosize) {
            return;
        }
        if (!this.hasUpdated) {
            await this.updateComplete;
        }
        // 设置最大高度，为 line-height * maxRows + padding-top + padding-bottom
        const $input = $(this.inputRef.value);
        $input.css('max-height', parseFloat($input.css('line-height')) * (this.maxRows ?? 1) +
            parseFloat($input.css('padding-top')) +
            parseFloat($input.css('padding-bottom')));
    }
    async onMinRowsChange() {
        if (!this.autosize) {
            return;
        }
        if (!this.hasUpdated) {
            await this.updateComplete;
        }
        // 设置最小高度，为 line-height * minRows + padding-top + padding-bottom
        const $input = $(this.inputRef.value);
        $input.css('min-height', parseFloat($input.css('line-height')) * (this.minRows ?? 1) +
            parseFloat($input.css('padding-top')) +
            parseFloat($input.css('padding-bottom')));
    }
    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(() => {
            this.setTextareaHeight();
            this.observeResize = observeResize(this.inputRef.value, () => this.setTextareaHeight());
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.observeResize?.unobserve();
        offLocaleReady(this);
    }
    /**
     * 选中文本框中的文本
     */
    select() {
        this.inputRef.value.select();
    }
    /**
     * 选中文本框中特定范围的内容
     *
     * @param start 被选中的第一个字符的位置索引，从 `0` 开始。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
     * @param end 被选中的最后一个字符的*下一个*位置索引。如果这个值比元素的 `value` 长度还大，则会被看作 `value` 最后一个位置的索引
     * @param direction 一个表示选择方向的字符串，可能的值有：`forward`、`backward`、`none`
     */
    setSelectionRange(start, end, direction = 'none') {
        this.inputRef.value.setSelectionRange(start, end, direction);
    }
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
    setRangeText(replacement, start, end, selectMode = 'preserve') {
        this.inputRef.value.setRangeText(replacement, start, end, selectMode);
        if (this.value !== this.inputRef.value.value) {
            this.value = this.inputRef.value.value;
            this.setTextareaHeight();
            this.emit('input');
            this.emit('change');
        }
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity() {
        const valid = this.inputRef.value.checkValidity();
        if (!valid) {
            this.emit('invalid', {
                bubbles: false,
                cancelable: true,
                composed: false,
            });
        }
        return valid;
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
     *
     * 如果验证未通过，还会在组件上显示验证失败的提示。
     */
    reportValidity() {
        this.invalid = !this.inputRef.value.reportValidity();
        if (this.invalid) {
            this.emit('invalid', {
                bubbles: false,
                cancelable: true,
                composed: false,
            });
            this.focus();
        }
        return !this.invalid;
    }
    /**
     * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
     *
     * @param message 自定义的错误提示文本
     */
    setCustomValidity(message) {
        this.setCustomValidityInternal(message);
        // 外部调用 setCustomValidity 时，不再使用内置的验证规则，所以需要移除监听语言变更事件
        offLocaleReady(this);
    }
    render() {
        const hasIcon = !!this.icon || this.hasSlotController.test('icon');
        const hasEndIcon = !!this.endIcon || this.hasSlotController.test('end-icon');
        const hasErrorIcon = this.invalid || this.invalidStyle;
        const hasTogglePasswordButton = this.type === 'password' && this.togglePassword && !this.disabled;
        const hasClearButton = this.clearable &&
            !this.disabled &&
            (!this.readonly || this.readonlyButClearable) &&
            (typeof this.value === 'number' || this.value.length > 0);
        const hasPrefix = !!this.prefix || this.hasSlotController.test('prefix');
        const hasSuffix = !!this.suffix || this.hasSlotController.test('suffix');
        const hasHelper = !!this.helper || this.hasSlotController.test('helper');
        const hasError = hasErrorIcon && !!(this.error || this.inputRef.value.validationMessage);
        const hasCounter = this.counter && !!this.maxlength;
        // 存在 input slot 时，隐藏组件内部的 .input 元素，使用 slot 代替
        const hasInputSlot = this.hasSlotController.test('input');
        const invalidClassNameObj = {
            invalid: this.invalid,
            'invalid-style': this.invalidStyle,
        };
        const className = classMap({
            container: true,
            'has-value': this.hasValue,
            'has-icon': hasIcon,
            'has-right-icon': hasEndIcon || hasErrorIcon,
            'has-action': hasClearButton || hasTogglePasswordButton,
            'has-prefix': hasPrefix,
            'has-suffix': hasSuffix,
            'is-firefox': navigator.userAgent.includes('Firefox'),
            ...invalidClassNameObj,
        });
        return html `<div part="container" class="${className}">${this.renderPrefix()}<div class="input-container">${this.renderLabel()} ${this.isTextarea
            ? this.renderTextArea(hasInputSlot)
            : this.renderInput(hasInputSlot)} ${when(hasInputSlot, () => html `<slot name="input" class="input"></slot>`)}</div>${this.renderSuffix()}${this.renderClearButton(hasClearButton)} ${this.renderTogglePasswordButton(hasTogglePasswordButton)} ${this.renderRightIcon(hasErrorIcon)}</div>${when(hasError || hasHelper || hasCounter, () => html `<div part="supporting" class="${classMap({ supporting: true, ...invalidClassNameObj })}">${this.renderHelper(hasError, hasHelper)} ${this.renderCounter(hasCounter)}</div>`)}`;
    }
    setCustomValidityInternal(message) {
        this.inputRef.value.setCustomValidity(message);
        this.invalid = !this.inputRef.value.checkValidity();
        this.requestUpdate();
    }
    onChange() {
        this.value = this.inputRef.value.value;
        if (this.isTextarea) {
            this.setTextareaHeight();
        }
        this.emit('change');
    }
    onClear(event) {
        this.value = '';
        this.emit('clear');
        this.emit('input');
        this.emit('change');
        this.focus();
        event.stopPropagation();
    }
    onInput(event) {
        event.stopPropagation();
        this.value = this.inputRef.value.value;
        if (this.isTextarea) {
            this.setTextareaHeight();
        }
        this.emit('input');
    }
    onInvalid(event) {
        event.preventDefault();
    }
    onKeyDown(event) {
        const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        // 聚焦状态按下回车时，提交表单。可以在 keydown 事件中使用 event.preventDefault() 来取消提交表单
        if (event.key === 'Enter' && !hasModifier) {
            setTimeout(() => {
                if (!event.defaultPrevented) {
                    this.formController.submit();
                }
            });
        }
    }
    /**
     * textarea 不支持 pattern 属性，所以在 keyup 时执行验证
     */
    onTextAreaKeyUp() {
        if (this.pattern) {
            const patternRegex = new RegExp(this.pattern);
            const hasError = this.value && !this.value.match(patternRegex);
            if (hasError) {
                this.setCustomValidityInternal(this.getPatternErrorMsg());
                onLocaleReady(this, () => {
                    this.setCustomValidityInternal(this.getPatternErrorMsg());
                });
            }
            else {
                this.setCustomValidityInternal('');
                offLocaleReady(this);
            }
        }
    }
    onTogglePassword() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
    getPatternErrorMsg() {
        return msg('Please match the requested format.', {
            id: 'components.textField.patternError',
        });
    }
    setTextareaHeight() {
        if (this.autosize) {
            this.inputRef.value.style.height = 'auto';
            this.inputRef.value.style.height = `${this.inputRef.value.scrollHeight}px`;
        }
        else {
            this.inputRef.value.style.height = undefined;
        }
    }
    renderLabel() {
        return this.label
            ? html `<label part="label" class="label">${this.label}</label>`
            : nothingTemplate;
    }
    renderPrefix() {
        return html `<slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}" class="i"></mdui-icon>`
            : nothingTemplate}</slot><slot name="prefix" part="prefix" class="prefix">${this.prefix}</slot>`;
    }
    renderSuffix() {
        return html `<slot name="suffix" part="suffix" class="suffix">${this.suffix}</slot>`;
    }
    renderRightIcon(hasErrorIcon) {
        return hasErrorIcon
            ? html `<slot name="error-icon" part="error-icon" class="right-icon">${this.errorIcon
                ? html `<mdui-icon name="${this.errorIcon}" class="i"></mdui-icon>`
                : html `<mdui-icon-error class="i"></mdui-icon-error>`}</slot>`
            : html `<slot name="end-icon" part="end-icon" class="end-icon right-icon">${this.endIcon
                ? html `<mdui-icon name="${this.endIcon}" class="i"></mdui-icon>`
                : nothingTemplate}</slot>`;
    }
    renderClearButton(hasClearButton) {
        return when(hasClearButton, () => html `<slot name="clear-button" part="clear-button" class="action" @click="${this.onClear}"><mdui-button-icon tabindex="-1"><slot name="clear-icon" part="clear-icon">${this.clearIcon
            ? html `<mdui-icon name="${this.clearIcon}" class="i"></mdui-icon>`
            : html `<mdui-icon-cancel--outlined class="i"></mdui-icon-cancel--outlined>`}</slot></mdui-button-icon></slot>`);
    }
    renderTogglePasswordButton(hasTogglePasswordButton) {
        return when(hasTogglePasswordButton, () => html `<slot name="toggle-password-button" part="toggle-password-button" class="action" @click="${this.onTogglePassword}"><mdui-button-icon tabindex="-1">${this.isPasswordVisible
            ? html `<slot name="show-password-icon" part="show-password-icon">${this.showPasswordIcon
                ? html `<mdui-icon name="${this.showPasswordIcon}" class="i"></mdui-icon>`
                : html `<mdui-icon-visibility-off class="i"></mdui-icon-visibility-off>`}</slot>`
            : html `<slot name="hide-password-icon" part="hide-password-icon">${this.hidePasswordIcon
                ? html `<mdui-icon name="${this.hidePasswordIcon}" class="i"></mdui-icon>`
                : html `<mdui-icon-visibility class="i"></mdui-icon-visibility>`}</slot>`}</mdui-button-icon></slot>`);
    }
    renderInput(hasInputSlot) {
        return html `<input ${ref(this.inputRef)} part="input" class="input ${classMap({ 'hide-input': hasInputSlot })}" type="${this.type === 'password' && this.isPasswordVisible
            ? 'text'
            : this.type}" name="${ifDefined(this.name)}" .value="${live(this.value)}" placeholder="${ifDefined(!this.label || this.isFocusedStyle || this.hasValue
            ? this.placeholder
            : undefined)}" ?readonly="${this.readonly}" ?disabled="${this.disabled}" ?required="${this.required}" minlength="${ifDefined(this.minlength)}" maxlength="${ifDefined(this.maxlength)}" min="${ifDefined(this.min)}" max="${ifDefined(this.max)}" step="${ifDefined(this.step)}" autocapitalize="${ifDefined(this.type === 'password' ? 'off' : this.autocapitalize)}" autocomplete="${this.autocomplete}" autocorrect="${ifDefined(this.type === 'password' ? 'off' : this.autocorrect)}" spellcheck="${ifDefined(this.spellcheck)}" pattern="${ifDefined(this.pattern)}" enterkeyhint="${ifDefined(this.enterkeyhint)}" inputmode="${ifDefined(this.inputmode)}" @change="${this.onChange}" @input="${this.onInput}" @invalid="${this.onInvalid}" @keydown="${this.onKeyDown}">`;
    }
    renderTextArea(hasInputSlot) {
        return html `<textarea ${ref(this.inputRef)} part="input" class="input ${classMap({ 'hide-input': hasInputSlot })}" name="${ifDefined(this.name)}" .value="${live(this.value)}" placeholder="${ifDefined(!this.label || this.isFocusedStyle || this.hasValue
            ? this.placeholder
            : undefined)}" ?readonly="${this.readonly}" ?disabled="${this.disabled}" ?required="${this.required}" minlength="${ifDefined(this.minlength)}" maxlength="${ifDefined(this.maxlength)}" rows="${this.rows ?? 1}" autocapitalize="${ifDefined(this.autocapitalize)}" autocorrect="${ifDefined(this.autocorrect)}" spellcheck="${ifDefined(this.spellcheck)}" enterkeyhint="${ifDefined(this.enterkeyhint)}" inputmode="${ifDefined(this.inputmode)}" @change="${this.onChange}" @input="${this.onInput}" @invalid="${this.onInvalid}" @keydown="${this.onKeyDown}" @keyup="${this.onTextAreaKeyUp}"></textarea>`;
    }
    /**
     * @param hasError 是否包含错误提示
     * @param hasHelper 是否含 helper 属性或 helper slot
     */
    renderHelper(hasError, hasHelper) {
        return hasError
            ? html `<div part="error" class="error">${this.error || this.inputRef.value.validationMessage}</div>`
            : hasHelper
                ? html `<slot name="helper" part="helper" class="helper">${this.helper}</slot>`
                : // 右边有 counter，需要占位
                    html `<span></span>`;
    }
    renderCounter(hasCounter) {
        return hasCounter
            ? html `<div part="counter" class="counter">${this.value.length}/${this.maxlength}</div>`
            : nothingTemplate;
    }
};
TextField.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], TextField.prototype, "variant", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "type", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "name", void 0);
__decorate([
    property()
], TextField.prototype, "value", void 0);
__decorate([
    defaultValue()
], TextField.prototype, "defaultValue", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "label", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "placeholder", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "helper", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'helper-on-focus',
    })
], TextField.prototype, "helperOnFocus", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TextField.prototype, "clearable", void 0);
__decorate([
    property({ reflect: true, attribute: 'clear-icon' })
], TextField.prototype, "clearIcon", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'end-aligned',
    })
], TextField.prototype, "endAligned", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "prefix", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "suffix", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'end-icon' })
], TextField.prototype, "endIcon", void 0);
__decorate([
    property({ reflect: true, attribute: 'error-icon' })
], TextField.prototype, "errorIcon", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "form", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TextField.prototype, "readonly", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TextField.prototype, "disabled", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TextField.prototype, "required", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextField.prototype, "rows", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TextField.prototype, "autosize", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'min-rows' })
], TextField.prototype, "minRows", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'max-rows' })
], TextField.prototype, "maxRows", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextField.prototype, "minlength", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextField.prototype, "maxlength", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TextField.prototype, "counter", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextField.prototype, "min", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextField.prototype, "max", void 0);
__decorate([
    property({ type: Number, reflect: true })
], TextField.prototype, "step", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "pattern", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'toggle-password',
    })
], TextField.prototype, "togglePassword", void 0);
__decorate([
    property({ reflect: true, attribute: 'show-password-icon' })
], TextField.prototype, "showPasswordIcon", void 0);
__decorate([
    property({ reflect: true, attribute: 'hide-password-icon' })
], TextField.prototype, "hidePasswordIcon", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "autocapitalize", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "autocorrect", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "autocomplete", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "enterkeyhint", void 0);
__decorate([
    property({ type: Boolean, reflect: true, converter: booleanConverter })
], TextField.prototype, "spellcheck", void 0);
__decorate([
    property({ reflect: true })
], TextField.prototype, "inputmode", void 0);
__decorate([
    state()
], TextField.prototype, "invalid", void 0);
__decorate([
    state()
], TextField.prototype, "invalidStyle", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'focused-style',
    })
], TextField.prototype, "focusedStyle", void 0);
__decorate([
    state()
], TextField.prototype, "isPasswordVisible", void 0);
__decorate([
    state()
], TextField.prototype, "hasValue", void 0);
__decorate([
    state()
], TextField.prototype, "error", void 0);
__decorate([
    watch('disabled', true)
], TextField.prototype, "onDisabledChange", null);
__decorate([
    watch('value')
], TextField.prototype, "onValueChange", null);
__decorate([
    watch('rows', true)
], TextField.prototype, "onRowsChange", null);
__decorate([
    watch('maxRows')
], TextField.prototype, "onMaxRowsChange", null);
__decorate([
    watch('minRows')
], TextField.prototype, "onMinRowsChange", null);
TextField = __decorate([
    customElement('mdui-text-field')
], TextField);
export { TextField };
