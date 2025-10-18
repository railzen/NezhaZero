import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const Tab_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
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
export declare class Tab extends Tab_base<TabEventMap> {
    static styles: CSSResultGroup;
    /**
     * 选项卡导航项的值
     */
    value?: string;
    /**
     * Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 是否把图标和文本水平排列
     */
    inline: boolean;
    /**
     * 是否为激活状态，由 `<mdui-tabs>` 组件控制该参数
     */
    protected active: boolean;
    /**
     * 选项卡形状。由 `<mdui-tabs>` 组件控制该参数
     */
    protected variant: 'primary' | 'secondary';
    protected readonly key: number;
    private readonly rippleRef;
    private readonly hasSlotController;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    protected render(): TemplateResult;
}
export interface TabEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-tab': Tab;
    }
}
export {};
