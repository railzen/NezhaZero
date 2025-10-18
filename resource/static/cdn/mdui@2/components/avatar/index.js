import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import '../icon.js';
import { style } from './style.js';
/**
 * @summary 头像组件
 *
 * ```html
 * <mdui-avatar src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
 * ```
 *
 * @slot - 自定义头像内容，可以为字母、汉字、`<img>` 元素、图标等
 *
 * @csspart image - 使用图片作为头像时，组件内部的 `<img>` 元素
 * @csspart icon - 使用图标作为头像时，组件内部的 `<mdui-icon>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let Avatar = class Avatar extends MduiElement {
    constructor() {
        super(...arguments);
        this.hasSlotController = new HasSlotController(this, '[default]');
    }
    render() {
        return this.hasSlotController.test('[default]')
            ? html `<slot></slot>`
            : this.src
                ? html `<img part="image" alt="${ifDefined(this.label)}" src="${this.src}" style="${styleMap({ objectFit: this.fit })}">`
                : this.icon
                    ? html `<mdui-icon part="icon" name="${this.icon}"></mdui-icon>`
                    : nothingTemplate;
    }
};
Avatar.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], Avatar.prototype, "src", void 0);
__decorate([
    property({ reflect: true })
], Avatar.prototype, "fit", void 0);
__decorate([
    property({ reflect: true })
], Avatar.prototype, "icon", void 0);
__decorate([
    property({ reflect: true })
], Avatar.prototype, "label", void 0);
Avatar = __decorate([
    customElement('mdui-avatar')
], Avatar);
export { Avatar };
