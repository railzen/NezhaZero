import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
import { navigationBarItemStyle } from './navigation-bar-item-style.js';
/**
 * @summary 底部导航栏项组件。需配合 `<mdui-navigation-bar>` 组件使用
 *
 * ```html
 * <mdui-navigation-bar>
 * ..<mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
 * </mdui-navigation-bar>
 * ```
 *
 * @slot - 导航项文本
 * @slot icon - 图标
 * @slot active-icon - 激活状态的图标元素
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
 * @csspart label - 导航项文本
 *
 * @cssprop --shape-corner-indicator - 指示器的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let NavigationBarItem = class NavigationBarItem extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
    constructor() {
        super(...arguments);
        /**
         * 是否是初始状态，不显示动画。由 `<mdui-navigation-bar>` 组件控制该参数
         */
        this.isInitial = true;
        /**
         * 是否为激活状态，由 `<mdui-navigation-bar>` 组件控制该参数
         */
        this.active = false;
        // 是否禁用该元素，该组件没有禁用状态
        this.disabled = false;
        // 每一个 `<navigation-bar-item>` 元素都添加一个唯一的 key
        this.key = uniqueId();
        this.rippleRef = createRef();
        this.hasSlotController = new HasSlotController(this, 'active-icon');
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
        const labelVisibilityClassName = cc({
            'label-visibility-selected': this.labelVisibility === 'selected',
            'label-visibility-labeled': this.labelVisibility === 'labeled',
            'label-visibility-unlabeled': this.labelVisibility === 'unlabeled',
            initial: this.isInitial,
        });
        const className = cc([
            {
                container: true,
                'has-active-icon': this.activeIcon || this.hasSlotController.test('active-icon'),
            },
            labelVisibilityClassName,
        ]);
        return html `<mdui-ripple .noRipple="${!this.active || this.noRipple}" class="${labelVisibilityClassName}" ${ref(this.rippleRef)}></mdui-ripple>${this.href
            ? this.renderAnchor({
                part: 'container',
                className,
                content: this.renderInner(),
            })
            : html `<div part="container" class="${className}">${this.renderInner()}</div>`}`;
    }
    renderInner() {
        return html `<div part="indicator" class="indicator"><slot name="badge" part="badge" class="badge"></slot><slot name="active-icon" part="active-icon" class="active-icon">${this.activeIcon
            ? html `<mdui-icon name="${this.activeIcon}"></mdui-icon>`
            : nothingTemplate}</slot><slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot></div><slot part="label" class="label"></slot>`;
    }
};
NavigationBarItem.styles = [
    componentStyle,
    navigationBarItemStyle,
];
__decorate([
    property({ reflect: true })
], NavigationBarItem.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'active-icon' })
], NavigationBarItem.prototype, "activeIcon", void 0);
__decorate([
    property({ reflect: true })
], NavigationBarItem.prototype, "value", void 0);
__decorate([
    state()
], NavigationBarItem.prototype, "labelVisibility", void 0);
__decorate([
    state()
], NavigationBarItem.prototype, "isInitial", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], NavigationBarItem.prototype, "active", void 0);
__decorate([
    state()
], NavigationBarItem.prototype, "disabled", void 0);
NavigationBarItem = __decorate([
    customElement('mdui-navigation-bar-item')
], NavigationBarItem);
export { NavigationBarItem };
