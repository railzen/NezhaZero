import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const NavigationRailItem_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/anchor.js").AnchorMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 侧边导航项组件。需配合 `<mdui-navigation-rail>` 组件使用
 *
 * ```html
 * <mdui-navigation-rail>
 * ..<mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
 * </mdui-navigation-rail>
 * ```
 *
 * @slot - 文本内容
 * @slot icon - 图标
 * @slot active-icon - 激活状态的图标
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
 * @csspart label - 文本内容
 *
 * @cssprop --shape-corner-indicator - 指示器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class NavigationRailItem extends NavigationRailItem_base<NavigationRailItemEventMap> {
    static styles: CSSResultGroup;
    /**
     * 未激活状态下的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 激活状态下的 Material Icons 图标名。也可以通过 `slot="active-icon"` 设置
     */
    activeIcon?: string;
    /**
     * 导航项的值
     */
    value?: string;
    /**
     * 是否为激活状态，由 `<mdui-navigation-rail>` 组件控制该参数
     */
    protected active: boolean;
    /**
     * 是否是初始状态，不显示动画。由 `<mdui-navigation-rail>` 组件控制该参数
     */
    protected isInitial: boolean;
    /**
     * 导航栏的位置，由 `<mdui-navigation-rail>` 组件控制该参数
     */
    protected placement: 'left' | 'right';
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
export interface NavigationRailItemEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-navigation-rail-item': NavigationRailItem;
    }
}
export {};
