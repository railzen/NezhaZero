import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/height.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { collapseItemStyle } from './collapse-item-style.js';
/**
 * @summary 折叠面板项组件，需配合 `<mdui-collapse>` 组件使用
 *
 * ```html
 * <mdui-collapse>
 * ..<mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
 * ..<mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
 * </mdui-collapse>
 * ```
 *
 * @event open - 开始打开时，事件被触发
 * @event opened - 打开动画完成时，事件被触发
 * @event close - 开始关闭时，事件被触发
 * @event closed - 关闭动画完成时，事件被触发
 *
 * @slot - 折叠面板项的正文内容
 * @slot header - 折叠面板项的头部内容
 *
 * @csspart header - 折叠面板的头部内容
 * @csspart body - 折叠面板的正文内容
 */
let CollapseItem = class CollapseItem extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否禁用此折叠面板项
         */
        this.disabled = false;
        /**
         * 是否为激活状态，由 `collapse` 组件控制该参数
         */
        this.active = false;
        this.state = 'closed';
        // 是否是初始状态，不显示动画
        this.isInitial = true;
        // 每一个 `collapse-item` 元素都添加一个唯一的 key
        this.key = uniqueId();
        this.bodyRef = createRef();
    }
    onActiveChange() {
        if (this.isInitial) {
            this.state = this.active ? 'opened' : 'closed';
            if (this.hasUpdated) {
                this.updateBodyHeight();
            }
        }
        else {
            this.state = this.active ? 'open' : 'close';
            this.emit(this.state);
            this.updateBodyHeight();
        }
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.updateBodyHeight();
    }
    render() {
        return html `<slot name="header" part="header" class="header">${this.header}</slot><slot part="body" class="body ${classMap({
            opened: this.state === 'opened',
            active: this.active,
        })}" ${ref(this.bodyRef)} @transitionend="${this.onTransitionEnd}"></slot>`;
    }
    onTransitionEnd(event) {
        if (event.target === this.bodyRef.value) {
            this.state = this.active ? 'opened' : 'closed';
            this.emit(this.state);
            this.updateBodyHeight();
        }
    }
    updateBodyHeight() {
        const scrollHeight = this.bodyRef.value.scrollHeight;
        // 如果是从 opened 状态开始关闭，则先设置高度值，并等重绘完成
        if (this.state === 'close') {
            $(this.bodyRef.value).height(scrollHeight);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.bodyRef.value.clientLeft;
        }
        $(this.bodyRef.value).height(this.state === 'opened'
            ? 'auto'
            : this.state === 'open'
                ? scrollHeight
                : 0);
    }
};
CollapseItem.styles = [
    componentStyle,
    collapseItemStyle,
];
__decorate([
    property({ reflect: true })
], CollapseItem.prototype, "value", void 0);
__decorate([
    property({ reflect: true })
], CollapseItem.prototype, "header", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], CollapseItem.prototype, "disabled", void 0);
__decorate([
    property()
], CollapseItem.prototype, "trigger", void 0);
__decorate([
    state()
], CollapseItem.prototype, "active", void 0);
__decorate([
    state()
], CollapseItem.prototype, "state", void 0);
__decorate([
    watch('active')
], CollapseItem.prototype, "onActiveChange", null);
CollapseItem = __decorate([
    customElement('mdui-collapse-item')
], CollapseItem);
export { CollapseItem };
