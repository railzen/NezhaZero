import '@mdui/jq/methods/add.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/parent.js';
import '@mdui/jq/methods/parents.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
/**
 * 键盘快捷键：
 * * `Arrow Up` / `Arrow Down` - 使焦点在 `<mdui-menu-item>` 之间向上/向下切换
 * * `Home` / `End` - 使焦点跳转到第一个/最后一个 `<mdui-menu-item>` 元素上
 * * `Space` - 可选中时，选中/取消选中一项
 * * `Enter` - 包含子菜单时，打开子菜单；为链接时，跳转链接
 * * `Escape` - 子菜单已打开时，关闭子菜单
 *
 * @summary 菜单组件。需配合 `<mdui-menu-item>` 组件使用
 *
 * ```html
 * <mdui-menu>
 * ..<mdui-menu-item>Item 1</mdui-menu-item>
 * ..<mdui-menu-item>Item 2</mdui-menu-item>
 * </mdui-menu>
 * ```
 *
 * @event change - 菜单项选中状态变化时触发
 *
 * @slot - 子菜单项（`<mdui-menu-item>`）、分割线（[`<mdui-divider>`](/docs/2/components/divider)）等元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Menu extends MduiElement<MenuEventMap> {
    static styles: CSSResultGroup;
    /**
     * 菜单项的可选状态。默认不可选。可选值包括：
     *
     * * `single`：单选
     * * `multiple`：多选
     */
    selects?: /*单选*/ 'single' | /*多选*/ 'multiple';
    /**
     * 当前选中的 `<mdui-menu-item>` 的值。
     *
     * **Note**：该属性的 HTML 属性始终为字符串，仅在 `selects="single"` 时可通过 HTML 属性设置初始值；该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。因此，在 `selects="multiple"` 时，若要修改该值，只能通过修改 JavaScript 属性值实现。
     */
    value?: string | string[];
    /**
     * 菜单项是否使用紧凑布局
     */
    dense: boolean;
    /**
     * 子菜单的触发方式，支持多个值，用空格分隔。可选值包括：
     *
     * * `click`：点击菜单项时打开子菜单
     * * `hover`：鼠标悬浮到菜单项上时打开子菜单
     * * `focus`：聚焦到菜单项上时打开子菜单
     * * `manual`：仅能通过编程方式打开和关闭子菜单，不能再指定其他触发方式
     */
    submenuTrigger: /*点击菜单项时打开子菜单*/ 'click' | /*鼠标悬浮到菜单项上时打开子菜单*/ 'hover' | /*聚焦到菜单项上时打开子菜单*/ 'focus' | /*仅能通过编程方式打开和关闭子菜单，不能再指定其他触发方式*/ 'manual' | string;
    /**
     * 鼠标悬浮触发子菜单打开的延时，单位毫秒
     */
    submenuOpenDelay: number;
    /**
     * 鼠标悬浮触发子菜单关闭的延时，单位毫秒
     */
    submenuCloseDelay: number;
    private selectedKeys;
    private readonly childrenItems;
    private isInitial;
    private lastActiveItems;
    private readonly definedController;
    private get items();
    private get itemsEnabled();
    private get isSingle();
    private get isMultiple();
    private get isSelectable();
    private get isSubmenu();
    private get lastActiveItem();
    private set lastActiveItem(value);
    private onSlotChange;
    private onSelectsChange;
    private onSelectedKeysChange;
    private onValueChange;
    /**
     * 将焦点设置在当前元素上
     */
    focus(options?: FocusOptions): void;
    /**
     * 从当前元素中移除焦点
     */
    blur(): void;
    protected firstUpdated(changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private setSelectedKeys;
    private setValue;
    private getSiblingsItems;
    private updateFocusable;
    private updateSelected;
    private selectOne;
    private focusableOne;
    private focusOne;
    private onClick;
    private onKeyDown;
}
export interface MenuEventMap {
    change: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-menu': Menu;
    }
}
