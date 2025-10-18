import '@mdui/jq/methods/is.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 折叠面板组件，需配合 `<mdui-collapse-item>` 组件使用
 *
 * ```html
 * <mdui-collapse>
 * ..<mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
 * ..<mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
 * </mdui-collapse>
 * ```
 *
 * @event change - 当前展开的折叠面板项变化时触发
 *
 * @slot - `<mdui-collapse-item>` 组件
 */
export declare class Collapse extends MduiElement<CollapseEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否启用手风琴模式
     */
    accordion: boolean;
    /**
     * 当前展开的 `<mdui-collapse-item>` 的值
     *
     * **Note**：该属性的 HTML 属性始终为字符串，只有在 `accordion` 为 `true` 时，才能设置初始值；该属性的 JavaScript 属性值在 `accordion` 为 `true` 时为字符串，在 `accordion` 为 `false` 时为字符串数组。因此，当 `accordion` 为 `false` 时，只能通过修改 JavaScript 属性值来改变此值。
     */
    value?: string | string[];
    /**
     * 是否禁用此折叠面板
     */
    disabled: boolean;
    private activeKeys;
    private readonly items;
    private isInitial;
    private definedController;
    private onActiveKeysChange;
    private onValueChange;
    protected render(): TemplateResult;
    private setActiveKeys;
    private setValue;
    private onClick;
    private onSlotChange;
    private updateItems;
}
export interface CollapseEventMap {
    change: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-collapse': Collapse;
    }
}
