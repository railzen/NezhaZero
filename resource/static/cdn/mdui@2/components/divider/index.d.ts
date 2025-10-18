import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 分割线组件
 *
 * ```html
 * <mdui-divider></mdui-divider>
 * ```
 */
export declare class Divider extends MduiElement<DividerEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否为垂直分割线
     */
    vertical: boolean;
    /**
     * 是否进行左侧缩进
     */
    inset: boolean;
    /**
     * 是否进行左右两侧缩进
     */
    middle: boolean;
    protected render(): TemplateResult;
}
export interface DividerEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-divider': Divider;
    }
}
