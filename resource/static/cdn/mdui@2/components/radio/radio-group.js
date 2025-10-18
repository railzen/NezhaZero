import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/closest.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { radioGroupStyle } from './radio-group-style.js';
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
let RadioGroup = class RadioGroup extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否禁用此组件
         */
        this.disabled = false;
        /**
         * 单选框组的名称，将与表单数据一起提交
         */
        this.name = '';
        /**
         * 单选框组的名称，将于表单数据一起提交
         */
        this.value = '';
        /**
         * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
         */
        this.defaultValue = '';
        /**
         * 提交表单时，是否必须选中其中一个单选框
         */
        this.required = false;
        /**
         * 是否验证未通过
         */
        this.invalid = false;
        // 是否是初始状态，初始状态不显示动画
        this.isInitial = true;
        this.inputRef = createRef();
        this.formController = new FormController(this);
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-radio'],
        });
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
    // 为了使 <mdui-radio> 可以不是该组件的直接子元素，这里不用 @queryAssignedElements()
    get items() {
        return $(this).find('mdui-radio').get();
    }
    get itemsEnabled() {
        return $(this)
            .find('mdui-radio:not([disabled])')
            .get();
    }
    async onValueChange() {
        this.isInitial = false;
        await this.definedController.whenDefined();
        this.emit('input');
        this.emit('change');
        this.updateItems();
        this.updateRadioFocusable();
        await this.updateComplete;
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
    async onInvalidChange() {
        await this.definedController.whenDefined();
        this.updateItems();
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
            const eventProceeded = this.emit('invalid', {
                bubbles: false,
                cancelable: true,
                composed: false,
            });
            if (!eventProceeded) {
                // 调用了 preventDefault() 时，隐藏默认的表单错误提示
                this.inputRef.value.blur();
                this.inputRef.value.focus();
            }
        }
        return !this.invalid;
    }
    /**
     * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
     *
     * @param message 自定义的错误提示文本
     */
    setCustomValidity(message) {
        this.inputRef.value.setCustomValidity(message);
        this.invalid = !this.inputRef.value.checkValidity();
    }
    render() {
        return html `<fieldset><input ${ref(this.inputRef)} type="radio" class="input" name="${ifDefined(this.name)}" value="${ifDefined(this.value)}" .checked="${!!this.value}" .required="${this.required}" tabindex="-1" @keydown="${this.onKeyDown}"><slot @click="${this.onClick}" @keydown="${this.onKeyDown}" @slotchange="${this.onSlotChange}" @change="${this.onCheckedChange}"></slot></fieldset>`;
    }
    // 更新 mdui-radio 的 checked 后，需要更新可聚焦状态
    // 同一个 mdui-radio-group 中的多个 mdui-radio，仅有一个可聚焦
    // 若有已选中的，则已选中的可聚焦；若没有已选中的，则第一个可聚焦
    updateRadioFocusable() {
        const items = this.items;
        const itemChecked = items.find((item) => item.checked);
        if (itemChecked) {
            items.forEach((item) => {
                item.focusable = item === itemChecked;
            });
        }
        else {
            this.itemsEnabled.forEach((item, index) => {
                item.focusable = !index;
            });
        }
    }
    async onClick(event) {
        await this.definedController.whenDefined();
        const target = event.target;
        const item = target.closest('mdui-radio');
        if (!item || item.disabled) {
            return;
        }
        this.value = item.value;
        await this.updateComplete;
        item.focus();
    }
    /**
     * 在内部的 `<mdui-radio>` 上按下按键时，在 `<mdui-radio>` 之间切换焦点
     */
    async onKeyDown(event) {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
            return;
        }
        event.preventDefault();
        await this.definedController.whenDefined();
        const items = this.itemsEnabled;
        const itemChecked = items.find((item) => item.checked) ?? items[0];
        const incr = event.key === ' '
            ? 0
            : ['ArrowUp', 'ArrowLeft'].includes(event.key)
                ? -1
                : 1;
        let index = items.indexOf(itemChecked) + incr;
        if (index < 0) {
            index = items.length - 1;
        }
        if (index > items.length - 1) {
            index = 0;
        }
        this.value = items[index].value;
        await this.updateComplete;
        items[index].focus();
    }
    async onSlotChange() {
        await this.definedController.whenDefined();
        this.updateItems();
        this.updateRadioFocusable();
    }
    /**
     * slot 中的 mdui-radio 的 checked 变更时触发的事件
     */
    onCheckedChange(event) {
        event.stopPropagation();
    }
    // 更新 <mdui-radio> 的状态
    updateItems() {
        this.items.forEach((item) => {
            item.checked = item.value === this.value;
            item.invalid = this.invalid;
            item.groupDisabled = this.disabled;
            item.isInitial = this.isInitial;
        });
    }
};
RadioGroup.styles = [
    componentStyle,
    radioGroupStyle,
];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], RadioGroup.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true })
], RadioGroup.prototype, "form", void 0);
__decorate([
    property({ reflect: true })
], RadioGroup.prototype, "name", void 0);
__decorate([
    property({ reflect: true })
], RadioGroup.prototype, "value", void 0);
__decorate([
    defaultValue()
], RadioGroup.prototype, "defaultValue", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], RadioGroup.prototype, "required", void 0);
__decorate([
    state()
], RadioGroup.prototype, "invalid", void 0);
__decorate([
    watch('value', true)
], RadioGroup.prototype, "onValueChange", null);
__decorate([
    watch('invalid', true),
    watch('disabled')
], RadioGroup.prototype, "onInvalidChange", null);
RadioGroup = __decorate([
    customElement('mdui-radio-group')
], RadioGroup);
export { RadioGroup };
