import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 圆形进度指示器组件
 *
 * ```html
 * <mdui-circular-progress></mdui-circular-progress>
 * ```
 */
export declare class CircularProgress extends MduiElement<CircularProgressEventMap> {
    static styles: CSSResultGroup;
    /**
     * 进度指示器的最大值。默认为 `1`
     */
    max: number;
    /**
     * 进度指示器的当前值。如果未指定该值，则显示为不确定状态
     */
    value?: number;
    protected render(): TemplateResult;
    private renderDeterminate;
    private renderInDeterminate;
}
export interface CircularProgressEventMap {
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-circular-progress': CircularProgress;
    }
}
