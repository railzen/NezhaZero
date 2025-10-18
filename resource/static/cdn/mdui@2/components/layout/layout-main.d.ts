import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 布局主体内容组件
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
export declare class LayoutMain extends MduiElement<LayoutMainEventMap> {
    static styles: CSSResultGroup;
    private layoutManager?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult;
}
export interface LayoutMainEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-layout-main': LayoutMain;
    }
}
