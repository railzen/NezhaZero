import { LayoutItemBase } from '../layout/layout-item-base.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ScrollPaddingPosition } from '@mdui/shared/mixins/scrollBehavior.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
declare const TopAppBar_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/scrollBehavior.js").ScrollBehaviorMixinInterface> & typeof LayoutItemBase;
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
export declare class TopAppBar extends TopAppBar_base<TopAppBarEventMap> {
    static styles: CSSResultGroup;
    /**
     * 顶部应用栏的形状。默认为 `small`。可选值包括：
     *
     * * `center-aligned`：小型应用栏，标题居中
     * * `small`：小型应用栏
     * * `medium`：中型应用栏
     * * `large`：大型应用栏
     */
    variant: /*小型应用栏，标题居中*/ 'center-aligned' | /*小型应用栏*/ 'small' | /*中型应用栏*/ 'medium' | /*大型应用栏*/ 'large';
    /**
     * 是否隐藏
     */
    hide: boolean;
    /**
     * 是否缩小为 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
     */
    shrink: boolean;
    /**
     * 滚动行为。可同时使用多个值，用空格分隔。可选值包括：
     *
     * * `hide`：滚动时隐藏
     * * `shrink`：在中型、大型应用栏中可使用，滚动时缩小成小型应用栏的样式
     * * `elevate`：滚动时添加阴影
     */
    scrollBehavior?: /*滚动时隐藏*/ 'hide' | /*在中型、大型应用栏中可使用，滚动时缩小成小型应用栏的样式*/ 'shrink' | /*滚动时添加阴影*/ 'elevate';
    /**
     * 滚动条是否不位于顶部
     */
    private scrolling;
    private readonly titleElements;
    private definedController;
    protected get scrollPaddingPosition(): ScrollPaddingPosition;
    protected get layoutPlacement(): LayoutPlacement;
    private onVariantChange;
    private onShrinkChange;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    protected runScrollNoThreshold(isScrollingUp: boolean, scrollTop: number): void;
    protected runScrollThreshold(isScrollingUp: boolean, scrollTop: number): void;
}
export interface TopAppBarEventMap {
    show: CustomEvent<void>;
    shown: CustomEvent<void>;
    hide: CustomEvent<void>;
    hidden: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-top-app-bar': TopAppBar;
    }
}
export {};
