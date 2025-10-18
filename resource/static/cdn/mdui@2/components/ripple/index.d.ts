import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/data.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/filter.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/offset.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/prependTo.js';
import '@mdui/jq/methods/remove.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
/**
 * 处理点击时的涟漪动画；及添加 hover、focused、dragged 的背景色
 * 背景色通过在 .surface 元素上添加对应的 class 实现
 * 阴影在 ripple-mixin 中处理，通过在 :host 元素上添加 attribute 供 CSS 选择器添加样式
 */
export declare class Ripple extends MduiElement<RippleEventMap> {
    static styles: CSSResultGroup;
    /**
     * 是否禁用涟漪动画
     */
    noRipple: boolean;
    private hover;
    private focused;
    private dragged;
    private readonly surfaceRef;
    startPress(event?: Event): void;
    endPress(): void;
    startHover(): void;
    endHover(): void;
    startFocus(): void;
    endFocus(): void;
    startDrag(): void;
    endDrag(): void;
    protected render(): TemplateResult;
}
export interface RippleEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-ripple': Ripple;
    }
}
