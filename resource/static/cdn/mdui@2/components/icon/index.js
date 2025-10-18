import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { ajax } from '@mdui/jq/functions/ajax.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
/**
 * @summary 图标组件
 *
 * ```html
 * <mdui-icon name="search"></mdui-icon>
 * ```
 *
 * @slot - `svg` 图标的内容
 */
let Icon = class Icon extends MduiElement {
    constructor() {
        super(...arguments);
        this.hasSlotController = new HasSlotController(this, '[default]');
    }
    render() {
        const renderDefault = () => {
            if (this.name) {
                const [name, variant] = this.name.split('--');
                const familyMap = new Map([
                    ['outlined', 'Material Icons Outlined'],
                    ['filled', 'Material Icons'],
                    ['rounded', 'Material Icons Round'],
                    ['sharp', 'Material Icons Sharp'],
                    ['two-tone', 'Material Icons Two Tone'],
                ]);
                return html `<span translate="no" style="${styleMap({ fontFamily: familyMap.get(variant) })}">${name}</span>`;
            }
            if (this.src) {
                return html `${until(ajax({ url: this.src }).then(unsafeSVG))}`;
            }
            return html ``;
        };
        return this.hasSlotController.test('[default]')
            ? html `<slot></slot>`
            : renderDefault();
    }
};
Icon.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], Icon.prototype, "name", void 0);
__decorate([
    property({ reflect: true })
], Icon.prototype, "src", void 0);
Icon = __decorate([
    customElement('mdui-icon')
], Icon);
export { Icon };
