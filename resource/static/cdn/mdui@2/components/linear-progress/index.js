import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { isUndefined } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
/**
 * @summary 线性进度指示器组件
 *
 * ```html
 * <mdui-linear-progress></mdui-linear-progress>
 * ```
 *
 * @csspart indicator - 指示器部分
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let LinearProgress = class LinearProgress extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 进度指示器的最大值。默认为 `1`
         */
        this.max = 1;
    }
    render() {
        const isDeterminate = !isUndefined(this.value);
        if (isDeterminate) {
            const value = this.value;
            return html `<div part="indicator" class="determinate" style="${styleMap({
                width: `${(value / Math.max(this.max ?? value, value)) * 100}%`,
            })}"></div>`;
        }
        return html `<div part="indicator" class="indeterminate"></div>`;
    }
};
LinearProgress.styles = [componentStyle, style];
__decorate([
    property({ type: Number, reflect: true })
], LinearProgress.prototype, "max", void 0);
__decorate([
    property({ type: Number })
], LinearProgress.prototype, "value", void 0);
LinearProgress = __decorate([
    customElement('mdui-linear-progress')
], LinearProgress);
export { LinearProgress };
