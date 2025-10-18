import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/filter.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/prop.js';
import '@mdui/jq/methods/width.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
/**
 * @summary 工具提示组件
 *
 * ```html
 * <mdui-tooltip content="tooltip content">
 * ..<mdui-button>button</mdui-button>
 * </mdui-tooltip>
 * ```
 *
 * @event open - tooltip 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 tooltip 打开
 * @event opened - tooltip 显示动画完成时，事件被触发
 * @event close - tooltip 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 tooltip 关闭
 * @event closed - tooltip 隐藏动画完成时，事件被触发
 *
 * @slot - tooltip 触发的目标元素，只有 `default` slot 中的第一个元素会作为目标元素
 * @slot headline - tooltip 的标题，只有当 `variant="rich"` 时，此 slot 才有效
 * @slot content - tooltip 的内容，可以包含 HTML。若只包含纯文本，可以使用 `content` 属性代替
 * @slot action - tooltip 底部的按钮，只有当 `variant="rich"` 时，此 slot 才有效
 *
 * @csspart popup - tooltip 的容器
 * @csspart headline - 标题
 * @csspart content - 正文
 * @csspart action - 操作按钮
 *
 * @cssprop --shape-corner-plain - 当 variant="plain" 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-rich - 当 variant="rich" 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class Tooltip extends MduiElement<TooltipEventMap> {
    static styles: CSSResultGroup;
    /**
     * tooltip 的形状。默认为 `plain`。可选值包括：
     *
     * * `plain`：纯文本，适用于简单的单行文本
     * * `rich`：富文本，可以包含标题、正文和操作按钮
     */
    variant: /*纯文本，适用于简单的单行文本*/ 'plain' | /*富文本，可以包含标题、正文和操作按钮*/ 'rich';
    /**
     * tooltip 的位置。默认为 `auto`。可选值包括：
     *
     * * `auto`：自动判断位置。`variant="plain"` 时，优先使用 `top`；`variant="rich"` 时，优先使用 `bottom-right`
     * * `top-left`：位于左上方
     * * `top-start`：位于上方，左对齐
     * * `top`：位于上方，居中对齐
     * * `top-end`：位于上方，右对齐
     * * `top-right`：位于右上方
     * * `bottom-left`：位于左下方
     * * `bottom-start`：位于下方，左对齐
     * * `bottom`：位于下方，居中对齐
     * * `bottom-end`：位于下方，右对齐
     * * `bottom-right`：位于右下方
     * * `left-start`：位于左侧，顶部对齐
     * * `left`：位于左侧，居中对齐
     * * `left-end`：位于左侧，底部对齐
     * * `right-start`：位于右侧，顶部对齐
     * * `right`：位于右侧，居中对齐
     * * `right-end`：位于右侧，底部对齐
     */
    placement: /*自动判断位置*/ 'auto' | /*位于左上方*/ 'top-left' | /*位于上方，左对齐*/ 'top-start' | /*位于上方，居中对齐*/ 'top' | /*位于上方，右对齐*/ 'top-end' | /*位于右上方*/ 'top-right' | /*位于左下方*/ 'bottom-left' | /*位于下方，左对齐*/ 'bottom-start' | /*位于下方，居中对齐*/ 'bottom' | /*位于下方，右对齐*/ 'bottom-end' | /*位于右下方*/ 'bottom-right' | /*位于左侧，顶部对齐*/ 'left-start' | /*位于左侧，居中对齐*/ 'left' | /*位于左侧，底部对齐*/ 'left-end' | /*位于右侧，顶部对齐*/ 'right-start' | /*位于右侧，居中对齐*/ 'right' | /*位于右侧，底部对齐*/ 'right-end';
    /**
     * 鼠标悬浮触发显示的延时，单位为毫秒
     */
    openDelay: number;
    /**
     * 鼠标悬浮触发隐藏的延时，单位为毫秒
     */
    closeDelay: number;
    /**
     * tooltip 的标题。仅 `variant="rich"` 时可使用。也可以通过 `slot="headline"` 设置
     */
    headline?: string;
    /**
     * tooltip 的内容。也可以通过 `slot="content"` 设置
     */
    content?: string;
    /**
     * 触发方式，支持多个值，用空格分隔。可选值包括：
     *
     * * `click`：点击时触发
     * * `hover`：鼠标悬浮时触发
     * * `focus`：聚焦时触发
     * * `manual`：只能通过编程方式打开和关闭 tooltip，不能再指定其他触发方式
     */
    trigger: /*点击时触发*/ 'click' | /*鼠标悬浮时触发*/ 'hover' | /*聚焦时触发*/ 'focus' | /*只能通过编程方式打开和关闭 tooltip，不能再指定其他触发方式*/ 'manual' | string;
    /**
     * 是否禁用 tooltip
     */
    disabled: boolean;
    /**
     * 是否显示 tooltip
     */
    open: boolean;
    private observeResize?;
    private overflowAncestors?;
    private hoverTimeout;
    private readonly popupRef;
    private readonly hasSlotController;
    private readonly hoverController;
    private readonly definedController;
    constructor();
    /**
     * 获取第一个非 <style> 和 content slot 的子元素，作为 tooltip 的目标元素
     */
    private get target();
    private onPositionChange;
    private onOpenChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private isRich;
    /**
     * 请求关闭 tooltip。鼠标未悬浮在 tooltip 上时，直接关闭；否则等鼠标移走再关闭
     */
    private requestClose;
    private hasTrigger;
    private onFocus;
    private onBlur;
    private onClick;
    private onKeydown;
    private onMouseEnter;
    private onMouseLeave;
    /**
     * 在 document 上点击时，根据条件判断是否关闭 tooltip
     */
    private onDocumentClick;
    private onWindowScroll;
    private updatePositioner;
}
export interface TooltipEventMap {
    open: CustomEvent<void>;
    opened: CustomEvent<void>;
    close: CustomEvent<void>;
    closed: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-tooltip': Tooltip;
    }
}
