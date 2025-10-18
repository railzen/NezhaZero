import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { TemplateResult, CSSResultGroup } from 'lit';
/**
 * @summary 浮动操作按钮组件
 *
 * ```html
 * <mdui-fab icon="edit"></mdui-fab>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 文本
 * @slot icon - 图标
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 右侧的文本
 * @csspart icon - 左侧的图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner-small - `size="small"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-normal - `size="normal"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-large - `size="large"` 时，组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class Fab extends ButtonBase<FabEventMap> {
    static styles: CSSResultGroup;
    /**
     * FAB 的形状，此组件的不同形状之间只有颜色不一样。可选值包括：
     *
     * * `primary`：使用 Primary container 背景色
     * * `surface`：使用 Surface container high 背景色
     * * `secondary`：使用 Secondary container 背景色
     * * `tertiary`：使用 Tertiary container 背景色
     */
    variant: /*使用 Primary container 背景色*/ 'primary' | /*使用 Surface container high 背景色*/ 'surface' | /*使用 Secondary container 背景色*/ 'secondary' | /*使用 Tertiary container 背景色*/ 'tertiary';
    /**
     * FAB 的大小。可选值包括：
     * * `normal`：普通大小 FAB
     * * `small`：小型 FAB
     * * `large`：大型 FAB
     */
    size: /*普通大小 FAB*/ 'normal' | /*小型 FAB*/ 'small' | /*大型 FAB*/ 'large';
    /**
     * Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 是否为展开状态
     */
    extended: boolean;
    private readonly rippleRef;
    private readonly hasSlotController;
    private readonly definedController;
    protected get rippleElement(): Ripple;
    /**
     * extended 变更时，设置动画
     */
    private onExtendedChange;
    protected render(): TemplateResult;
    private renderLabel;
    private renderIcon;
    private renderInner;
}
export interface FabEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-fab': Fab;
    }
}
