import '@mdui/jq/methods/index.js';
import './index.js';
import type { Ripple } from './index.js';
import type { Constructor } from '@lit/reactive-element/decorators/base.js';
import type { LitElement } from 'lit';
export declare class RippleMixinInterface {
    noRipple: boolean;
    protected getRippleIndex: () => number | undefined;
    protected get rippleElement(): Ripple | Ripple[] | NodeListOf<Ripple>;
    protected get rippleDisabled(): boolean | boolean[];
    protected get rippleTarget(): HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>;
    protected startHover(event: PointerEvent): void;
    protected endHover(event: PointerEvent): void;
}
/**
 * hover, pressed, dragged 三个属性用于添加到 rippleTarget 属性指定的元素上，供 CSS 选择题添加样式
 *
 * TODO: dragged 功能
 *
 * NOTE:
 * 不支持触控的屏幕上事件顺序为：pointerdown -> (8ms) -> mousedown -> pointerup -> (1ms) -> mouseup -> (1ms) -> click
 *
 * 支持触控的屏幕上事件顺序为：pointerdown -> (8ms) -> touchstart -> pointerup -> (1ms) -> touchend -> (5ms) -> mousedown -> mouseup -> click
 * pointermove 比较灵敏，有可能触发了 pointermove 但没有触发 touchmove
 *
 * 支持触摸笔的屏幕上事件顺序为：todo
 */
export declare const RippleMixin: <T extends Constructor<LitElement>>(superclass: T) => Constructor<RippleMixinInterface> & T;
