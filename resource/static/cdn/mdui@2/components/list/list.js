import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listStyle } from './list-style.js';
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
let List = class List extends MduiElement {
    render() {
        return html `<slot></slot>`;
    }
};
List.styles = [componentStyle, listStyle];
List = __decorate([
    customElement('mdui-list')
], List);
export { List };
