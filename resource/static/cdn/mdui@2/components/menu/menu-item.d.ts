import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/width.js';
import '@mdui/jq/static/contains.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '@mdui/shared/icons/arrow-right.js';
import '@mdui/shared/icons/check.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
declare const MenuItem_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/anchor.js").AnchorMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 菜单项组件。需配合 `<mdui-menu>` 组件使用
 *
 * ```html
 * <mdui-menu>
 * ..<mdui-menu-item>Item 1</mdui-menu-item>
 * ..<mdui-menu-item>Item 2</mdui-menu-item>
 * </mdui-menu>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event submenu-open - 子菜单开始打开时，事件被触发。可以通过调用 `event.preventDefault()` 阻止子菜单打开
 * @event submenu-opened - 子菜单打开动画完成时，事件被触发
 * @event submenu-close - 子菜单开始关闭时，事件被触发。可以通过调用 `event.preventDefault()` 阻止子菜单关闭
 * @event submenu-closed - 子菜单关闭动画完成时，事件被触发
 *
 * @slot - 菜单项的文本
 * @slot icon - 菜单项左侧图标
 * @slot end-icon - 菜单项右侧图标
 * @slot end-text - 菜单右侧的文本
 * @slot selected-icon - 选中状态的图标
 * @slot submenu - 子菜单
 * @slot custom - 任意自定义内容
 *
 * @csspart container - 菜单项的容器
 * @csspart icon - 左侧的图标
 * @csspart label - 文本内容
 * @csspart end-icon - 右侧的图标
 * @csspart end-text - 右侧的文本
 * @csspart selected-icon - 选中状态的图标
 * @csspart submenu - 子菜单元素
 */
export declare class MenuItem extends MenuItem_base<MenuItemEventMap> {
    static styles: CSSResultGroup;
    /**
     * 菜单项的值
     */
    value?: string;
    /**
     * 是否禁用菜单项
     */
    disabled: boolean;
    /**
     * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     *
     * 如果左侧不需要显示图标，但需要预留一个图标的位置，可传入空字符串进行占位
     */
    icon?: string;
    /**
     * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    /**
     * 右侧的文本。也可以通过 `slot="end-text"` 设置
     */
    endText?: string;
    /**
     * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
     */
    selectedIcon?: string;
    /**
     * 是否打开子菜单
     */
    submenuOpen: boolean;
    protected selected: boolean;
    protected dense: boolean;
    protected selects?: 'single' | 'multiple';
    protected submenuTrigger?: string;
    protected submenuOpenDelay?: number;
    protected submenuCloseDelay?: number;
    protected focusable: boolean;
    protected readonly key: number;
    private submenuOpenTimeout;
    private submenuCloseTimeout;
    private readonly rippleRef;
    private readonly containerRef;
    private readonly submenuRef;
    private readonly hasSlotController;
    private readonly definedController;
    constructor();
    protected get focusDisabled(): boolean;
    protected get focusElement(): HTMLElement;
    protected get rippleDisabled(): boolean;
    protected get rippleElement(): Ripple;
    private get hasSubmenu();
    private onOpenChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    /**
     * 点击子菜单外面的区域，关闭子菜单
     */
    private onOuterClick;
    private hasTrigger;
    private onFocus;
    private onBlur;
    private onClick;
    private onKeydown;
    private onMouseEnter;
    private onMouseLeave;
    private updateSubmenuPositioner;
    private renderInner;
}
export interface MenuItemEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    'submenu-open': CustomEvent<void>;
    'submenu-opened': CustomEvent<void>;
    'submenu-close': CustomEvent<void>;
    'submenu-closed': CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-menu-item': MenuItem;
    }
}
export {};
