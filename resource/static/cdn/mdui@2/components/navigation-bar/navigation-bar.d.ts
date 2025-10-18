import { PropertyValues } from 'lit';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { ScrollPaddingPosition } from '@mdui/shared/mixins/scrollBehavior.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const NavigationBar_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/scrollBehavior.js").ScrollBehaviorMixinInterface> & typeof LayoutItemBase;
/**
 * @summary 底部导航栏组件。需配合 `<mdui-navigation-bar-item>` 组件使用
 *
 * ```html
 * <mdui-navigation-bar>
 * ..<mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
 * </mdui-navigation-bar>
 * ```
 *
 * @event change - 值变化时触发
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - `<mdui-navigation-bar-item>` 组件
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class NavigationBar extends NavigationBar_base<NavigationBarEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否隐藏
     */
    hide: boolean;
    /**
     * 文本的可视状态。可选值包括：
     *
     * * `auto`：当选项小于等于3个时，始终显示文本；当选项大于3个时，仅显示选中状态的文本
     * * `selected`：仅在选中状态显示文本
     * * `labeled`：始终显示文本
     * * `unlabeled`：始终不显示文本
     */
    labelVisibility: /*当选项小于等于3个时，始终显示文本；当选项大于3个时，仅显示选中状态的文本*/ 'auto' | /*仅在选中状态显示文本*/ 'selected' | /*始终显示文本*/ 'labeled' | /*始终不显示文本*/ 'unlabeled';
    /**
     * 当前选中的 `<mdui-navigation-bar-item>` 的值
     */
    value?: string;
    /**
     * 滚动行为。可选值包括：
     *
     * * `hide`：滚动时隐藏
     */
    scrollBehavior?: 'hide';
    private activeKey;
    private readonly items;
    private isInitial;
    private definedController;
    protected get scrollPaddingPosition(): ScrollPaddingPosition;
    protected get layoutPlacement(): LayoutPlacement;
    private onActiveKeyChange;
    private onValueChange;
    private onLabelVisibilityChange;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    /**
     * 滚动行为
     * 当前仅支持 hide 这一个行为，所以不做行为类型判断
     */
    protected runScrollThreshold(isScrollingUp: boolean): void;
    private onClick;
    private updateItems;
    private onSlotChange;
}
export interface NavigationBarEventMap {
    change: CustomEvent<void>;
    show: CustomEvent<void>;
    shown: CustomEvent<void>;
    hide: CustomEvent<void>;
    hidden: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-navigation-bar': NavigationBar;
    }
}
export {};
