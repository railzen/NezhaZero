import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
/**
 * @summary 图标按钮组件
 *
 * ```html
 * <mdui-button-icon icon="search"></mdui-button-icon>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中状态变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 图标组件
 * @slot selected-icon 选中状态显示的图标元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart icon - 未选中状态的图标
 * @csspart selected-icon 选中状态的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let ButtonIcon = class ButtonIcon extends ButtonBase {
    constructor() {
        super(...arguments);
        /**
         * 图标按钮的形状。可选值包括：
         *
         * * `standard`：适用于最低优先级的操作
         * * `filled`：视觉效果强烈，适用于高优先级的操作
         * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作
         * * `outlined`：适用于中等优先级的操作
         */
        this.variant = 'standard';
        /**
         * 是否可选中
         */
        this.selectable = false;
        /**
         * 是否已被选中
         */
        this.selected = false;
        this.rippleRef = createRef();
        this.hasSlotController = new HasSlotController(this, '[default]', 'selected-icon');
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    onSelectedChange() {
        this.emit('change');
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.addEventListener('click', () => {
            if (!this.selectable || this.disabled) {
                return;
            }
            this.selected = !this.selected;
        });
    }
    render() {
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton()
            ? this.renderButton({
                className: 'button',
                part: 'button',
                content: this.renderIcon(),
            })
            : this.disabled || this.loading
                ? html `<span part="button" class="button _a">${this.renderIcon()}</span>`
                : this.renderAnchor({
                    className: 'button',
                    part: 'button',
                    content: this.renderIcon(),
                })} ${this.renderLoading()}`;
    }
    renderIcon() {
        const icon = () => this.hasSlotController.test('[default]')
            ? html `<slot></slot>`
            : this.icon
                ? html `<mdui-icon part="icon" class="icon" name="${this.icon}"></mdui-icon>`
                : nothingTemplate;
        const selectedIcon = () => this.hasSlotController.test('selected-icon') || this.selectedIcon
            ? html `<slot name="selected-icon" part="selected-icon" class="selected-icon"><mdui-icon name="${this.selectedIcon}"></mdui-icon></slot>`
            : icon();
        return this.selected ? selectedIcon() : icon();
    }
};
ButtonIcon.styles = [ButtonBase.styles, style];
__decorate([
    property({ reflect: true })
], ButtonIcon.prototype, "variant", void 0);
__decorate([
    property({ reflect: true })
], ButtonIcon.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'selected-icon' })
], ButtonIcon.prototype, "selectedIcon", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ButtonIcon.prototype, "selectable", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ButtonIcon.prototype, "selected", void 0);
__decorate([
    watch('selected', true)
], ButtonIcon.prototype, "onSelectedChange", null);
ButtonIcon = __decorate([
    customElement('mdui-button-icon')
], ButtonIcon);
export { ButtonIcon };
