import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, queryAssignedElements, } from 'lit/decorators.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ScrollBehaviorMixin } from '@mdui/shared/mixins/scrollBehavior.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { topAppBarStyle } from './top-app-bar-style.js';
/**
 * @summary 顶部应用栏组件
 *
 * ```html
 * <mdui-top-app-bar>
 * ..<mdui-button-icon icon="menu"></mdui-button-icon>
 * ..<mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
 * ..<div style="flex-grow: 1"></div>
 * ..<mdui-button-icon icon="more_vert"></mdui-button-icon>
 * </mdui-top-app-bar>
 * ```
 *
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 顶部应用栏内部的元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
let TopAppBar = class TopAppBar extends ScrollBehaviorMixin(LayoutItemBase) {
    constructor() {
        super(...arguments);
        /**
         * 顶部应用栏的形状。默认为 `small`。可选值包括：
         *
         * * `center-aligned`：小型应用栏，标题居中
         * * `small`：小型应用栏
         * * `medium`：中型应用栏
         * * `large`：大型应用栏
         */
        this.variant = 'small';
        /**
         * 是否隐藏
         */
        this.hide = false;
        /**
         * 是否缩小为 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
         */
        this.shrink = false;
        /**
         * 滚动条是否不位于顶部
         */
        this.scrolling = false;
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-top-app-bar-title'],
        });
    }
    get scrollPaddingPosition() {
        return 'top';
    }
    get layoutPlacement() {
        return 'top';
    }
    async onVariantChange() {
        if (this.hasUpdated) {
            // variant 变更时，重新为 scrollTargetContainer 元素添加 padding-top。避免 top-app-bar 覆盖内容
            this.addEventListener('transitionend', async () => {
                await this.scrollBehaviorDefinedController.whenDefined();
                this.setContainerPadding('update', this.scrollTarget);
            }, { once: true });
        }
        else {
            await this.updateComplete;
        }
        await this.definedController.whenDefined();
        this.titleElements.forEach((titleElement) => {
            titleElement.variant = this.variant;
        });
    }
    async onShrinkChange() {
        if (!this.hasUpdated) {
            await this.updateComplete;
        }
        await this.definedController.whenDefined();
        this.titleElements.forEach((titleElement) => {
            titleElement.shrink = this.shrink;
        });
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.addEventListener('transitionend', (e) => {
            if (e.target === this) {
                this.emit(this.hide ? 'hidden' : 'shown');
            }
        });
    }
    render() {
        return html `<slot></slot>`;
    }
    runScrollNoThreshold(isScrollingUp, scrollTop) {
        // 向上滚动到顶部时，复原（无视 scrollThreshold 属性，否则会无法复原）
        if (this.hasScrollBehavior('shrink')) {
            // 到距离顶部 8px 即开始复原，显得灵敏些
            if (isScrollingUp && scrollTop < 8) {
                this.shrink = false;
            }
        }
    }
    runScrollThreshold(isScrollingUp, scrollTop) {
        // 滚动时添加阴影
        if (this.hasScrollBehavior('elevate')) {
            this.scrolling = !!scrollTop;
        }
        // 向下滚动时，缩小
        if (this.hasScrollBehavior('shrink')) {
            if (!isScrollingUp) {
                this.shrink = true;
            }
        }
        // 滚动时隐藏
        if (this.hasScrollBehavior('hide')) {
            // 向下滚动
            if (!isScrollingUp && !this.hide) {
                const eventProceeded = this.emit('hide', { cancelable: true });
                if (eventProceeded) {
                    this.hide = true;
                }
            }
            // 向上滚动
            if (isScrollingUp && this.hide) {
                const eventProceeded = this.emit('show', { cancelable: true });
                if (eventProceeded) {
                    this.hide = false;
                }
            }
        }
    }
};
TopAppBar.styles = [
    componentStyle,
    topAppBarStyle,
];
__decorate([
    property({ reflect: true })
], TopAppBar.prototype, "variant", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TopAppBar.prototype, "hide", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TopAppBar.prototype, "shrink", void 0);
__decorate([
    property({ reflect: true, attribute: 'scroll-behavior' })
], TopAppBar.prototype, "scrollBehavior", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TopAppBar.prototype, "scrolling", void 0);
__decorate([
    queryAssignedElements({ selector: 'mdui-top-app-bar-title', flatten: true })
], TopAppBar.prototype, "titleElements", void 0);
__decorate([
    watch('variant')
], TopAppBar.prototype, "onVariantChange", null);
__decorate([
    watch('shrink')
], TopAppBar.prototype, "onShrinkChange", null);
TopAppBar = __decorate([
    customElement('mdui-top-app-bar')
], TopAppBar);
export { TopAppBar };
