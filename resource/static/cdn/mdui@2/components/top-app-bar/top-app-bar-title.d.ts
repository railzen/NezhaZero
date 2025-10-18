import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 顶部应用栏标题组件。需配合 `<mdui-top-app-bar>` 组件使用
 *
 * ```html
 * <mdui-top-app-bar>
 * ..<mdui-button-icon icon="menu"></mdui-button-icon>
 * ..<mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
 * ..<div style="flex-grow: 1"></div>
 * ..<mdui-button-icon icon="more_vert"></mdui-button-icon>
 * </mdui-top-app-bar>
 * ```
 *
 * @slot - 顶部应用栏的标题文本
 * @slot label-large - 展开状态下的标题文本
 *
 * @csspart label 标题文本
 * @csspart label-large 展开状态下的标题文本
 */
export declare class TopAppBarTitle extends MduiElement<TopAppBarTitleEventMap> {
    static styles: CSSResultGroup;
    /**
     * 顶部应用栏形状。由 mdui-top-app-bar 组件控制该参数
     */
    private variant;
    /**
     * 是否缩小成 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效。由 mdui-top-app-bar 组件控制该参数
     */
    private shrink;
    private readonly hasSlotController;
    private readonly labelLargeRef;
    private readonly defaultSlotRef;
    protected render(): TemplateResult;
    /**
     * default slot 变化时，同步到 label-large 中
     * @param hasLabelLargeSlot
     * @private
     */
    private onSlotChange;
}
export interface TopAppBarTitleEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-top-app-bar-title': TopAppBarTitle;
    }
}
