import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import type { LayoutPlacement } from '../layout/helper.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * 在手机端，`modal` 始终为 `true`；大于手机端时，`modal` 属性才开始生效
 *
 * @summary 侧边抽屉栏组件
 *
 * ```html
 * <mdui-navigation-drawer>content</mdui-navigation-drawer>
 * ```
 *
 * @event open - 抽屉栏打开之前触发。可以通过调用 `event.preventDefault()` 阻止抽屉栏打开
 * @event opened - 抽屉栏打开动画完成之后触发
 * @event close - 抽屉栏关闭之前触发。可以通过调用 `event.preventDefault()` 阻止抽屉栏关闭
 * @event closed - 抽屉栏关闭动画完成之后触发
 * @event overlay-click - 点击遮罩层时触发
 *
 * @slot - 抽屉栏中的内容
 *
 * @csspart overlay - 遮罩层
 * @csspart panel - 抽屉栏容器
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class NavigationDrawer extends LayoutItemBase<NavigationDrawerEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否打开抽屉栏
     */
    open: boolean;
    /**
     * 抽屉栏打开时，是否显示遮罩层
     *
     * 在窄屏设备上（屏幕宽度小于 [`--mdui-breakpoint-md`](/docs/2/styles/design-tokens#breakpoint)），会始终显示遮罩层，无视该参数
     */
    modal: boolean;
    /**
     * 在有遮罩层的情况下，按下 ESC 键是否关闭抽屉栏
     */
    closeOnEsc: boolean;
    /**
     * 点击遮罩层时，是否关闭抽屉栏
     */
    closeOnOverlayClick: boolean;
    /**
     * 抽屉栏的位置。可选值包括：
     *
     * * `left`：左侧
     * * `right`：右侧
     */
    placement: /*左侧*/ 'left' | /*右侧*/ 'right';
    /**
     * 默认情况下，抽屉栏相对于 `body` 元素显示。当该参数设置为 `true` 时，抽屉栏将相对于其父元素显示。
     *
     * **Note**：设置该属性时，必须在父元素上手动设置样式 `position: relative; overflow: hidden;`。
     */
    contained: boolean;
    private mobile;
    private originalTrigger;
    private observeResize?;
    private modalHelper;
    private readonly overlayRef;
    private readonly panelRef;
    private readonly definedController;
    protected get layoutPlacement(): LayoutPlacement;
    private get lockTarget();
    private get isModal();
    private onContainedChange;
    private onPlacementChange;
    private onMobileChange;
    private onOpenChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private setObserveResize;
    private onOverlayClick;
    private getLockTargetAnimate;
}
export interface NavigationDrawerEventMap {
    open: CustomEvent<void>;
    opened: CustomEvent<void>;
    close: CustomEvent<void>;
    closed: CustomEvent<void>;
    'overlay-click': CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-navigation-drawer': NavigationDrawer;
    }
}
