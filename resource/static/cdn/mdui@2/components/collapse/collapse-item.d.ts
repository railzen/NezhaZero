import '@mdui/jq/methods/height.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { JQ } from '@mdui/jq/shared/core.js';
import type { CSSResultGroup, TemplateResult, PropertyValues } from 'lit';
/**
 * @summary 折叠面板项组件，需配合 `<mdui-collapse>` 组件使用
 *
 * ```html
 * <mdui-collapse>
 * ..<mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
 * ..<mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
 * </mdui-collapse>
 * ```
 *
 * @event open - 开始打开时，事件被触发
 * @event opened - 打开动画完成时，事件被触发
 * @event close - 开始关闭时，事件被触发
 * @event closed - 关闭动画完成时，事件被触发
 *
 * @slot - 折叠面板项的正文内容
 * @slot header - 折叠面板项的头部内容
 *
 * @csspart header - 折叠面板的头部内容
 * @csspart body - 折叠面板的正文内容
 */
export declare class CollapseItem extends MduiElement<CollapseItemEventMap> {
    static styles: CSSResultGroup;
    /**
     * 此折叠面板项的值
     */
    value?: string;
    /**
     * 此折叠面板项的头部文本
     */
    header?: string;
    /**
     * 是否禁用此折叠面板项
     */
    disabled: boolean;
    /**
     * 点击该元素时触发折叠，值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](/docs/2/functions/jq)。默认为点击整个 header 区域触发
     */
    trigger?: string | HTMLElement | JQ<HTMLElement>;
    /**
     * 是否为激活状态，由 `collapse` 组件控制该参数
     */
    protected active: boolean;
    private state;
    protected isInitial: boolean;
    protected readonly key: number;
    private readonly bodyRef;
    private onActiveChange;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private onTransitionEnd;
    private updateBodyHeight;
}
export interface CollapseItemEventMap {
    open: CustomEvent<void>;
    opened: CustomEvent<void>;
    close: CustomEvent<void>;
    closed: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-collapse-item': CollapseItem;
    }
}
