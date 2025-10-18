import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { tabStyle } from './tab-style.js';
/**
 * @summary 选项卡导航项组件。需配合 `<mdui-tabs>` 和 `<mdui-tab-panel>` 组件使用
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
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 选项卡导航项的文本内容
 * @slot icon - 选项卡导航项中的图标
 * @slot badge - 徽标
 * @slot custom - 自定义整个选项卡导航项中的内容
 *
 * @csspart container - 选项卡导航项容器
 * @csspart icon - 选项卡导航项中的图标
 * @csspart label - 选项卡导航项的文本
 */
let Tab = class Tab extends RippleMixin(FocusableMixin(MduiElement)) {
    constructor() {
        super(...arguments);
        /**
         * 是否把图标和文本水平排列
         */
        this.inline = false;
        /**
         * 是否为激活状态，由 `<mdui-tabs>` 组件控制该参数
         */
        this.active = false;
        /**
         * 选项卡形状。由 `<mdui-tabs>` 组件控制该参数
         */
        this.variant = 'primary';
        // 每一个 `<mdui-tab>` 元素都添加一个唯一的 key
        this.key = uniqueId();
        this.rippleRef = createRef();
        this.hasSlotController = new HasSlotController(this, 'icon', 'custom');
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    get rippleDisabled() {
        return false;
    }
    get focusElement() {
        return this;
    }
    get focusDisabled() {
        return false;
    }
    render() {
        const hasIcon = this.icon || this.hasSlotController.test('icon');
        const hasCustomSlot = this.hasSlotController.test('custom');
        const renderBadge = () => html `<slot name="badge"></slot>`;
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple><div part="container" class="${classMap({
            container: true,
            preset: !hasCustomSlot,
            'variant-secondary': this.variant === 'secondary',
        })}"><slot name="custom"><div class="icon-container">${when(hasIcon || this.icon, renderBadge)}<slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot></div><div class="label-container">${when(!hasIcon, renderBadge)}<slot part="label" class="label"></slot></div></slot></div>`;
    }
};
Tab.styles = [componentStyle, tabStyle];
__decorate([
    property({ reflect: true })
], Tab.prototype, "value", void 0);
__decorate([
    property({ reflect: true })
], Tab.prototype, "icon", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Tab.prototype, "inline", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Tab.prototype, "active", void 0);
__decorate([
    state()
], Tab.prototype, "variant", void 0);
Tab = __decorate([
    customElement('mdui-tab')
], Tab);
export { Tab };
