import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '@mdui/shared/icons/clear.js';
import '../button-icon.js';
import '../button.js';
import '../icon.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 消息条组件
 *
 * ```html
 * <mdui-snackbar>message</mdui-snackbar>
 * ```
 *
 * @event open - Snackbar 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 Snackbar 显示
 * @event opened - Snackbar 显示动画完成时，事件被触发
 * @event close - Snackbar 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止 Snackbar 关闭
 * @event closed - Snackbar 隐藏动画完成时，事件被触发
 * @event action-click - 点击操作按钮时触发
 *
 * @slot - Snackbar 的消息文本内容
 * @slot action - 右侧的操作按钮
 * @slot close-button - 右侧的关闭按钮。必须设置 `closeable` 属性为 `true` 才会显示
 * @slot close-icon - 关闭按钮中的图标
 *
 * @csspart message - 消息文本
 * @csspart action - 操作按钮
 * @csspart close-button - 关闭按钮
 * @csspart close-icon - 关闭按钮中的图标
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class Snackbar extends MduiElement<SnackbarEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否显示 Snackbar
     */
    open: boolean;
    /**
     * Snackbar 的显示位置。默认为 `bottom`。可选值包括：
     *
     * * `top`：顶部居中
     * * `top-start`：顶部左对齐
     * * `top-end`：顶部右对齐
     * * `bottom`：底部居中
     * * `bottom-start`：底部左对齐
     * * `bottom-end`：底部右对齐
     */
    placement: /*顶部居中*/ 'top' | /*顶部左对齐*/ 'top-start' | /*顶部右对齐*/ 'top-end' | /*底部居中*/ 'bottom' | /*底部左对齐*/ 'bottom-start' | /*底部右对齐*/ 'bottom-end';
    /**
     * 操作按钮的文本。也可以通过 `slot="action"` 设置操作按钮
     */
    action?: string;
    /**
     * 操作按钮是否处于加载中状态
     */
    actionLoading: boolean;
    /**
     * 是否在右侧显示关闭按钮
     */
    closeable: boolean;
    /**
     * 关闭按钮的 Material Icons 图标名。也可以通过 `slot="close-icon"` 设置
     */
    closeIcon?: string;
    /**
     * 消息文本的最大显示行数。默认不限制。可选值包括：
     *
     * * `1`：最多显示一行
     * * `2`：最多显示两行
     */
    messageLine?: /*最多显示一行*/ 1 | /*最多显示两行*/ 2;
    /**
     * 自动关闭的延迟时间（单位：毫秒）。设置为 `0` 则不自动关闭。默认为 5000 毫秒
     */
    autoCloseDelay: number;
    /**
     * 点击或触摸 Snackbar 以外的区域时，是否关闭 Snackbar
     */
    closeOnOutsideClick: boolean;
    private mobile;
    private closeTimeout;
    private observeResize?;
    constructor();
    private onOpenChange;
    /**
     * 这两个属性变更时，需要重新排序该组件后面的 snackbar
     */
    private onStackChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult;
    /**
     * 重新排序 snackbar 堆叠
     * @param startSnackbar 从哪个 snackbar 开始重新排列，默认从第一个开始
     * @private
     */
    private reorderStack;
    /**
     * 在 document 上点击时，根据条件判断是否要关闭 snackbar
     */
    private onDocumentClick;
    private onActionClick;
    private onCloseClick;
}
export interface SnackbarEventMap {
    open: CustomEvent<void>;
    opened: CustomEvent<void>;
    close: CustomEvent<void>;
    closed: CustomEvent<void>;
    'action-click': CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-snackbar': Snackbar;
    }
}
