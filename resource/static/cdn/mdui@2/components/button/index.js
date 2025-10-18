import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '../icon.js';
import { ButtonBase } from './button-base.js';
import { style } from './style.js';
/**
 * @summary 按钮组件
 *
 * ```html
 * <mdui-button>Button</mdui-button>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 按钮的文本
 * @slot icon - 按钮左侧的元素
 * @slot end-icon - 按钮右侧的元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 按钮的文本
 * @csspart icon - 按钮左侧的图标
 * @csspart end-icon - 按钮右侧的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let Button = class Button extends ButtonBase {
    constructor() {
        super(...arguments);
        /**
         * 按钮的形状。可选值包括：
         *
         * * `elevated`：带阴影的按钮，适用于需要将按钮与背景视觉分离的场景
         * * `filled`：视觉效果强烈，适用于重要流程的最终操作，如“保存”、“确认”等
         * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作，如流程中的“下一步”
         * * `outlined`：带边框的按钮，适用于中等优先级，且次要的操作，如“返回”
         * * `text`：文本按钮，适用于最低优先级的操作
         */
        this.variant = 'filled';
        /**
         * 是否填满父元素宽度
         */
        this.fullWidth = false;
        this.rippleRef = createRef();
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    render() {
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton()
            ? this.renderButton({
                className: 'button',
                part: 'button',
                content: this.renderInner(),
            })
            : this.disabled || this.loading
                ? html `<span part="button" class="button _a">${this.renderInner()}</span>`
                : this.renderAnchor({
                    className: 'button',
                    part: 'button',
                    content: this.renderInner(),
                })}`;
    }
    renderIcon() {
        if (this.loading) {
            return this.renderLoading();
        }
        return html `<slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot>`;
    }
    renderLabel() {
        return html `<slot part="label" class="label"></slot>`;
    }
    renderEndIcon() {
        return html `<slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon
            ? html `<mdui-icon name="${this.endIcon}"></mdui-icon>`
            : nothingTemplate}</slot>`;
    }
    renderInner() {
        return [this.renderIcon(), this.renderLabel(), this.renderEndIcon()];
    }
};
Button.styles = [ButtonBase.styles, style];
__decorate([
    property({ reflect: true })
], Button.prototype, "variant", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'full-width',
    })
], Button.prototype, "fullWidth", void 0);
__decorate([
    property({ reflect: true })
], Button.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'end-icon' })
], Button.prototype, "endIcon", void 0);
Button = __decorate([
    customElement('mdui-button')
], Button);
export { Button };
