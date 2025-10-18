import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, queryAssignedElements, } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { isNodeName, getNodeName } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { AnchorMixin } from '@mdui/shared/mixins/anchor.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { listItemStyle } from './list-item-style.js';
/**
 * @summary 列表项组件。需配合 `<mdui-list>` 组件使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 主文本
 * @slot description - 副文本
 * @slot icon - 列表项左侧的元素
 * @slot end-icon - 列表项右侧的元素
 * @slot custom - 任意自定义内容
 *
 * @csspart container - 列表项容器
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart body - 中间部分
 * @csspart headline - 主标题
 * @csspart description - 副标题
 *
 * @cssprop --shape-corner - 列表项的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-rounded - 指定了 `rounded` 属性时，列表项的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let ListItem = class ListItem extends AnchorMixin(RippleMixin(FocusableMixin(MduiElement))) {
    constructor() {
        super(...arguments);
        /**
         * 是否禁用该列表项，禁用后，列表项将变为灰色，且其中的 [`<mdui-checkbox>`](/docs/2/components/checkbox)、[`<mdui-radio>`](/docs/2/components/radio)、[`<mdui-switch>`](/docs/2/components/switch) 等也将禁用
         */
        this.disabled = false;
        /**
         * 是否激活该列表项
         */
        this.active = false;
        /**
         * 是否使列表项不可点击。设置后，列表项中的 [`<mdui-checkbox>`](/docs/2/components/checkbox)、[`<mdui-radio>`](/docs/2/components/radio)、[`<mdui-switch>`](/docs/2/components/switch) 等仍可交互
         */
        this.nonclickable = false;
        /**
         * 是否使用圆角形状的列表项
         */
        this.rounded = false;
        /**
         * 列表项的垂直对齐方式。可选值包括：
         *
         * * `start`：顶部对齐
         * * `center`：居中对齐
         * * `end`：底部对齐
         */
        this.alignment = 'center';
        this.rippleRef = createRef();
        this.itemRef = createRef();
        this.hasSlotController = new HasSlotController(this, '[default]', 'description', 'icon', 'end-icon', 'custom');
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    get rippleDisabled() {
        return this.focusDisabled;
    }
    get focusElement() {
        return this.href && !this.disabled ? this.itemRef.value : this;
    }
    get focusDisabled() {
        return this.href ? this.disabled : this.disabled || this.nonclickable;
    }
    render() {
        const preset = !this.hasSlotController.test('custom');
        const hasIcon = this.icon || this.hasSlotController.test('icon');
        const hasEndIcon = this.endIcon || this.hasSlotController.test('end-icon');
        const hasDescription = this.description || this.hasSlotController.test('description');
        const isIcon = (element) => isNodeName(element, 'mdui-icon') ||
            getNodeName(element).startsWith('mdui-icon-');
        const className = cc({
            container: true,
            preset,
            'has-icon': hasIcon,
            'has-end-icon': hasEndIcon,
            'has-description': hasDescription,
            // icon, end-icon slot 中的元素是否为 mdui-icon 或 mdui-icon-* 组件
            'is-icon': isIcon(this.iconElements[0]),
            'is-end-icon': isIcon(this.endIconElements[0]),
        });
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.href && !this.disabled
            ? this.renderAnchor({
                className,
                content: this.renderInner(),
                part: 'container',
                refDirective: ref(this.itemRef),
            })
            : html `<div part="container" class="${className}" ${ref(this.itemRef)}>${this.renderInner()}</div>`}`;
    }
    renderInner() {
        const hasDefaultSlot = this.hasSlotController.test('[default]');
        return html `<slot name="custom"><slot name="icon" part="icon" class="icon">${this.icon
            ? html `<mdui-icon name="${this.icon}"></mdui-icon>`
            : nothingTemplate}</slot><div part="body" class="body">${hasDefaultSlot
            ? html `<slot part="headline" class="headline"></slot>`
            : html `<div part="headline" class="headline">${this.headline}</div>`}<slot name="description" part="description" class="description">${this.description}</slot></div><slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon
            ? html `<mdui-icon name="${this.endIcon}"></mdui-icon>`
            : nothingTemplate}</slot></slot>`;
    }
};
ListItem.styles = [
    componentStyle,
    listItemStyle,
];
__decorate([
    property({ reflect: true })
], ListItem.prototype, "headline", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'headline-line' })
], ListItem.prototype, "headlineLine", void 0);
__decorate([
    property({ reflect: true })
], ListItem.prototype, "description", void 0);
__decorate([
    property({ type: Number, reflect: true, attribute: 'description-line' })
], ListItem.prototype, "descriptionLine", void 0);
__decorate([
    property({ reflect: true })
], ListItem.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'end-icon' })
], ListItem.prototype, "endIcon", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ListItem.prototype, "disabled", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ListItem.prototype, "active", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ListItem.prototype, "nonclickable", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], ListItem.prototype, "rounded", void 0);
__decorate([
    property({ reflect: true })
], ListItem.prototype, "alignment", void 0);
__decorate([
    queryAssignedElements({ slot: 'icon', flatten: true })
], ListItem.prototype, "iconElements", void 0);
__decorate([
    queryAssignedElements({ slot: 'end-icon', flatten: true })
], ListItem.prototype, "endIconElements", void 0);
ListItem = __decorate([
    customElement('mdui-list-item')
], ListItem);
export { ListItem };
