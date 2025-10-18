import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import '../icon.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
declare const ListItem_base: import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/anchor.js").AnchorMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("../ripple/ripple-mixin.js").RippleMixinInterface> & import("@lit/reactive-element/decorators/base.js").Constructor<import("@mdui/shared/mixins/focusable.js").FocusableMixinInterface> & typeof MduiElement;
/**
 * @summary 列表项组件。需配合 `<mdui-list>` 组件使用
 *
 * ```html
 * <mdui-list>
 * ..<mdui-list-subheader>Subheader</mdui-list-subheader>
 * ..<mdui-list-item>Item 1</mdui-list-item>
 * ..<mdui-list-item>Item 2</mdui-list-item>
 * </mdui-list>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 主文本
 * @slot description - 副文本
 * @slot icon - 列表项左侧的元素
 * @slot end-icon - 列表项右侧的元素
 * @slot custom - 任意自定义内容
 *
 * @csspart container - 列表项容器
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart body - 中间部分
 * @csspart headline - 主标题
 * @csspart description - 副标题
 *
 * @cssprop --shape-corner - 列表项的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 * @cssprop --shape-corner-rounded - 指定了 `rounded` 属性时，列表项的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class ListItem extends ListItem_base<ListItemEventMap> {
    static styles: CSSResultGroup;
    /**
     * 主文本。也可以通过 default slot 设置
     */
    headline?: string;
    /**
     * 主文本行数，超过限制后将截断显示。默认无行数限制。可选值包括：
     *
     * * `1`：显示单行，超出后截断
     * * `2`：显示两行，超出后截断
     * * `3`：显示三行，超出后截断
     */
    headlineLine?: /*显示单行，超出后截断*/ 1 | /*显示两行，超出后截断*/ 2 | /*显示三行，超出后截断*/ 3;
    /**
     * 副文本。也可以通过 `slot="description"` 设置
     */
    description?: string;
    /**
     * 副文本行数，超过限制后将截断显示。默认无行数限制。可选值包括：
     *
     * * `1`：显示单行，超出后截断
     * * `2`：显示两行，超出后截断
     * * `3`：显示三行，超出后截断
     */
    descriptionLine?: /*显示单行，超出后截断*/ 1 | /*显示两行，超出后截断*/ 2 | /*显示三行，超出后截断*/ 3;
    /**
     * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
     */
    icon?: string;
    /**
     * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
     */
    endIcon?: string;
    /**
     * 是否禁用该列表项，禁用后，列表项将变为灰色，且其中的 [`<mdui-checkbox>`](/docs/2/components/checkbox)、[`<mdui-radio>`](/docs/2/components/radio)、[`<mdui-switch>`](/docs/2/components/switch) 等也将禁用
     */
    disabled: boolean;
    /**
     * 是否激活该列表项
     */
    active: boolean;
    /**
     * 是否使列表项不可点击。设置后，列表项中的 [`<mdui-checkbox>`](/docs/2/components/checkbox)、[`<mdui-radio>`](/docs/2/components/radio)、[`<mdui-switch>`](/docs/2/components/switch) 等仍可交互
     */
    nonclickable: boolean;
    /**
     * 是否使用圆角形状的列表项
     */
    rounded: boolean;
    /**
     * 列表项的垂直对齐方式。可选值包括：
     *
     * * `start`：顶部对齐
     * * `center`：居中对齐
     * * `end`：底部对齐
     */
    alignment: /*顶部对齐*/ 'start' | /*居中对齐*/ 'center' | /*底部对齐*/ 'end';
    private readonly iconElements;
    private readonly endIconElements;
    private readonly rippleRef;
    private readonly itemRef;
    private readonly hasSlotController;
    protected get rippleElement(): Ripple;
    protected get rippleDisabled(): boolean;
    protected get focusElement(): HTMLElement;
    protected get focusDisabled(): boolean;
    protected render(): TemplateResult;
    private renderInner;
}
export interface ListItemEventMap {
    focus: FocusEvent;
    blur: FocusEvent;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-list-item': ListItem;
    }
}
export {};
