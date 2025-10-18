import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { layoutStyle } from './layout-style.js';
/**
 * @summary 布局组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以包含 [`<mdui-top-app-bar>`](/docs/2/components/top-app-bar)、[`<mdui-bottom-app-bar>`](/docs/2/components/bottom-app-bar)、[`<mdui-navigation-bar>`](/docs/2/components/navigation-bar)、[`<mdui-navigation-drawer>`](/docs/2/components/navigation-drawer)、[`<mdui-navigation-rail>`](/docs/2/components/navigation-rail)、`<mdui-layout-item>`、`<mdui-layout-main>` 元素
 */
let Layout = class Layout extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 设置当前布局的高度为 100%
         */
        this.fullHeight = false;
    }
    render() {
        return html `<slot></slot>`;
    }
};
Layout.styles = [componentStyle, layoutStyle];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'full-height',
    })
], Layout.prototype, "fullHeight", void 0);
Layout = __decorate([
    customElement('mdui-layout')
], Layout);
export { Layout };
