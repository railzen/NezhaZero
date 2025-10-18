import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { breakpoint } from '@mdui/shared/helpers/breakpoint.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '@mdui/shared/icons/clear.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import '../button-icon.js';
import '../button.js';
import '../icon.js';
import { style } from './style.js';
// snackbar 堆叠时的数组
const stacks = [];
// 是否重新排序中，mobile 变化时，仅重新排序一次
let reordering = false;
/**
 * @summary 消息条组件
 *
 * ```html
 * <mdui-snackbar>message</mdui-snackbar>
 * ```
 *
 * @event open - Snackbar 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 Snackbar 显示
 * @event opened - Snackbar 显示动画完成时，事件被触发
 * @event close - Snackbar 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 Snackbar 关闭
 * @event closed - Snackbar 隐藏动画完成时，事件被触发
 * @event action-click - 点击操作按钮时触发
 *
 * @slot - Snackbar 的消息文本内容
 * @slot action - 右侧的操作按钮
 * @slot close-button - 右侧的关闭按钮。必须设置 `closeable` 属性为 `true` 才会显示
 * @slot close-icon - 关闭按钮中的图标
 *
 * @csspart message - 消息文本
 * @csspart action - 操作按钮
 * @csspart close-button - 关闭按钮
 * @csspart close-icon - 关闭按钮中的图标
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
let Snackbar = class Snackbar extends MduiElement {
    constructor() {
        super();
        /**
         * 是否显示 Snackbar
         */
        this.open = false;
        /**
         * Snackbar 的显示位置。默认为 `bottom`。可选值包括：
         *
         * * `top`：顶部居中
         * * `top-start`：顶部左对齐
         * * `top-end`：顶部右对齐
         * * `bottom`：底部居中
         * * `bottom-start`：底部左对齐
         * * `bottom-end`：底部右对齐
         */
        this.placement = 'bottom';
        /**
         * 操作按钮是否处于加载中状态
         */
        this.actionLoading = false;
        /**
         * 是否在右侧显示关闭按钮
         */
        this.closeable = false;
        /**
         * 自动关闭的延迟时间（单位：毫秒）。设置为 `0` 则不自动关闭。默认为 5000 毫秒
         */
        this.autoCloseDelay = 5000;
        /**
         * 点击或触摸 Snackbar 以外的区域时，是否关闭 Snackbar
         */
        this.closeOnOutsideClick = false;
        this.mobile = false;
        this.onDocumentClick = this.onDocumentClick.bind(this);
    }
    async onOpenChange() {
        const easingLinear = getEasing(this, 'linear');
        const children = Array.from(this.renderRoot.querySelectorAll('.message, .action-group'));
        // 打开
        // 要区分是否首次渲染，首次渲染时不触发事件，不执行动画；非首次渲染，触发事件，执行动画
        if (this.open) {
            const hasUpdated = this.hasUpdated;
            if (!hasUpdated) {
                await this.updateComplete;
            }
            if (hasUpdated) {
                const eventProceeded = this.emit('open', { cancelable: true });
                if (!eventProceeded) {
                    return;
                }
            }
            window.clearTimeout(this.closeTimeout);
            if (this.autoCloseDelay) {
                this.closeTimeout = window.setTimeout(() => {
                    this.open = false;
                }, this.autoCloseDelay);
            }
            this.style.display = 'flex';
            await Promise.all([
                stopAnimations(this),
                ...children.map((child) => stopAnimations(child)),
            ]);
            stacks.push({
                height: this.clientHeight,
                snackbar: this,
            });
            await this.reorderStack(this);
            const duration = getDuration(this, 'medium4');
            await Promise.all([
                animateTo(this, [{ opacity: 0 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }], {
                    duration: hasUpdated ? duration : 0,
                    easing: easingLinear,
                    fill: 'forwards',
                }),
                ...children.map((child) => animateTo(child, [
                    { opacity: 0 },
                    { opacity: 0, offset: 0.2 },
                    { opacity: 1, offset: 0.8 },
                    { opacity: 1 },
                ], {
                    duration: hasUpdated ? duration : 0,
                    easing: easingLinear,
                })),
            ]);
            if (hasUpdated) {
                this.emit('opened');
            }
            return;
        }
        // 关闭
        if (!this.open && this.hasUpdated) {
            const eventProceeded = this.emit('close', { cancelable: true });
            if (!eventProceeded) {
                return;
            }
            window.clearTimeout(this.closeTimeout);
            await Promise.all([
                stopAnimations(this),
                ...children.map((child) => stopAnimations(child)),
            ]);
            const duration = getDuration(this, 'short4');
            await Promise.all([
                animateTo(this, [{ opacity: 1 }, { opacity: 0 }], {
                    duration,
                    easing: easingLinear,
                    fill: 'forwards',
                }),
                ...children.map((child) => animateTo(child, [{ opacity: 1 }, { opacity: 0, offset: 0.75 }, { opacity: 0 }], {
                    duration,
                    easing: easingLinear,
                })),
            ]);
            this.style.display = 'none';
            this.emit('closed');
            const stackIndex = stacks.findIndex((stack) => stack.snackbar === this);
            stacks.splice(stackIndex, 1);
            if (stacks[stackIndex]) {
                await this.reorderStack(stacks[stackIndex].snackbar);
            }
            return;
        }
    }
    /**
     * 这两个属性变更时，需要重新排序该组件后面的 snackbar
     */
    async onStackChange() {
        await this.reorderStack(this);
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('pointerdown', this.onDocumentClick);
        // 先立即计算一次，避免在首次 open 时还未计算完成
        this.mobile = breakpoint().down('sm');
        this.observeResize = observeResize(document.documentElement, async () => {
            const mobile = breakpoint().down('sm');
            if (this.mobile !== mobile) {
                this.mobile = mobile;
                if (!reordering) {
                    reordering = true;
                    await this.reorderStack();
                    reordering = false;
                }
            }
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('pointerdown', this.onDocumentClick);
        window.clearTimeout(this.closeTimeout);
        if (this.open) {
            this.open = false;
        }
        this.observeResize?.unobserve();
    }
    render() {
        return html `<slot part="message" class="message"></slot><div class="action-group"><slot name="action" part="action" class="action" @click="${this.onActionClick}">${this.action
            ? html `<mdui-button variant="text" loading="${this.actionLoading}">${this.action}</mdui-button>`
            : nothingTemplate}</slot>${when(this.closeable, () => html `<slot name="close-button" part="close-button" class="close-button" @click="${this.onCloseClick}"><mdui-button-icon><slot name="close-icon" part="close-icon">${this.closeIcon
            ? html `<mdui-icon name="${this.closeIcon}" class="i"></mdui-icon>`
            : html `<mdui-icon-clear class="i"></mdui-icon-clear>`}</slot></mdui-button-icon></slot>`)}</div>`;
    }
    /**
     * 重新排序 snackbar 堆叠
     * @param startSnackbar 从哪个 snackbar 开始重新排列，默认从第一个开始
     * @private
     */
    async reorderStack(startSnackbar) {
        const stackIndex = startSnackbar
            ? stacks.findIndex((stack) => stack.snackbar === startSnackbar)
            : 0;
        for (let i = stackIndex; i < stacks.length; i++) {
            const stack = stacks[i];
            const snackbar = stack.snackbar;
            if (this.mobile) {
                ['top', 'bottom'].forEach((placement) => {
                    if (snackbar.placement.startsWith(placement)) {
                        const prevStacks = stacks.filter((stack, index) => {
                            return (index < i && stack.snackbar.placement.startsWith(placement));
                        });
                        const prevHeight = prevStacks.reduce((prev, current) => prev + current.height, 0);
                        // @ts-ignore
                        snackbar.style[placement] =
                            `calc(${prevHeight}px + ${prevStacks.length + 1}rem)`;
                        snackbar.style[placement === 'top' ? 'bottom' : 'top'] = 'auto';
                    }
                });
            }
            else {
                [
                    'top',
                    'top-start',
                    'top-end',
                    'bottom',
                    'bottom-start',
                    'bottom-end',
                ].forEach((placement) => {
                    if (snackbar.placement === placement) {
                        const prevStacks = stacks.filter((stack, index) => {
                            return index < i && stack.snackbar.placement === placement;
                        });
                        const prevHeight = prevStacks.reduce((prev, current) => prev + current.height, 0);
                        snackbar.style[placement.startsWith('top') ? 'top' : 'bottom'] =
                            `calc(${prevHeight}px + ${prevStacks.length + 1}rem)`;
                        snackbar.style[placement.startsWith('top') ? 'bottom' : 'top'] =
                            'auto';
                    }
                });
            }
        }
    }
    /**
     * 在 document 上点击时，根据条件判断是否要关闭 snackbar
     */
    onDocumentClick(e) {
        if (!this.open || !this.closeOnOutsideClick) {
            return;
        }
        const target = e.target;
        if (!this.contains(target) && this !== target) {
            this.open = false;
        }
    }
    onActionClick(event) {
        event.stopPropagation();
        this.emit('action-click');
    }
    onCloseClick() {
        this.open = false;
    }
};
Snackbar.styles = [componentStyle, style];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Snackbar.prototype, "open", void 0);
__decorate([
    property({ reflect: true })
], Snackbar.prototype, "placement", void 0);
__decorate([
    property({ reflect: true, attribute: 'action' })
], Snackbar.prototype, "action", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'action-loading',
    })
], Snackbar.prototype, "actionLoading", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Snackbar.prototype, "closeable", void 0);
__decorate([
    property({ reflect: true, attribute: 'close-icon' })
], Snackbar.prototype, "closeIcon", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'message-line' })
    // eslint-disable-next-line prettier/prettier
], Snackbar.prototype, "messageLine", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'auto-close-delay' })
], Snackbar.prototype, "autoCloseDelay", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        attribute: 'close-on-outside-click',
        converter: booleanConverter,
    })
], Snackbar.prototype, "closeOnOutsideClick", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Snackbar.prototype, "mobile", void 0);
__decorate([
    watch('open')
], Snackbar.prototype, "onOpenChange", null);
__decorate([
    watch('placement', true),
    watch('messageLine', true)
], Snackbar.prototype, "onStackChange", null);
Snackbar = __decorate([
    customElement('mdui-snackbar')
], Snackbar);
export { Snackbar };
