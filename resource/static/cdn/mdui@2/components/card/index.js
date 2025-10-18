import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { style } from './style.js';
/**
 * @summary 卡片组件
 *
 * ```html
 * <mdui-card>card content</mdui-card>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 卡片的内容
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let Card = class Card extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
    constructor() {
        super(...arguments);
        /**
         * 卡片的形状。可选值包括：
         *
         * * `elevated`：带阴影的卡片，与背景的视觉分离度较高
         * * `filled`：带填充色的卡片，与背景的视觉分离度较低
         * * `outlined`：带边框的卡片，与背景的视觉分离度最高
         */
        this.variant = 'elevated';
        /**
         * 是否可点击。为 `true` 时，卡片将具有鼠标悬浮效果和点击涟漪效果
         */
        this.clickable = false;
        /**
         * 是否禁用
         */
        this.disabled = false;
        this.rippleRef = createRef();
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    get rippleDisabled() {
        return this.disabled || (!this.href && !this.clickable);
    }
    get focusElement() {
        return this.href && !this.disabled
            ? this.renderRoot.querySelector('._a')
            : this;
    }
    get focusDisabled() {
        return this.rippleDisabled;
    }
    render() {
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.href && !this.disabled
            ? this.renderAnchor({
                className: 'link',
                content: html `<slot></slot>`,
            })
            : html `<slot></slot>`}`;
    }
};
Card.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], Card.prototype, "variant", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Card.prototype, "clickable", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Card.prototype, "disabled", void 0);
Card = __decorate([
    customElement('mdui-card')
], Card);
export { Card };
