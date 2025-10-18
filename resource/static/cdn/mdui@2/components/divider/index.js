import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
/**
 * @summary 分割线组件
 *
 * ```html
 * <mdui-divider></mdui-divider>
 * ```
 */
let Divider = class Divider extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否为垂直分割线
         */
        this.vertical = false;
        /**
         * 是否进行左侧缩进
         */
        this.inset = false;
        /**
         * 是否进行左右两侧缩进
         */
        this.middle = false;
    }
    render() {
        return html ``;
    }
};
Divider.styles = [componentStyle, style];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Divider.prototype, "vertical", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Divider.prototype, "inset", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Divider.prototype, "middle", void 0);
Divider = __decorate([
    customElement('mdui-divider')
], Divider);
export { Divider };
