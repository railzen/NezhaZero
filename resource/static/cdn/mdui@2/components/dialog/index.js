import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, queryAssignedElements, } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { animateTo, stopAnimations } from '@mdui/shared/helpers/animate.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { Modal } from '@mdui/shared/helpers/modal.js';
import { getDuration, getEasing } from '@mdui/shared/helpers/motion.js';
import { lockScreen, unlockScreen } from '@mdui/shared/helpers/scroll.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { offLocaleReady } from '../../internal/localize.js';
import '../icon.js';
import { style } from './style.js';
/**
 * @summary 对话框组件
 *
 * ```html
 * <mdui-dialog>content</mdui-dialog>
 * ```
 *
 * @event open - 对话框开始打开时触发。可以通过调用 `event.preventDefault()` 阻止对话框打开
 * @event opened - 对话框打开动画完成后触发
 * @event close - 对话框开始关闭时触发。可以通过调用 `event.preventDefault()` 阻止对话框关闭
 * @event closed - 对话框关闭动画完成后触发
 * @event overlay-click - 点击遮罩层时触发
 *
 * @slot header - 顶部元素，默认包含 `icon` slot 和 `headline` slot
 * @slot icon - 顶部图标
 * @slot headline - 顶部标题
 * @slot description - 标题下方的文本
 * @slot - 对话框主体内容
 * @slot action - 底部操作栏中的元素
 *
 * @csspart overlay - 遮罩层
 * @csspart panel - 对话框容器
 * @csspart header - 对话框 header 部分，包含 icon 和 headline
 * @csspart icon - 顶部图标，位于 header 中
 * @csspart headline - 顶部标题，位于 header 中
 * @csspart body - 对话框 body 部分
 * @csspart description - 副文本部分，位于 body 中
 * @csspart action - 底部操作按钮
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
let Dialog = class Dialog extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否打开对话框
         */
        this.open = false;
        /**
         * 是否全屏显示对话框
         */
        this.fullscreen = false;
        /**
         * 是否允许按下 ESC 键关闭对话框
         */
        this.closeOnEsc = false;
        /**
         * 是否允许点击遮罩层关闭对话框
         */
        this.closeOnOverlayClick = false;
        /**
         * 是否垂直排列底部操作按钮
         */
        this.stackedActions = false;
        this.overlayRef = createRef();
        this.panelRef = createRef();
        this.bodyRef = createRef();
        this.hasSlotController = new HasSlotController(this, 'header', 'icon', 'headline', 'description', 'action', '[default]');
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-top-app-bar'],
        });
    }
    async onOpenChange() {
        const hasUpdated = this.hasUpdated;
        // 默认为关闭状态。因此首次渲染时，且为关闭状态，不执行
        if (!this.open && !hasUpdated) {
            return;
        }
        await this.definedController.whenDefined();
        if (!hasUpdated) {
            await this.updateComplete;
        }
        // 内部的 header, body, actions 元素
        const children = Array.from(this.panelRef.value.querySelectorAll('.header, .body, .actions'));
        const easingLinear = getEasing(this, 'linear');
        const easingEmphasizedDecelerate = getEasing(this, 'emphasized-decelerate');
        const easingEmphasizedAccelerate = getEasing(this, 'emphasized-accelerate');
        const stopAnimation = () => Promise.all([
            stopAnimations(this.overlayRef.value),
            stopAnimations(this.panelRef.value),
            ...children.map((child) => stopAnimations(child)),
        ]);
        // 打开
        // 要区分是否首次渲染，首次渲染不触发事件，不执行动画；非首次渲染，触发事件，执行动画
        if (this.open) {
            if (hasUpdated) {
                const eventProceeded = this.emit('open', { cancelable: true });
                if (!eventProceeded) {
                    return;
                }
            }
            this.style.display = 'flex';
            // 包含 <mdui-top-app-bar slot="header"> 时
            const topAppBarElements = this.topAppBarElements ?? [];
            if (topAppBarElements.length) {
                const topAppBarElement = topAppBarElements[0];
                // top-app-bar 未设置 scrollTarget 时，默认设置为 bodyRef
                if (!topAppBarElement.scrollTarget) {
                    topAppBarElement.scrollTarget = this.bodyRef.value;
                }
                // 移除 header 和 body 之间的 margin
                this.bodyRef.value.style.marginTop = '0';
            }
            this.originalTrigger = document.activeElement;
            this.modalHelper.activate();
            lockScreen(this);
            await stopAnimation();
            // 设置聚焦
            requestAnimationFrame(() => {
                const autoFocusTarget = this.querySelector('[autofocus]');
                if (autoFocusTarget) {
                    autoFocusTarget.focus({ preventScroll: true });
                }
                else {
                    this.panelRef.value.focus({ preventScroll: true });
                }
            });
            const duration = getDuration(this, 'medium4');
            await Promise.all([
                animateTo(this.overlayRef.value, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }], {
                    duration: hasUpdated ? duration : 0,
                    easing: easingLinear,
                }),
                animateTo(this.panelRef.value, [
                    { transform: 'translateY(-1.875rem) scaleY(0)' },
                    { transform: 'translateY(0) scaleY(1)' },
                ], {
                    duration: hasUpdated ? duration : 0,
                    easing: easingEmphasizedDecelerate,
                }),
                animateTo(this.panelRef.value, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1 }], {
                    duration: hasUpdated ? duration : 0,
                    easing: easingLinear,
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
        }
        else {
            const eventProceeded = this.emit('close', { cancelable: true });
            if (!eventProceeded) {
                return;
            }
            this.modalHelper.deactivate();
            await stopAnimation();
            const duration = getDuration(this, 'short4');
            await Promise.all([
                animateTo(this.overlayRef.value, [{ opacity: 1 }, { opacity: 0 }], {
                    duration,
                    easing: easingLinear,
                }),
                animateTo(this.panelRef.value, [
                    { transform: 'translateY(0) scaleY(1)' },
                    { transform: 'translateY(-1.875rem) scaleY(0.6)' },
                ], { duration, easing: easingEmphasizedAccelerate }),
                animateTo(this.panelRef.value, [{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration, easing: easingLinear }),
                ...children.map((child) => animateTo(child, [{ opacity: 1 }, { opacity: 0, offset: 0.75 }, { opacity: 0 }], { duration, easing: easingLinear })),
            ]);
            this.style.display = 'none';
            unlockScreen(this);
            // 对话框关闭后，恢复焦点到原有的元素上
            const trigger = this.originalTrigger;
            if (typeof trigger?.focus === 'function') {
                setTimeout(() => trigger.focus());
            }
            this.emit('closed');
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        unlockScreen(this);
        // alert, confirm, prompt 函数支持 localize。这里确保在组件销毁时，取消监听 localize ready 事件
        offLocaleReady(this);
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.modalHelper = new Modal(this);
        this.addEventListener('keydown', (event) => {
            if (this.open && this.closeOnEsc && event.key === 'Escape') {
                event.stopPropagation();
                this.open = false;
            }
        });
    }
    render() {
        const hasActionSlot = this.hasSlotController.test('action');
        const hasDefaultSlot = this.hasSlotController.test('[default]');
        const hasIcon = !!this.icon || this.hasSlotController.test('icon');
        const hasHeadline = !!this.headline || this.hasSlotController.test('headline');
        const hasDescription = !!this.description || this.hasSlotController.test('description');
        const hasHeader = hasIcon || hasHeadline || this.hasSlotController.test('header');
        const hasBody = hasDescription || hasDefaultSlot;
        return html `<div ${ref(this.overlayRef)} part="overlay" class="overlay" @click="${this.onOverlayClick}" tabindex="-1"></div><div ${ref(this.panelRef)} part="panel" class="panel ${classMap({
            'has-icon': hasIcon,
            'has-description': hasDescription,
            'has-default': hasDefaultSlot,
        })}" tabindex="0">${when(hasHeader, () => html `<slot name="header" part="header" class="header">${when(hasIcon, () => this.renderIcon())} ${when(hasHeadline, () => this.renderHeadline())}</slot>`)} ${when(hasBody, () => html `<div ${ref(this.bodyRef)} part="body" class="body">${when(hasDescription, () => this.renderDescription())}<slot></slot></div>`)} ${when(hasActionSlot, () => html `<slot name="action" part="action" class="action"></slot>`)}</div>`;
    }
    onOverlayClick() {
        this.emit('overlay-click');
        if (!this.closeOnOverlayClick) {
            return;
        }
        this.open = false;
    }
    renderIcon() {
        return html `<slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot>`;
    }
    renderHeadline() {
        return html `<slot name="headline" part="headline" class="headline">${this.headline}</slot>`;
    }
    renderDescription() {
        return html `<slot name="description" part="description" class="description">${this.description}</slot>`;
    }
};
Dialog.styles = [componentStyle, style];
__decorate([
    property({ reflect: true })
], Dialog.prototype, "icon", void 0);
__decorate([
    property({ reflect: true })
], Dialog.prototype, "headline", void 0);
__decorate([
    property({ reflect: true })
], Dialog.prototype, "description", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Dialog.prototype, "open", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Dialog.prototype, "fullscreen", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'close-on-esc',
    })
], Dialog.prototype, "closeOnEsc", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'close-on-overlay-click',
    })
], Dialog.prototype, "closeOnOverlayClick", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'stacked-actions',
    })
], Dialog.prototype, "stackedActions", void 0);
__decorate([
    queryAssignedElements({
        slot: 'header',
        selector: 'mdui-top-app-bar',
        flatten: true,
    })
], Dialog.prototype, "topAppBarElements", void 0);
__decorate([
    watch('open')
], Dialog.prototype, "onOpenChange", null);
Dialog = __decorate([
    customElement('mdui-dialog')
], Dialog);
export { Dialog };
