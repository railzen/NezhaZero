import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import '@mdui/shared/icons/circle.js';
import '@mdui/shared/icons/radio-button-unchecked.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { radioStyle } from './radio-style.js';
/**
 * @summary 单选框组件。需配合 `<mdui-radio-group>` 组件使用
 *
 * ```html
 * <mdui-radio-group value="chinese">
 * ..<mdui-radio value="chinese">Chinese</mdui-radio>
 * ..<mdui-radio value="english">English</mdui-radio>
 * </mdui-radio-group>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中该单选项时触发
 *
 * @slot - 文本内容
 * @slot unchecked-icon - 未选中状态的图标
 * @slot checked-icon - 选中状态的图标
 *
 * @csspart control - 左侧图标容器
 * @csspart unchecked-icon 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 * @csspart label - 文本内容
 */
let Radio = class Radio extends RippleMixin(FocusableMixin(MduiElement)) {
    constructor() {
        super(...arguments);
        /**
         * 当前单选项的值
         */
        this.value = '';
        /**
         * 是否禁用当前单选项
         */
        this.disabled = false;
        /**
         * 当前单选项是否已选中
         */
        this.checked = false;
        // 是否验证未通过。由 <mdui-radio-group> 控制该参数
        this.invalid = false;
        // 父组件中是否设置了禁用。由 <mdui-radio-group> 控制该参数
        this.groupDisabled = false;
        // 是否可聚焦。
        // 单独使用该组件时，默认可聚焦。
        // 如果放在 <mdui-radio-group> 组件中使用，则由 <mdui-radio-group> 控制该参数
        this.focusable = true;
        // 是否是初始状态，不显示动画。由 <mdui-radio-group> 组件控制该参数
        this.isInitial = true;
        this.rippleRef = createRef();
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    get rippleDisabled() {
        return this.isDisabled();
    }
    get focusElement() {
        return this;
    }
    get focusDisabled() {
        return this.isDisabled() || !this.focusable;
    }
    onCheckedChange() {
        this.emit('change');
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.addEventListener('click', () => {
            if (!this.isDisabled()) {
                this.checked = true;
            }
        });
    }
    render() {
        const className = classMap({
            invalid: this.invalid,
            initial: this.isInitial,
        });
        return html `<i part="control" class="${className}"><mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple><slot name="unchecked-icon" part="unchecked-icon" class="icon unchecked-icon">${this.uncheckedIcon
            ? html `<mdui-icon name="${this.uncheckedIcon}" class="i"></mdui-icon>`
            : html `<mdui-icon-radio-button-unchecked class="i"></mdui-icon-radio-button-unchecked>`}</slot><slot name="checked-icon" part="checked-icon" class="icon checked-icon">${this.checkedIcon
            ? html `<mdui-icon name="${this.checkedIcon}" class="i"></mdui-icon>`
            : html `<mdui-icon-circle class="i"></mdui-icon-circle>`}</slot></i><slot part="label" class="label ${className}"></slot>`;
    }
    isDisabled() {
        return this.disabled || this.groupDisabled;
    }
};
Radio.styles = [componentStyle, radioStyle];
__decorate([
    property({ reflect: true })
], Radio.prototype, "value", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Radio.prototype, "disabled", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Radio.prototype, "checked", void 0);
__decorate([
    property({ reflect: true, attribute: 'unchecked-icon' })
], Radio.prototype, "uncheckedIcon", void 0);
__decorate([
    property({ reflect: true, attribute: 'checked-icon' })
], Radio.prototype, "checkedIcon", void 0);
__decorate([
    state()
], Radio.prototype, "invalid", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'group-disabled',
    })
], Radio.prototype, "groupDisabled", void 0);
__decorate([
    state()
], Radio.prototype, "focusable", void 0);
__decorate([
    state()
], Radio.prototype, "isInitial", void 0);
__decorate([
    watch('checked', true)
], Radio.prototype, "onCheckedChange", null);
Radio = __decorate([
    customElement('mdui-radio')
], Radio);
export { Radio };
