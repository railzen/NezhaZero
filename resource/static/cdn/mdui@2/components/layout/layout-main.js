import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { getLayout } from './helper.js';
import { layoutMainStyle } from './layout-main-style.js';
/**
 * @summary 布局主体内容组件
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
let LayoutMain = class LayoutMain extends MduiElement {
    connectedCallback() {
        super.connectedCallback();
        const parentElement = this.parentElement;
        if (isNodeName(parentElement, 'mdui-layout')) {
            this.layoutManager = getLayout(parentElement);
            this.layoutManager.registerMain(this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.layoutManager) {
            this.layoutManager.unregisterMain();
        }
    }
    render() {
        return html `<slot></slot>`;
    }
};
LayoutMain.styles = [
    componentStyle,
    layoutMainStyle,
];
LayoutMain = __decorate([
    customElement('mdui-layout-main')
], LayoutMain);
export { LayoutMain };
