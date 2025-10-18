import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 列表组件。需配合 `<mdui-list-item>` 组件使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @slot - `<mdui-list-item>` 元素
 */
export declare class List extends MduiElement<ListEventMap> {
    static styles: CSSResultGroup;
    protected render(): TemplateResult;
}
export interface ListEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-list': List;
    }
}
