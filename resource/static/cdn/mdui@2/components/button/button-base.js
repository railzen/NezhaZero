import { __decorate } from "tslib";
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import cc from 'classcat';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { FormController } from '@mdui/shared/controllers/form.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../circular-progress.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { buttonBaseStyle } from './button-base-style.js';
export class ButtonBase extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
    constructor() {
        super(...arguments);
        /**
         * 是否禁用
         */
        this.disabled = false;
        /**
         * 是否处于加载中状态
         */
        this.loading = false;
        /**
         * 按钮的名称，将与表单数据一起提交。
         *
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
         */
        this.name = '';
        /**
         * 按钮的初始值，将与表单数据一起提交。
         *
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
         */
        this.value = '';
        /**
         * 按钮的类型。默认类型为 `button`。可选类型包括：
         *
         * * `submit`：点击按钮会提交表单数据到服务器
         * * `reset`：点击按钮会将表单中的所有字段重置为初始值
         * * `button`：此类型的按钮没有默认行为
         *
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
         */
        this.type = 'button';
        /**
         * 如果设置了此属性，表单提交时将不执行表单验证。
         *
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
         *
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
         */
        this.formNoValidate = false;
        this.formController = new FormController(this);
    }
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity() {
        if (this.isButton()) {
            return this.focusElement.validity;
        }
    }
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage() {
        if (this.isButton()) {
            return this.focusElement.validationMessage;
        }
    }
    get rippleDisabled() {
        return this.disabled || this.loading;
    }
    get focusElement() {
        return this.isButton()
            ? this.renderRoot?.querySelector('._button')
            : !this.focusDisabled
                ? this.renderRoot?.querySelector('._a')
                : this;
    }
    get focusDisabled() {
        return this.disabled || this.loading;
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity() {
        if (this.isButton()) {
            const valid = this.focusElement.checkValidity();
            if (!valid) {
                // @ts-ignore
                this.emit('invalid', {
                    bubbles: false,
                    cancelable: true,
                    composed: false,
                });
            }
            return valid;
        }
        return true;
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
     *
     * 如果验证未通过，还会在组件上显示验证失败的提示。
     */
    reportValidity() {
        if (this.isButton()) {
            const invalid = !this.focusElement.reportValidity();
            if (invalid) {
                // @ts-ignore
                this.emit('invalid', {
                    bubbles: false,
                    cancelable: true,
                    composed: false,
                });
                // todo 考虑是否要支持 preventDefault() 方法，当前 invalid 状态没有样式
            }
            return !invalid;
        }
        return true;
    }
    /**
     * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
     *
     * @param message 自定义的错误提示文本
     */
    setCustomValidity(message) {
        if (this.isButton()) {
            this.focusElement.setCustomValidity(message);
        }
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.addEventListener('click', () => {
            if (this.type === 'submit') {
                this.formController.submit(this);
            }
            if (this.type === 'reset') {
                this.formController.reset(this);
            }
        });
    }
    renderLoading() {
        return this.loading
            ? html `<mdui-circular-progress part="loading"></mdui-circular-progress>`
            : nothingTemplate;
    }
    renderButton({ id, className, part, content = html `<slot></slot>`, }) {
        return html `<button id="${ifDefined(id)}" class="${cc(['_button', className])}" part="${ifDefined(part)}" ?disabled="${this.rippleDisabled || this.focusDisabled}">${content}</button>`;
    }
    isButton() {
        return !this.href;
    }
}
ButtonBase.styles = [
    componentStyle,
    buttonBaseStyle,
];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ButtonBase.prototype, "disabled", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ButtonBase.prototype, "loading", void 0);
__decorate([
    property({ reflect: true })
], ButtonBase.prototype, "name", void 0);
__decorate([
    property({ reflect: true })
], ButtonBase.prototype, "value", void 0);
__decorate([
    property({ reflect: true })
], ButtonBase.prototype, "type", void 0);
__decorate([
    property({ reflect: true })
], ButtonBase.prototype, "form", void 0);
__decorate([
    property({ reflect: true, attribute: 'formaction' })
], ButtonBase.prototype, "formAction", void 0);
__decorate([
    property({ reflect: true, attribute: 'formenctype' })
], ButtonBase.prototype, "formEnctype", void 0);
__decorate([
    property({ reflect: true, attribute: 'formmethod' })
], ButtonBase.prototype, "formMethod", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'formnovalidate',
    })
], ButtonBase.prototype, "formNoValidate", void 0);
__decorate([
    property({ reflect: true, attribute: 'formtarget' })
], ButtonBase.prototype, "formTarget", void 0);
