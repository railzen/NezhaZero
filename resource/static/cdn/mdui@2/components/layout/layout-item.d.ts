import { LayoutItemBase } from './layout-item-base.js';
import type { LayoutPlacement } from './helper.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 布局项组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以包含任意内容
 */
export declare class LayoutItem extends LayoutItemBase<LayoutItemEventMap> {
    static styles: CSSResultGroup;
    /**
     * 组件的位置。可选值包括：
     *
     * * `top`：上方
     * * `bottom`：下方
     * * `left`：左侧
     * * `right`：右侧
     */
    placement: /*上方*/ 'top' | /*下方*/ 'bottom' | /*左侧*/ 'left' | /*右侧*/ 'right';
    protected get layoutPlacement(): LayoutPlacement;
    private onPlacementChange;
    protected render(): TemplateResult;
}
export interface LayoutItemEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-layout-item': LayoutItem;
    }
}
