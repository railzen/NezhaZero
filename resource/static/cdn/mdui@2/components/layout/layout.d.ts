import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 布局组件
 *
 * ```html
 * <mdui-layout>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-item></mdui-layout-item>
 * ..<mdui-layout-main></mdui-layout-main>
 * </mdui-layout>
 * ```
 *
 * @slot - 可以包含 [`<mdui-top-app-bar>`](/docs/2/components/top-app-bar)、[`<mdui-bottom-app-bar>`](/docs/2/components/bottom-app-bar)、[`<mdui-navigation-bar>`](/docs/2/components/navigation-bar)、[`<mdui-navigation-drawer>`](/docs/2/components/navigation-drawer)、[`<mdui-navigation-rail>`](/docs/2/components/navigation-rail)、`<mdui-layout-item>`、`<mdui-layout-main>` 元素
 */
export declare class Layout extends MduiElement<LayoutEventMap> {
    static styles: CSSResultGroup;
    /**
     * 设置当前布局的高度为 100%
     */
    fullHeight: boolean;
    protected render(): TemplateResult;
}
export interface LayoutEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-layout': Layout;
    }
}
