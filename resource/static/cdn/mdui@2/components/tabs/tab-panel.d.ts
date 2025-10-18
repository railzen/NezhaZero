import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 选项卡面板项组件。需配合 `<mdui-tabs>` 和 `<mdui-tab>` 组件使用
 *
 * ```html
 * <mdui-tabs value="tab-1">
 * ..<mdui-tab value="tab-1">Tab 1</mdui-tab>
 * ..<mdui-tab value="tab-2">Tab 2</mdui-tab>
 * ..<mdui-tab value="tab-3">Tab 3</mdui-tab>
 *
 * ..<mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
 * ..<mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
 * ..<mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
 * </mdui-tabs>
 * ```
 *
 * @slot - 选项卡面板项内容
 */
export declare class TabPanel extends MduiElement<TabPanelEventMap> {
    static styles: CSSResultGroup;
    /**
     * 选项卡面板项的值
     */
    value?: string;
    /**
     * 是否为激活状态，由 `<mdui-tabs>` 组件控制该状态
     */
    protected active: boolean;
    protected render(): TemplateResult;
}
export interface TabPanelEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-tab-panel': TabPanel;
    }
}
