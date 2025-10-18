import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { tabPanelStyle } from './tab-panel-style.js';
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
let TabPanel = class TabPanel extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否为激活状态，由 `<mdui-tabs>` 组件控制该状态
         */
        this.active = false;
    }
    render() {
        return html `<slot></slot>`;
    }
};
TabPanel.styles = [
    componentStyle,
    tabPanelStyle,
];
__decorate([
    property({ reflect: true })
], TabPanel.prototype, "value", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], TabPanel.prototype, "active", void 0);
TabPanel = __decorate([
    customElement('mdui-tab-panel')
], TabPanel);
export { TabPanel };
