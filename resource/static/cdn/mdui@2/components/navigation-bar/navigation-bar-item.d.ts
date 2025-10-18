import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const NavigationBarItem_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/anchor.js").AnchorMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 底部导航栏项组件。需配合 `<mdui-navigation-bar>` 组件使用
 *
 * ```html
 * <mdui-navigation-bar>
 * ..<mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
 * </mdui-navigation-bar>
 * ```
 *
 * @slot - 导航项文本
 * @slot icon - 图标
 * @slot active-icon - 激活状态的图标元素
 * @slot badge - 徽标
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @csspart container - 导航项容器
 * @csspart indicator - 指示器
 * @csspart badge - 徽标
 * @csspart icon - 图标
 * @csspart active-icon - 激活状态的图标
 * @csspart label - 导航项文本
 *
 * @cssprop --shape-corner-indicator - 指示器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class NavigationBarItem extends NavigationBarItem_base<NavigationBarItemEventMap> {
    static styles: CSSResultGroup;
    /**
     * 未激活状态的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 激活状态的 Material Icons 图标名。也可以通过 `slot="active-icon"` 设置
     */
    activeIcon?: string;
    /**
     * 导航项的值
     */
    value?: string;
    /**
     * 文本的可视状态，由 `<mdui-navigation-bar>` 组件控制该参数
     */
    protected labelVisibility?: 'selected' | 'labeled' | 'unlabeled';
    /**
     * 是否是初始状态，不显示动画。由 `<mdui-navigation-bar>` 组件控制该参数
     */
    protected isInitial: boolean;
    /**
     * 是否为激活状态，由 `<mdui-navigation-bar>` 组件控制该参数
     */
    protected active: boolean;
    private disabled;
    protected readonly key: number;
    private readonly rippleRef;
    private readonly hasSlotController;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement | null;
    protected get focusDisabled(): boolean;
    protected render(): TemplateResult;
    private renderInner;
}
export interface NavigationBarItemEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-navigation-bar-item': NavigationBarItem;
    }
}
export {};
