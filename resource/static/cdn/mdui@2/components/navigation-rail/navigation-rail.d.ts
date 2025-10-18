import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 侧边导航栏组件。需配合 `<mdui-navigation-rail-item>` 组件使用
 *
 * ```html
 * <mdui-navigation-rail>
 * ..<mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
 * </mdui-navigation-rail>
 * ```
 *
 * @event change - 值变化时触发
 *
 * @slot - `<mdui-navigation-rail-item>` 组件
 * @slot top - 顶部的元素
 * @slot bottom - 底部的元素
 *
 * @csspart top - 顶部元素的容器
 * @csspart bottom - 底部元素的容器
 * @csspart items - `<mdui-navigation-rail-item>` 组件的容器
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class NavigationRail extends LayoutItemBase<NavigationRailEventMap> {
    static styles: CSSResultGroup;
    /**
     * 当前选中的 `<mdui-navigation-rail-item>` 的值
     */
    value?: string;
    /**
     * 导航栏的位置。可选值包括：
     *
     * * `left`：左侧
     * * `right`：右侧
     */
    placement: /*左侧*/ 'left' | /*右侧*/ 'right';
    /**
     * `<mdui-navigation-rail-item>` 元素的对齐方式。可选值包括：
     *
     * * `start`：顶部对齐
     * * `center`：居中对齐
     * * `end`：底部对齐
     */
    alignment: /*顶部对齐*/ 'start' | /*居中对齐*/ 'center' | /*底部对齐*/ 'end';
    /**
     * 默认情况下，导航栏相对于 `body` 元素显示。当该参数设置为 `true` 时，导航栏将相对于其父元素显示。
     *
     * **Note**：设置该属性时，必须在父元素上手动设置样式 `position: relative;`。
     */
    contained: boolean;
    /**
     * 是否在导航栏和页面内容之间添加分割线
     */
    divider: boolean;
    private activeKey;
    private readonly items;
    private readonly hasSlotController;
    private readonly definedController;
    private isInitial;
    protected get layoutPlacement(): LayoutPlacement;
    private get parentTarget();
    private get isRight();
    private get paddingValue();
    private onActiveKeyChange;
    private onValueChange;
    private onContainedChange;
    private onPlacementChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult;
    private onClick;
    private updateItems;
    private onSlotChange;
}
export interface NavigationRailEventMap {
    change: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-navigation-rail': NavigationRail;
    }
}
