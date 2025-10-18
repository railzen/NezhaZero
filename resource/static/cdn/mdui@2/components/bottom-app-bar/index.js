import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ScrollBehaviorMixin } from '@mdui/shared/mixins/scrollBehavior.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { style } from './style.js';
/**
 * @summary 底部应用栏组件
 *
 * ```html
 * <mdui-bottom-app-bar>
 * ..<mdui-button-icon icon="check_box--outlined"></mdui-button-icon>
 * ..<mdui-button-icon icon="edit--outlined"></mdui-button-icon>
 * ..<mdui-button-icon icon="mic_none--outlined"></mdui-button-icon>
 * ..<mdui-button-icon icon="image--outlined"></mdui-button-icon>
 * ..<div style="flex-grow: 1"></div>
 * ..<mdui-fab icon="add"></mdui-fab>
 * </mdui-bottom-app-bar>
 * ```
 *
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - 底部应用栏内部的元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
let BottomAppBar = class BottomAppBar extends ScrollBehaviorMixin(LayoutItemBase) {
    constructor() {
        super(...arguments);
        /**
         * 是否隐藏
         */
        this.hide = false;
        /**
         * 是否让底部应用栏中的 [`<mdui-fab>`](/docs/2/components/fab) 组件脱离应用栏。如果为 `true`，则当应用栏隐藏后，[`<mdui-fab>`](/docs/2/components/fab) 仍会停留在页面上
         */
        this.fabDetach = false;
    }
    get scrollPaddingPosition() {
        return 'bottom';
    }
    get layoutPlacement() {
        return 'bottom';
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.addEventListener('transitionend', (event) => {
            if (event.target === this) {
                this.emit(this.hide ? 'hidden' : 'shown');
            }
        });
    }
    render() {
        return html `<slot></slot>`;
    }
    /**
     * 滚动行为
     * 当前仅支持 hide 这一个行为，所以不做行为类型判断
     */
    runScrollThreshold(isScrollingUp) {
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
};
BottomAppBar.styles = [componentStyle, style];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], BottomAppBar.prototype, "hide", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'fab-detach',
    })
], BottomAppBar.prototype, "fabDetach", void 0);
__decorate([
    property({ reflect: true, attribute: 'scroll-behavior' })
], BottomAppBar.prototype, "scrollBehavior", void 0);
BottomAppBar = __decorate([
    customElement('mdui-bottom-app-bar')
], BottomAppBar);
export { BottomAppBar };
