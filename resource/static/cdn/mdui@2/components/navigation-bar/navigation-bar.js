import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, queryAssignedElements, state, } from 'lit/decorators.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { ScrollBehaviorMixin } from '@mdui/shared/mixins/scrollBehavior.js';
import { LayoutItemBase } from '../layout/layout-item-base.js';
import { navigationBarStyle } from './navigation-bar-style.js';
/**
 * @summary 底部导航栏组件。需配合 `<mdui-navigation-bar-item>` 组件使用
 *
 * ```html
 * <mdui-navigation-bar>
 * ..<mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
 * ..<mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
 * </mdui-navigation-bar>
 * ```
 *
 * @event change - 值变化时触发
 * @event show - 开始显示时，事件被触发。可以通过调用 `event.preventDefault()` 阻止显示
 * @event shown - 显示动画完成时，事件被触发
 * @event hide - 开始隐藏时，事件被触发。可以通过调用 `event.preventDefault()` 阻止隐藏
 * @event hidden - 隐藏动画完成时，事件被触发
 *
 * @slot - `<mdui-navigation-bar-item>` 组件
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --z-index - 组件的 CSS `z-index` 值
 */
let NavigationBar = class NavigationBar extends ScrollBehaviorMixin(LayoutItemBase) {
    constructor() {
        super(...arguments);
        /**
         * 是否隐藏
         */
        this.hide = false;
        /**
         * 文本的可视状态。可选值包括：
         *
         * * `auto`：当选项小于等于3个时，始终显示文本；当选项大于3个时，仅显示选中状态的文本
         * * `selected`：仅在选中状态显示文本
         * * `labeled`：始终显示文本
         * * `unlabeled`：始终不显示文本
         */
        this.labelVisibility = 'auto';
        // 因为 navigation-bar-item 的 value 可能会重复，所以在每个 navigation-bar-item 元素上都添加了一个唯一的 key，通过 activeKey 来记录激活状态的 key
        this.activeKey = 0;
        // 是否是初始状态，初始状态不触发 change 事件，没有动画
        this.isInitial = true;
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-navigation-bar-item'],
        });
    }
    get scrollPaddingPosition() {
        return 'bottom';
    }
    get layoutPlacement() {
        return 'bottom';
    }
    async onActiveKeyChange() {
        await this.definedController.whenDefined();
        // 根据 activeKey 读取对应 navigation-bar-item 的值
        const item = this.items.find((item) => item.key === this.activeKey);
        this.value = item?.value;
        if (!this.isInitial) {
            this.emit('change');
        }
    }
    async onValueChange() {
        this.isInitial = !this.hasUpdated;
        await this.definedController.whenDefined();
        const item = this.items.find((item) => item.value === this.value);
        this.activeKey = item?.key ?? 0;
        this.updateItems();
    }
    async onLabelVisibilityChange() {
        await this.definedController.whenDefined();
        this.updateItems();
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.addEventListener('transitionend', (event) => {
            if (event.target === this) {
                this.emit(this.hide ? 'hidden' : 'shown');
            }
        });
    }
    render() {
        return html `<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot>`;
    }
    /**
     * 滚动行为
     * 当前仅支持 hide 这一个行为，所以不做行为类型判断
     */
    runScrollThreshold(isScrollingUp) {
        // 向下滚动
        if (!isScrollingUp && !this.hide) {
            const eventProceeded = this.emit('hide', { cancelable: true });
            if (eventProceeded) {
                this.hide = true;
            }
        }
        // 向上滚动
        if (isScrollingUp && this.hide) {
            const eventProceeded = this.emit('show', { cancelable: true });
            if (eventProceeded) {
                this.hide = false;
            }
        }
    }
    onClick(event) {
        // event.button 为 0 时，为鼠标左键点击。忽略鼠标中键和右键
        if (event.button) {
            return;
        }
        const target = event.target;
        const item = target.closest('mdui-navigation-bar-item');
        if (!item) {
            return;
        }
        this.activeKey = item.key;
        this.isInitial = false;
        this.updateItems();
    }
    // 更新 <mdui-navigation-bar-item> 的状态
    updateItems() {
        const items = this.items;
        // <mdui-navigation-bar-item> 的 labelVisibility 不含 auto
        const labelVisibility = this.labelVisibility === 'auto'
            ? items.length <= 3
                ? 'labeled'
                : 'selected'
            : this.labelVisibility;
        items.forEach((item) => {
            item.active = this.activeKey === item.key;
            item.labelVisibility = labelVisibility;
            item.isInitial = this.isInitial;
        });
    }
    async onSlotChange() {
        await this.definedController.whenDefined();
        this.updateItems();
    }
};
NavigationBar.styles = [
    componentStyle,
    navigationBarStyle,
];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], NavigationBar.prototype, "hide", void 0);
__decorate([
    property({ reflect: true, attribute: 'label-visibility' })
], NavigationBar.prototype, "labelVisibility", void 0);
__decorate([
    property({ reflect: true })
], NavigationBar.prototype, "value", void 0);
__decorate([
    property({ reflect: true, attribute: 'scroll-behavior' })
], NavigationBar.prototype, "scrollBehavior", void 0);
__decorate([
    state()
], NavigationBar.prototype, "activeKey", void 0);
__decorate([
    queryAssignedElements({
        selector: 'mdui-navigation-bar-item',
        flatten: true,
    })
], NavigationBar.prototype, "items", void 0);
__decorate([
    watch('activeKey', true)
], NavigationBar.prototype, "onActiveKeyChange", null);
__decorate([
    watch('value')
], NavigationBar.prototype, "onValueChange", null);
__decorate([
    watch('labelVisibility', true)
], NavigationBar.prototype, "onLabelVisibilityChange", null);
NavigationBar = __decorate([
    customElement('mdui-navigation-bar')
], NavigationBar);
export { NavigationBar };
