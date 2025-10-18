import { __decorate } from "tslib";
import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { navigationRailItemStyle } from './navigation-rail-item-style.js';
/**
 * @summary 侧边导航项组件。需配合 `<mdui-navigation-rail>` 组件使用
 *
 * ```html
 * <mdui-navigation-rail>
 * ..<mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
 * ..<mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
 * </mdui-navigation-rail>
 * ```
 *
 * @slot - 文本内容
 * @slot icon - 图标
 * @slot active-icon - 激活状态的图标
 * @slot badge - 徽标
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @csspart container - 导航项容器
 * @csspart indicator - 指示器
 * @csspart badge - 徽标
 * @csspart icon - 图标
 * @csspart active-icon - 激活状态的图标
 * @csspart label - 文本内容
 *
 * @cssprop --shape-corner-indicator - 指示器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let NavigationRailItem = class NavigationRailItem extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
    constructor() {
        super(...arguments);
        /**
         * 是否为激活状态，由 `<mdui-navigation-rail>` 组件控制该参数
         */
        this.active = false;
        /**
         * 是否是初始状态，不显示动画。由 `<mdui-navigation-rail>` 组件控制该参数
         */
        this.isInitial = true;
        /**
         * 导航栏的位置，由 `<mdui-navigation-rail>` 组件控制该参数
         */
        this.placement = 'left';
        // 是否禁用该元素，该组件没有禁用状态
        this.disabled = false;
        // 每一个 `<mdui-navigation-rail-item>` 元素都添加一个唯一的 key
        this.key = uniqueId();
        this.rippleRef = createRef();
        this.hasSlotController = new HasSlotController(this, '[default]', 'active-icon');
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    get rippleDisabled() {
        return this.disabled;
    }
    get focusElement() {
        return this.href ? this.renderRoot?.querySelector('._a') : this;
    }
    get focusDisabled() {
        return this.disabled;
    }
    render() {
        const hasDefaultSlot = this.hasSlotController.test('[default]');
        const className = cc({
            container: true,
            'has-label': hasDefaultSlot,
            'has-active-icon': this.activeIcon || this.hasSlotController.test('active-icon'),
            initial: this.isInitial,
        });
        return html `${this.href
            ? this.renderAnchor({
                part: 'container',
                className,
                content: this.renderInner(hasDefaultSlot),
            })
            : html `<div part="container" class="${className}">${this.renderInner(hasDefaultSlot)}</div>`}<mdui-ripple .noRipple="${!this.active || this.noRipple}" ${ref(this.rippleRef)}></mdui-ripple>`;
    }
    renderInner(hasDefaultSlot) {
        return html `<div part="indicator" class="indicator"><slot name="badge" part="badge" class="${classMap({
            badge: true,
            'placement-right': this.placement === 'right',
        })}"></slot><slot name="active-icon" part="active-icon" class="active-icon">${this.activeIcon
            ? html `<mdui-icon name="${this.activeIcon}"></mdui-icon>`
            : nothingTemplate}</slot><slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot></div>${hasDefaultSlot
            ? html `<slot part="label" class="label"></slot>`
            : nothing}`;
    }
};
NavigationRailItem.styles = [
    componentStyle,
    navigationRailItemStyle,
];
__decorate([
    property({ reflect: true })
], NavigationRailItem.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'active-icon' })
], NavigationRailItem.prototype, "activeIcon", void 0);
__decorate([
    property({ reflect: true })
], NavigationRailItem.prototype, "value", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], NavigationRailItem.prototype, "active", void 0);
__decorate([
    state()
], NavigationRailItem.prototype, "isInitial", void 0);
__decorate([
    state()
], NavigationRailItem.prototype, "placement", void 0);
__decorate([
    state()
], NavigationRailItem.prototype, "disabled", void 0);
NavigationRailItem = __decorate([
    customElement('mdui-navigation-rail-item')
], NavigationRailItem);
export { NavigationRailItem };
