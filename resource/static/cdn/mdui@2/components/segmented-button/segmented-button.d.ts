import '@mdui/shared/icons/check.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 分段按钮项组件。需配合 `<mdui-segmented-button-group>` 组件使用
 *
 * ```html
 * <mdui-segmented-button-group>
 * ..<mdui-segmented-button>Day</mdui-segmented-button>
 * ..<mdui-segmented-button>Week</mdui-segmented-button>
 * ..<mdui-segmented-button>Month</mdui-segmented-button>
 * </mdui-segmented-button-group>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - 分段按钮项的文本内容
 * @slot icon - 分段按钮项的左侧图标
 * @slot selected-icon - 选中状态的左侧图标
 * @slot end-icon - 分段按钮项的右侧图标
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart icon - 左侧的图标
 * @csspart selected-icon - 选中状态的左侧图标
 * @csspart end-icon - 右侧的图标
 * @csspart label - 文本内容
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 */
export declare class SegmentedButton extends ButtonBase<SegmentedButtonEventMap> {
    static styles: CSSResultGroup;
    /**
     * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    /**
     * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
     */
    selectedIcon?: string;
    /**
     * 是否选中该分段按钮项，由 <mdui-segmented-button-group> 组件控制该参数
     */
    protected selected: boolean;
    /**
     * 是否验证未通过。由 <mdui-segmented-button-group> 控制该参数
     */
    protected invalid: boolean;
    protected groupDisabled: boolean;
    protected readonly key: number;
    private readonly rippleRef;
    private readonly hasSlotController;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusDisabled(): boolean;
    protected render(): TemplateResult;
    private isDisabled;
    private renderIcon;
    private renderLabel;
    private renderEndIcon;
    private renderInner;
}
export interface SegmentedButtonEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-segmented-button': SegmentedButton;
    }
}
