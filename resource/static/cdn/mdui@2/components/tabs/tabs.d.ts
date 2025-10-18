import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 选项卡组件。需配合 `<mdui-tab>` 和 `<mdui-tab-panel>` 组件使用
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
 * @event change - 选中的值变化时触发
 *
 * @slot - `<mdui-tab>` 元素
 * @slot panel - `<mdui-tab-panel>` 元素
 *
 * @csspart container - `<mdui-tab>` 元素的容器
 * @csspart indicator - 激活状态指示器
 */
export declare class Tabs extends MduiElement<TabsEventMap> {
    static styles: CSSResultGroup;
    /**
     * 选项卡形状。可选值包括：
     *
     * * `primary`：适用于位于 `<mdui-top-app-bar>` 下方，用于切换应用的主页面的场景
     * * `secondary`：适用于位于页面中，用于切换一组相关内容的场景
     */
    variant: /*适用于位于 `<mdui-top-app-bar>` 下方，用于切换应用的主页面的场景*/ 'primary' | /*适用于位于页面中，用于切换一组相关内容的场景*/ 'secondary';
    /**
     * 当前激活的 `<mdui-tab>` 的值
     */
    value?: string;
    /**
     * 选项卡位置。默认为 `top-start`。可选值包括：
     *
     * * `top-start`：位于上方，左对齐
     * * `top`：位于上方，居中对齐
     * * `top-end`：位于上方，右对齐
     * * `bottom-start`：位于下方，左对齐
     * * `bottom`：位于下方，居中对齐
     * * `bottom-end`：位于下方，右对齐
     * * `left-start`：位于左侧，顶部对齐
     * * `left`：位于左侧，居中对齐
     * * `left-end`：位于左侧，底部对齐
     * * `right-start`：位于右侧，顶部对齐
     * * `right`：位于右侧，居中对齐
     * * `right-end`：位于右侧，底部对齐
     */
    placement: /*位于上方，左对齐*/ 'top-start' | /*位于上方，居中对齐*/ 'top' | /*位于上方，右对齐*/ 'top-end' | /*位于下方，左对齐*/ 'bottom-start' | /*位于下方，居中对齐*/ 'bottom' | /*位于下方，右对齐*/ 'bottom-end' | /*位于左侧，顶部对齐*/ 'left-start' | /*位于左侧，居中对齐*/ 'left' | /*位于左侧，底部对齐*/ 'left-end' | /*位于右侧，顶部对齐*/ 'right-start' | /*位于右侧，居中对齐*/ 'right' | /*位于右侧，底部对齐*/ 'right-end';
    /**
     * 是否填满父元素宽度
     */
    fullWidth: boolean;
    private activeKey;
    private isInitial;
    private readonly tabs;
    private readonly panels;
    private activeTab?;
    private observeResize?;
    private readonly containerRef;
    private readonly indicatorRef;
    private readonly definedController;
    private onActiveKeyChange;
    private onValueChange;
    private onIndicatorChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): TemplateResult;
    private onSlotChange;
    private onClick;
    private updateActive;
    private updateIndicator;
}
export interface TabsEventMap {
    change: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-tabs': Tabs;
    }
}
