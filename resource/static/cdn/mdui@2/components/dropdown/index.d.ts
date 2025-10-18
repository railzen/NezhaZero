import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/width.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * @summary 下拉组件
 *
 * ```html
 * <mdui-dropdown>
 * ..<mdui-button slot="trigger">open dropdown</mdui-button>
 * ..<mdui-menu>
 * ....<mdui-menu-item>Item 1</mdui-menu-item>
 * ....<mdui-menu-item>Item 2</mdui-menu-item>
 * ..</mdui-menu>
 * </mdui-dropdown>
 * ```
 *
 * @event open - 下拉组件开始打开时，事件被触发。可以通过调用 `event.preventDefault()` 阻止下拉组件打开
 * @event opened - 下拉组件打开动画完成时，事件被触发
 * @event close - 下拉组件开始关闭时，事件被触发。可以通过调用 `event.preventDefault()` 阻止下拉组件关闭
 * @event closed - 下拉组件关闭动画完成时，事件被触发
 *
 * @slot - 下拉组件的内容
 * @slot trigger - 触发下拉组件的元素，例如 [`<mdui-button>`](/docs/2/components/button) 元素
 *
 * @csspart trigger - 触发下拉组件的元素的容器，即 `trigger` slot 的容器
 * @csspart panel - 下拉组件内容的容器
 *
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class Dropdown extends MduiElement<DropdownEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否打开下拉组件
     */
    open: boolean;
    /**
     * 是否禁用下拉组件
     */
    disabled: boolean;
    /**
     * 下拉组件的触发方式，支持多个值，用空格分隔。可选值包括：
     *
     * * `click`：点击触发
     * * `hover`：鼠标悬浮触发
     * * `focus`：聚焦触发
     * * `contextmenu`：鼠标右键点击、或触摸长按触发
     * * `manual`：仅能通过编程方式打开和关闭下拉组件，不能再指定其他触发方式
     */
    trigger: /*点击触发*/ 'click' | /*鼠标悬浮触发*/ 'hover' | /*聚焦触发*/ 'focus' | /*鼠标右键点击、或触摸长按触发*/ 'contextmenu' | /*仅能通过编程方式打开和关闭下拉组件，不能再指定其他触发方式*/ 'manual' | string;
    /**
     * 下拉组件内容的位置。可选值包括：
     *
     * * `auto`：自动判断位置
     * * `top-start`：上方左对齐
     * * `top`：上方居中
     * * `top-end`：上方右对齐
     * * `bottom-start`：下方左对齐
     * * `bottom`：下方居中
     * * `bottom-end`：下方右对齐
     * * `left-start`：左侧顶部对齐
     * * `left`：左侧居中
     * * `left-end`：左侧底部对齐
     * * `right-start`：右侧顶部对齐
     * * `right`：右侧居中
     * * `right-end`：右侧底部对齐
     */
    placement: /*自动判断位置*/ 'auto' | /*上方左对齐*/ 'top-start' | /*上方居中*/ 'top' | /*上方右对齐*/ 'top-end' | /*下方左对齐*/ 'bottom-start' | /*下方居中*/ 'bottom' | /*下方右对齐*/ 'bottom-end' | /*左侧顶部对齐*/ 'left-start' | /*左侧居中*/ 'left' | /*左侧底部对齐*/ 'left-end' | /*右侧顶部对齐*/ 'right-start' | /*右侧居中*/ 'right' | /*右侧底部对齐*/ 'right-end';
    /**
     * 点击 [`<mdui-menu-item>`](/docs/2/components/menu#menu-item-api) 后，下拉组件是否保持打开状态
     */
    stayOpenOnClick: boolean;
    /**
     * 鼠标悬浮触发下拉组件打开的延时，单位为毫秒
     */
    openDelay: number;
    /**
     * 鼠标悬浮触发下拉组件关闭的延时，单位为毫秒
     */
    closeDelay: number;
    /**
     * 是否在触发下拉组件的光标位置打开下拉组件，常用于打开鼠标右键菜单
     */
    openOnPointer: boolean;
    private readonly triggerElements;
    private readonly panelElements;
    private pointerOffsetX;
    private pointerOffsetY;
    private animateDirection;
    private openTimeout;
    private closeTimeout;
    private observeResize?;
    private overflowAncestors?;
    private readonly panelRef;
    private readonly definedController;
    constructor();
    private get triggerElement();
    private onPositionChange;
    private onOpenChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    /**
     * 获取 dropdown 打开、关闭动画的 CSS scaleX 或 scaleY
     */
    private getCssScaleName;
    /**
     * 在 document 上点击时，根据条件判断是否要关闭 dropdown
     */
    private onDocumentClick;
    /**
     * 在 document 上按下按键时，根据条件判断是否要关闭 dropdown
     */
    private onDocumentKeydown;
    private onWindowScroll;
    private hasTrigger;
    private onFocus;
    private onClick;
    private onPanelClick;
    private onContextMenu;
    private onMouseEnter;
    private onMouseLeave;
    private updatePositioner;
}
export interface DropdownEventMap {
    open: CustomEvent<void>;
    opened: CustomEvent<void>;
    close: CustomEvent<void>;
    closed: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-dropdown': Dropdown;
    }
}
