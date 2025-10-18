import { __decorate } from "tslib";
import { html, nothing } from 'lit';
import { customElement, property, queryAssignedElements, state, } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { isString } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../chip.js';
import '../dropdown.js';
import '../menu.js';
import '../text-field.js';
import { style } from './style.js';
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
let Select = class Select extends FocusableMixin(MduiElement) {
    constructor() {
        super(...arguments);
        /**
         * 选择框的样式。可选值包括：
         *
         * * `filled`：带背景色的选择框，视觉效果较强
         * * `outlined`：带边框的选择框，视觉效果较弱
         */
        this.variant = 'filled';
        /**
         * 是否支持多选
         */
        this.multiple = false;
        /**
         * 选择框的名称，将与表单数据一起提交
         */
        this.name = '';
        /**
         * 选择框的值，将与表单数据一起提交。
         *
         * 如果未指定 `multiple` 属性，该值为字符串；如果指定了 `multiple` 属性，该值为字符串数组。HTML 属性只能设置字符串值；如果需要设置数组值，请通过 JavaScript 属性设置。
         */
        this.value = '';
        /**
         * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
         */
        this.defaultValue = '';
        /**
         * 是否可以清空选择框
         */
        this.clearable = false;
        /**
         * 选择框的位置。可选值包括：
         *
         * * `auto`：自动判断位置
         * * `bottom`：位于下方
         * * `top`：位于上方
         */
        this.placement = 'auto';
        /**
         * 文本是否右对齐
         */
        this.endAligned = false;
        /**
         * 是否为只读状态
         */
        this.readonly = false;
        /**
         * 是否为禁用状态
         */
        this.disabled = false;
        /**
         * 提交表单时，是否必须填写该字段
         */
        this.required = false;
        /**
         * 是否验证未通过
         *
         * 该验证为浏览器原生验证 API，基于 `required` 属性的验证结果
         */
        this.invalid = false;
        this.menuRef = createRef();
        this.textFieldRef = createRef();
        this.hiddenInputRef = createRef();
        this.formController = new FormController(this);
        this.hasSlotController = new HasSlotController(this, 'icon', 'end-icon', 'error-icon', 'prefix', 'suffix', 'clear-button', 'clear-icon', 'helper');
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-menu-item'],
        });
    }
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity() {
        return this.hiddenInputRef.value.validity;
    }
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage() {
        return this.hiddenInputRef.value.validationMessage;
    }
    get focusElement() {
        return this.textFieldRef.value;
    }
    get focusDisabled() {
        return this.disabled;
    }
    connectedCallback() {
        super.connectedCallback();
        this.value =
            this.multiple && isString(this.value)
                ? this.value
                    ? [this.value]
                    : []
                : this.value;
        this.defaultValue = this.multiple ? [] : '';
        // 首次渲染时，slot 中的 mdui-menu-item 还未渲染完成，无法读取到其中的文本值
        // 所以需要在首次更新后，再次重新渲染，此时 mdui-menu-item 已渲染完成，可以读取到文本值
        this.definedController.whenDefined().then(() => {
            this.requestUpdate();
        });
        this.updateComplete.then(() => {
            this.observeResize = observeResize(this.textFieldRef.value, () => this.resizeMenu());
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.observeResize?.unobserve();
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity() {
        const valid = this.hiddenInputRef.value.checkValidity();
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
        this.invalid = !this.hiddenInputRef.value.reportValidity();
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
        this.hiddenInputRef.value.setCustomValidity(message);
        this.invalid = !this.hiddenInputRef.value.checkValidity();
    }
    render() {
        const hasSelection = this.multiple ? !!this.value.length : !!this.value;
        return html `${this.multiple
            ? html `<select ${ref(this.hiddenInputRef)} class="hidden-input" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .required="${this.required}" .disabled="${this.disabled}" multiple="multiple" tabindex="-1">${map(this.value, (value) => html `<option selected="selected" value="${value}"></option>`)}</select>`
            : html `<input ${ref(this.hiddenInputRef)} type="radio" class="hidden-input" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .required="${this.required}" .disabled="${this.disabled}" .checked="${hasSelection}" tabindex="-1">`}<mdui-dropdown .stayOpenOnClick="${this.multiple}" .disabled="${this.readonly || this.disabled}" .placement="${this.placement === 'top'
            ? 'top-start'
            : this.placement === 'bottom'
                ? 'bottom-start'
                : 'auto'}" @open="${this.onDropdownOpen}" @close="${this.onDropdownClose}"><mdui-text-field ${ref(this.textFieldRef)} slot="trigger" part="text-field" class="text-field" exportparts="${[
            'container',
            'icon',
            'end-icon',
            'error-icon',
            'prefix',
            'suffix',
            'label',
            'input',
            'clear-button',
            'clear-icon',
            'supporting',
            'helper',
            'error',
        ]
            .map((v) => `${v}:text-field__${v}`)
            .join(',')}" readonly="readonly" .readonlyButClearable="${true}" .variant="${this.variant}" .name="${this.name}" .value="${this.multiple
            ? this.value.length
                ? ' '
                : ''
            : this.getMenuItemLabelByValue(this.value)}" .label="${this.label}" .placeholder="${this.placeholder}" .helper="${this.helper}" .error="${this.hiddenInputRef.value?.validationMessage}" .clearable="${this.clearable}" .clearIcon="${this.clearIcon}" .endAligned="${this.endAligned}" .prefix="${this.prefix}" .suffix="${this.suffix}" .icon="${this.icon}" .endIcon="${this.endIcon}" .errorIcon="${this.errorIcon}" .form="${this.form}" .disabled="${this.disabled}" .required="${this.required}" .invalidStyle="${this.invalid}" @clear="${this.onClear}" @change="${(e) => e.stopPropagation()}" @keydown="${this.onTextFieldKeyDown}">${map([
            'icon',
            'end-icon',
            'error-icon',
            'prefix',
            'suffix',
            'clear-button',
            'clear-icon',
            'helper',
        ], (slotName) => this.hasSlotController.test(slotName)
            ? html `<slot name="${slotName}" slot="${slotName}"></slot>`
            : nothing)} ${when(this.multiple && this.value.length, () => html `<div slot="input" class="chips" part="chips">${map(this.value, (valueItem) => html `<mdui-chip class="chip" part="chip" exportparts="${['button', 'label', 'delete-icon']
            .map((v) => `${v}:chip__${v}`)
            .join(',')}" variant="input" deletable tabindex="-1" @delete="${() => this.onDeleteOneValue(valueItem)}">${this.getMenuItemLabelByValue(valueItem)}</mdui-chip>`)}</div>`)}</mdui-text-field><mdui-menu ${ref(this.menuRef)} part="menu" .selects="${this.multiple ? 'multiple' : 'single'}" .value="${this.value}" @change="${this.onValueChange}"><slot></slot></mdui-menu></mdui-dropdown>`;
    }
    getMenuItemLabelByValue(valueItem) {
        if (!this.menuItems.length) {
            return valueItem;
        }
        return (this.menuItems
            .find((item) => item.value === valueItem)
            ?.textContent?.trim() || valueItem);
    }
    resizeMenu() {
        this.menuRef.value.style.width = `${this.textFieldRef.value.clientWidth}px`;
    }
    async onDropdownOpen() {
        // @ts-ignore
        this.textFieldRef.value.focusedStyle = true;
    }
    onDropdownClose() {
        // @ts-ignore
        this.textFieldRef.value.focusedStyle = false;
        // 如果焦点在 <mdui-select> 组件内的元素上，则焦点回到 <mdui-select> 上
        if (this.contains(document.activeElement) ||
            this.contains(document.activeElement?.assignedSlot ?? null)) {
            setTimeout(() => {
                this.focus();
            });
        }
    }
    async onValueChange(e) {
        const menu = e.target;
        this.value = this.multiple
            ? menu.value.map((v) => v ?? '')
            : (menu.value ?? '');
        await this.updateComplete;
        // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
        const form = this.formController.getForm();
        if (form && formResets.get(form)?.has(this)) {
            this.invalid = false;
            formResets.get(form).delete(this);
        }
        else {
            this.invalid = !this.hiddenInputRef.value.checkValidity();
        }
    }
    /**
     * multiple 为 true 时，点 chip 的删除按钮，删除其中一个值
     */
    onDeleteOneValue(valueItem) {
        const value = [...this.value];
        if (value.includes(valueItem)) {
            value.splice(value.indexOf(valueItem), 1);
        }
        this.value = value;
    }
    onClear() {
        this.value = this.multiple ? [] : '';
    }
    /**
     * 焦点在 text-field 上时，按下回车键，打开下拉选项
     */
    onTextFieldKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.textFieldRef.value.click();
        }
    }
};
Select.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], Select.prototype, "variant", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Select.prototype, "multiple", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "name", void 0);
__decorate([
    property()
], Select.prototype, "value", void 0);
__decorate([
    defaultValue()
], Select.prototype, "defaultValue", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "label", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "placeholder", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "helper", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Select.prototype, "clearable", void 0);
__decorate([
    property({ reflect: true, attribute: 'clear-icon' })
], Select.prototype, "clearIcon", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "placement", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'end-aligned',
    })
], Select.prototype, "endAligned", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "prefix", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "suffix", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'end-icon' })
], Select.prototype, "endIcon", void 0);
__decorate([
    property({ reflect: true, attribute: 'error-icon' })
], Select.prototype, "errorIcon", void 0);
__decorate([
    property({ reflect: true })
], Select.prototype, "form", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Select.prototype, "readonly", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Select.prototype, "disabled", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Select.prototype, "required", void 0);
__decorate([
    state()
], Select.prototype, "invalid", void 0);
__decorate([
    queryAssignedElements({ flatten: true, selector: 'mdui-menu-item' })
], Select.prototype, "menuItems", void 0);
Select = __decorate([
    customElement('mdui-select')
], Select);
export { Select };
