import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 徽标组件
 *
 * ```html
 * <mdui-badge>12</mdui-badge>
 * ```
 *
 * @slot - 徽标中显示的文本
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Badge extends MduiElement<BadgeEventMap> {
    static styles: CSSResultGroup;
    /**
     * 徽标的形状。可选值包括：
     *
     * * `small`：小型徽标，不显示文本
     * * `large`：大型徽标，会显示文本
     */
    variant: /*小型徽标，不显示文本*/ 'small' | /*大型徽标，会显示文本*/ 'large';
    protected render(): TemplateResult;
}
export interface BadgeEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-badge': Badge;
    }
}
