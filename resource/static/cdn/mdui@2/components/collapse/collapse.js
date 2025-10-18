import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, queryAssignedElements, state, } from 'lit/decorators.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/is.js';
import { isElement, isUndefined } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { arraysEqualIgnoreOrder } from '@mdui/shared/helpers/array.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { collapseStyle } from './collapse-style.js';
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
let Collapse = class Collapse extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否启用手风琴模式
         */
        this.accordion = false;
        /**
         * 是否禁用此折叠面板
         */
        this.disabled = false;
        // 因为 collapse-item 的 value 可能会重复，所以在每个 collapse-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
        this.activeKeys = [];
        // 是否是初始状态，初始状态不触发 change 事件，没有动画
        this.isInitial = true;
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-collapse-item'],
        });
    }
    async onActiveKeysChange() {
        await this.definedController.whenDefined();
        // 根据 activeKeys 读取对应 collapse-item 的值
        const value = this.accordion
            ? this.items.find((item) => this.activeKeys.includes(item.key))?.value
            : this.items
                .filter((item) => this.activeKeys.includes(item.key))
                .map((item) => item.value);
        this.setValue(value);
        if (!this.isInitial) {
            this.emit('change');
        }
    }
    async onValueChange() {
        this.isInitial = !this.hasUpdated;
        await this.definedController.whenDefined();
        if (this.accordion) {
            const value = this.value;
            if (!value) {
                this.setActiveKeys([]);
            }
            else {
                const item = this.items.find((item) => item.value === value);
                this.setActiveKeys(item ? [item.key] : []);
            }
        }
        else {
            const value = this.value;
            if (!value.length) {
                this.setActiveKeys([]);
            }
            else {
                const activeKeys = this.items
                    .filter((item) => value.includes(item.value))
                    .map((item) => item.key);
                this.setActiveKeys(activeKeys);
            }
        }
        this.updateItems();
    }
    render() {
        return html `<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot>`;
    }
    setActiveKeys(activeKeys) {
        if (!arraysEqualIgnoreOrder(this.activeKeys, activeKeys)) {
            this.activeKeys = activeKeys;
        }
    }
    setValue(value) {
        if (this.accordion || isUndefined(this.value) || isUndefined(value)) {
            this.value = value;
        }
        else if (!arraysEqualIgnoreOrder(this.value, value)) {
            this.value = value;
        }
    }
    onClick(event) {
        // 全部禁用
        if (this.disabled) {
            return;
        }
        // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
        if (event.button) {
            return;
        }
        const target = event.target;
        const item = target.closest('mdui-collapse-item');
        // collapse-item 被禁用，忽略
        if (!item || item.disabled) {
            return;
        }
        const path = event.composedPath();
        // 指定了 trigger 时，点击了其他地方时，忽略
        if (item.trigger &&
            !path.find((element) => isElement(element) && $(element).is(item.trigger))) {
            return;
        }
        // header 元素，忽略点击 header 以外的元素
        if (!path.find((element) => isElement(element) && element.part.contains('header'))) {
            return;
        }
        if (this.accordion) {
            if (this.activeKeys.includes(item.key)) {
                this.setActiveKeys([]);
            }
            else {
                this.setActiveKeys([item.key]);
            }
        }
        else {
            // 直接修改 this.activeKeys 无法被 watch 监听到，需要先克隆一份 this.activeKeys
            const activeKeys = [...this.activeKeys];
            if (activeKeys.includes(item.key)) {
                activeKeys.splice(activeKeys.indexOf(item.key), 1);
            }
            else {
                activeKeys.push(item.key);
            }
            this.setActiveKeys(activeKeys);
        }
        this.isInitial = false;
        this.updateItems();
    }
    async onSlotChange() {
        await this.definedController.whenDefined();
        this.updateItems();
    }
    // 更新 <mdui-collapse-item> 的状态
    updateItems() {
        this.items.forEach((item) => {
            item.active = this.activeKeys.includes(item.key);
            item.isInitial = this.isInitial;
        });
    }
};
Collapse.styles = [
    componentStyle,
    collapseStyle,
];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Collapse.prototype, "accordion", void 0);
__decorate([
    property()
], Collapse.prototype, "value", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Collapse.prototype, "disabled", void 0);
__decorate([
    state()
], Collapse.prototype, "activeKeys", void 0);
__decorate([
    queryAssignedElements({ selector: 'mdui-collapse-item', flatten: true })
], Collapse.prototype, "items", void 0);
__decorate([
    watch('activeKeys', true)
], Collapse.prototype, "onActiveKeysChange", null);
__decorate([
    watch('value')
], Collapse.prototype, "onValueChange", null);
Collapse = __decorate([
    customElement('mdui-collapse')
], Collapse);
export { Collapse };
