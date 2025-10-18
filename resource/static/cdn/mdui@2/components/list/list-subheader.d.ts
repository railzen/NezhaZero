import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 列表标题组件。需配合 `<mdui-list>` 组件使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @slot - 列表标题文本
 */
export declare class ListSubheader extends MduiElement<ListSubheaderEventMap> {
    static styles: CSSResultGroup;
    protected render(): TemplateResult;
}
export interface ListSubheaderEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-list-subheader': ListSubheader;
    }
}
