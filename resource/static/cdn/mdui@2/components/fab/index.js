import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { delay } from '@mdui/shared/helpers/delay.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
/**
 * @summary 浮动操作按钮组件
 *
 * ```html
 * <mdui-fab icon="edit"></mdui-fab>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 右侧的文本
 * @csspart icon - 左侧的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner-small - `size="small"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-normal - `size="normal"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-large - `size="large"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let Fab = class Fab extends ButtonBase {
    constructor() {
        super(...arguments);
        /**
         * FAB 的形状，此组件的不同形状之间只有颜色不一样。可选值包括：
         *
         * * `primary`：使用 Primary container 背景色
         * * `surface`：使用 Surface container high 背景色
         * * `secondary`：使用 Secondary container 背景色
         * * `tertiary`：使用 Tertiary container 背景色
         */
        this.variant = 'primary';
        /**
         * FAB 的大小。可选值包括：
         * * `normal`：普通大小 FAB
         * * `small`：小型 FAB
         * * `large`：大型 FAB
         */
        this.size = 'normal';
        /**
         * 是否为展开状态
         */
        this.extended = false;
        this.rippleRef = createRef();
        this.hasSlotController = new HasSlotController(this, 'icon');
        this.definedController = new DefinedController(this, {
            relatedElements: [''],
        });
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    /**
     * extended 变更时，设置动画
     */
    async onExtendedChange() {
        const hasUpdated = this.hasUpdated;
        if (this.extended) {
            this.style.width = `${this.scrollWidth}px`;
        }
        else {
            this.style.width = '';
        }
        await this.definedController.whenDefined();
        await this.updateComplete;
        if (this.extended && !hasUpdated) {
            this.style.width = `${this.scrollWidth}px`;
        }
        if (!hasUpdated) {
            // 延迟设置动画，避免首次渲染时也执行动画
            await delay();
            this.style.transitionProperty = 'box-shadow, width, bottom, transform'; // bottom, transform 在 bottom-app-bar 中用到
        }
    }
    render() {
        const className = cc({
            button: true,
            'has-icon': this.icon || this.hasSlotController.test('icon'),
        });
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton()
            ? this.renderButton({
                className,
                part: 'button',
                content: this.renderInner(),
            })
            : this.disabled || this.loading
                ? html `<span part="button" class="_a ${className}">${this.renderInner()}</span>`
                : this.renderAnchor({
                    className,
                    part: 'button',
                    content: this.renderInner(),
                })}`;
    }
    renderLabel() {
        return html `<slot part="label" class="label"></slot>`;
    }
    renderIcon() {
        if (this.loading) {
            return this.renderLoading();
        }
        return html `<slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot>`;
    }
    renderInner() {
        return [this.renderIcon(), this.renderLabel()];
    }
};
Fab.styles = [ButtonBase.styles, style];
__decorate([
    property({ reflect: true })
], Fab.prototype, "variant", void 0);
__decorate([
    property({ reflect: true })
], Fab.prototype, "size", void 0);
__decorate([
    property({ reflect: true })
], Fab.prototype, "icon", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Fab.prototype, "extended", void 0);
__decorate([
    watch('extended')
], Fab.prototype, "onExtendedChange", null);
Fab = __decorate([
    customElement('mdui-fab')
], Fab);
export { Fab };
