import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
/**
 * @summary 徽标组件
 *
 * ```html
 * <mdui-badge>12</mdui-badge>
 * ```
 *
 * @slot - 徽标中显示的文本
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let Badge = class Badge extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 徽标的形状。可选值包括：
         *
         * * `small`：小型徽标，不显示文本
         * * `large`：大型徽标，会显示文本
         */
        this.variant = 'large';
    }
    render() {
        if (this.variant === 'small') {
            return nothingTemplate;
        }
        return html `<slot></slot>`;
    }
};
Badge.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], Badge.prototype, "variant", void 0);
Badge = __decorate([
    customElement('mdui-badge')
], Badge);
export { Badge };
