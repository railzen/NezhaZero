import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
/**
 * @summary 图标组件
 *
 * ```html
 * <mdui-icon name="search"></mdui-icon>
 * ```
 *
 * @slot - `svg` 图标的内容
 */
export declare class Icon extends MduiElement<IconEventMap> {
    static styles: CSSResultGroup;
    /**
     * Material Icons 图标名
     */
    name?: string;
    /**
     * svg 图标的路径
     */
    src?: string;
    private readonly hasSlotController;
    protected render(): TemplateResult;
}
export interface IconEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-icon': Icon;
    }
}
