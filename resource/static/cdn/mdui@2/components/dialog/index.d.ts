import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../icon.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * @summary 对话框组件
 *
 * ```html
 * <mdui-dialog>content</mdui-dialog>
 * ```
 *
 * @event open - 对话框开始打开时触发。可以通过调用 `event.preventDefault()` 阻止对话框打开
 * @event opened - 对话框打开动画完成后触发
 * @event close - 对话框开始关闭时触发。可以通过调用 `event.preventDefault()` 阻止对话框关闭
 * @event closed - 对话框关闭动画完成后触发
 * @event overlay-click - 点击遮罩层时触发
 *
 * @slot header - 顶部元素，默认包含 `icon` slot 和 `headline` slot
 * @slot icon - 顶部图标
 * @slot headline - 顶部标题
 * @slot description - 标题下方的文本
 * @slot - 对话框主体内容
 * @slot action - 底部操作栏中的元素
 *
 * @csspart overlay - 遮罩层
 * @csspart panel - 对话框容器
 * @csspart header - 对话框 header 部分，包含 icon 和 headline
 * @csspart icon - 顶部图标，位于 header 中
 * @csspart headline - 顶部标题，位于 header 中
 * @csspart body - 对话框 body 部分
 * @csspart description - 副文本部分，位于 body 中
 * @csspart action - 底部操作按钮
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
export declare class Dialog extends MduiElement<DialogEventMap> {
    static styles: CSSResultGroup;
    /**
     * 顶部的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 标题。也可以通过 `slot="headline"` 设置
     */
    headline?: string;
    /**
     * 标题下方的文本。也可以通过 `slot="description"` 设置
     */
    description?: string;
    /**
     * 是否打开对话框
     */
    open: boolean;
    /**
     * 是否全屏显示对话框
     */
    fullscreen: boolean;
    /**
     * 是否允许按下 ESC 键关闭对话框
     */
    closeOnEsc: boolean;
    /**
     * 是否允许点击遮罩层关闭对话框
     */
    closeOnOverlayClick: boolean;
    /**
     * 是否垂直排列底部操作按钮
     */
    stackedActions: boolean;
    /**
     * 是否可拖拽移动位置
     */
    /**
     * 是否可拖拽改变大小
     */
    /**
     * dialog 组件内包含的 mdui-top-app-bar 组件
     */
    private readonly topAppBarElements;
    private originalTrigger;
    private modalHelper;
    private readonly overlayRef;
    private readonly panelRef;
    private readonly bodyRef;
    private readonly hasSlotController;
    private readonly definedController;
    private onOpenChange;
    disconnectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private onOverlayClick;
    private renderIcon;
    private renderHeadline;
    private renderDescription;
}
export interface DialogEventMap {
    open: CustomEvent<void>;
    opened: CustomEvent<void>;
    close: CustomEvent<void>;
    closed: CustomEvent<void>;
    'overlay-click': CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-dialog': Dialog;
    }
}
