import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
declare const Card_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/anchor.js").AnchorMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 卡片组件
 *
 * ```html
 * <mdui-card>card content</mdui-card>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 卡片的内容
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Card extends Card_base<CardEventMap> {
    static styles: CSSResultGroup;
    /**
     * 卡片的形状。可选值包括：
     *
     * * `elevated`：带阴影的卡片，与背景的视觉分离度较高
     * * `filled`：带填充色的卡片，与背景的视觉分离度较低
     * * `outlined`：带边框的卡片，与背景的视觉分离度最高
     */
    variant: /*带阴影的卡片，与背景的视觉分离度较高*/ 'elevated' | /*带填充色的卡片，与背景的视觉分离度较低*/ 'filled' | /*带边框的卡片，与背景的视觉分离度最高*/ 'outlined';
    /**
     * 是否可点击。为 `true` 时，卡片将具有鼠标悬浮效果和点击涟漪效果
     */
    clickable: boolean;
    /**
     * 是否禁用
     */
    disabled: boolean;
    private readonly rippleRef;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement | null;
    protected get focusDisabled(): boolean;
    protected render(): TemplateResult;
}
export interface CardEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-card': Card;
    }
}
export {};
