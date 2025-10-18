import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { LayoutItemBase } from './layout-item-base.js';
import { layoutItemStyle } from './layout-item-style.js';
/**
 * @summary 布局项组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以包含任意内容
 */
let LayoutItem = class LayoutItem extends LayoutItemBase {
    constructor() {
        super(...arguments);
        /**
         * 组件的位置。可选值包括：
         *
         * * `top`：上方
         * * `bottom`：下方
         * * `left`：左侧
         * * `right`：右侧
         */
        this.placement = 'top';
    }
    get layoutPlacement() {
        return this.placement;
    }
    // placement 变更时，需要重新调整布局
    onPlacementChange() {
        this.layoutManager?.updateLayout(this);
    }
    render() {
        return html `<slot></slot>`;
    }
};
LayoutItem.styles = [
    componentStyle,
    layoutItemStyle,
];
__decorate([
    property({ reflect: true })
], LayoutItem.prototype, "placement", void 0);
__decorate([
    watch('placement', true)
], LayoutItem.prototype, "onPlacementChange", null);
LayoutItem = __decorate([
    customElement('mdui-layout-item')
], LayoutItem);
export { LayoutItem };
