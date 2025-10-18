import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { listSubheaderStyle } from './list-subheader-style.js';
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
let ListSubheader = class ListSubheader extends MduiElement {
    render() {
        return html `<slot></slot>`;
    }
};
ListSubheader.styles = [
    componentStyle,
    listSubheaderStyle,
];
ListSubheader = __decorate([
    customElement('mdui-list-subheader')
], ListSubheader);
export { ListSubheader };
