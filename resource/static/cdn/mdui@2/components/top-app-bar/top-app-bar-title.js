import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { getInnerHtmlFromSlot } from '@mdui/shared/helpers/slot.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { topAppBarTitleStyle } from './top-app-bar-title-style.js';
/**
 * @summary 顶部应用栏标题组件。需配合 `<mdui-top-app-bar>` 组件使用
 *
 * ```html
 * <mdui-top-app-bar>
 * ..<mdui-button-icon icon="menu"></mdui-button-icon>
 * ..<mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
 * ..<div style="flex-grow: 1"></div>
 * ..<mdui-button-icon icon="more_vert"></mdui-button-icon>
 * </mdui-top-app-bar>
 * ```
 *
 * @slot - 顶部应用栏的标题文本
 * @slot label-large - 展开状态下的标题文本
 *
 * @csspart label 标题文本
 * @csspart label-large 展开状态下的标题文本
 */
let TopAppBarTitle = class TopAppBarTitle extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 顶部应用栏形状。由 mdui-top-app-bar 组件控制该参数
         */
        this.variant = 'small';
        /**
         * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效。由 mdui-top-app-bar 组件控制该参数
         */
        this.shrink = false;
        this.hasSlotController = new HasSlotController(this, 'label-large');
        this.labelLargeRef = createRef();
        this.defaultSlotRef = createRef();
    }
    render() {
        const hasLabelLargeSlot = this.hasSlotController.test('label-large');
        const className = classMap({
            shrink: this.shrink,
            'variant-center-aligned': this.variant === 'center-aligned',
            'variant-small': this.variant === 'small',
            'variant-medium': this.variant === 'medium',
            'variant-large': this.variant === 'large',
        });
        return html `<slot part="label" class="label ${className}" ${ref(this.defaultSlotRef)} @slotchange="${() => this.onSlotChange(hasLabelLargeSlot)}"></slot>${hasLabelLargeSlot
            ? html `<slot name="label-large" part="label-large" class="label-large ${className}"></slot>`
            : html `<div ${ref(this.labelLargeRef)} part="label-large" class="label-large ${className}"></div>`}`;
    }
    /**
     * default slot 变化时，同步到 label-large 中
     * @param hasLabelLargeSlot
     * @private
     */
    onSlotChange(hasLabelLargeSlot) {
        if (!hasLabelLargeSlot) {
            this.labelLargeRef.value.innerHTML = getInnerHtmlFromSlot(this.defaultSlotRef.value);
        }
    }
};
TopAppBarTitle.styles = [
    componentStyle,
    topAppBarTitleStyle,
];
__decorate([
    state()
], TopAppBarTitle.prototype, "variant", void 0);
__decorate([
    state()
], TopAppBarTitle.prototype, "shrink", void 0);
TopAppBarTitle = __decorate([
    customElement('mdui-top-app-bar-title')
], TopAppBarTitle);
export { TopAppBarTitle };
