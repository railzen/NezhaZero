import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '@mdui/shared/icons/circle.js';
import '@mdui/shared/icons/radio-button-unchecked.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
declare const Radio_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 单选框组件。需配合 `<mdui-radio-group>` 组件使用
 *
 * ```html
 * <mdui-radio-group value="chinese">
 * ..<mdui-radio value="chinese">Chinese</mdui-radio>
 * ..<mdui-radio value="english">English</mdui-radio>
 * </mdui-radio-group>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 选中该单选项时触发
 *
 * @slot - 文本内容
 * @slot unchecked-icon - 未选中状态的图标
 * @slot checked-icon - 选中状态的图标
 *
 * @csspart control - 左侧图标容器
 * @csspart unchecked-icon 未选中状态的图标
 * @csspart checked-icon 选中状态的图标
 * @csspart label - 文本内容
 */
export declare class Radio extends Radio_base<RadioEventMap> {
    static styles: CSSResultGroup;
    /**
     * 当前单选项的值
     */
    value: string;
    /**
     * 是否禁用当前单选项
     */
    disabled: boolean;
    /**
     * 当前单选项是否已选中
     */
    checked: boolean;
    /**
     * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
     */
    uncheckedIcon?: string;
    /**
     * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
     */
    checkedIcon?: string;
    protected invalid: boolean;
    protected groupDisabled: boolean;
    protected focusable: boolean;
    protected isInitial: boolean;
    private readonly rippleRef;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    private onCheckedChange;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): TemplateResult;
    private isDisabled;
}
export interface RadioEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    change: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-radio': Radio;
    }
}
export {};
