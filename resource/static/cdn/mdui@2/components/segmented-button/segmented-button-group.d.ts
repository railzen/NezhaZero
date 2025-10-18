import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { FormControl } from '@mdui/jq/shared/form.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary 分段按钮组件。需配合 `<mdui-segmented-button>` 组件使用
 *
 * ```html
 * <mdui-segmented-button-group>
 * ..<mdui-segmented-button>Day</mdui-segmented-button>
 * ..<mdui-segmented-button>Week</mdui-segmented-button>
 * ..<mdui-segmented-button>Month</mdui-segmented-button>
 * </mdui-segmented-button-group>
 * ```
 *
 * @event change - 选中的值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @slot - `<mdui-segmented-button>` 组件
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
export declare class SegmentedButtonGroup extends MduiElement<SegmentedButtonGroupEventMap> implements FormControl {
    static styles: CSSResultGroup;
    /**
     * 是否填满父元素宽度
     */
    fullWidth: boolean;
    /**
     * 分段按钮的可选中状态，默认为不可选中。可选值包括：
     *
     * * `single`：单选
     * * `multiple`：多选
     */
    selects?: /*单选*/ 'single' | /*多选*/ 'multiple';
    /**
     * 是否为禁用状态
     */
    disabled: boolean;
    /**
     * 提交表单时，是否必须选中
     */
    required: boolean;
    /**
     * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
     *
     * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
     */
    form?: string;
    /**
     * 提交表单时的名称，将与表单数据一起提交
     */
    name: string;
    /**
     * 当前选中的 `<mdui-segmented-button>` 的值。
     *
     * **Note**：该属性的 HTML 属性始终为字符串，且仅在 `selects="single"` 时可以通过 HTML 属性设置初始值。该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。所以，在 `selects="multiple"` 时，如果要修改该值，只能通过修改 JavaScript 属性值实现。
     */
    value: string | string[];
    /**
     * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
     */
    defaultValue: string | string[];
    private selectedKeys;
    /**
     * 是否验证未通过
     */
    private invalid;
    private isInitial;
    private readonly inputRef;
    private readonly formController;
    private readonly definedController;
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity(): ValidityState;
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage(): string;
    private get items();
    private get itemsEnabled();
    private get isSingle();
    private get isMultiple();
    private get isSelectable();
    private onSelectsChange;
    private onSelectedKeysChange;
    private onValueChange;
    private onInvalidChange;
    connectedCallback(): void;
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity(): boolean;
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
     *
     * 如果验证未通过，还会在组件上显示验证失败的提示。
     */
    reportValidity(): boolean;
    /**
     * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
     *
     * @param message 自定义的错误提示文本
     */
    setCustomValidity(message: string): void;
    protected render(): TemplateResult;
    private selectOne;
    private onClick;
    /**
     * 在隐藏的 `<input>` 或 `<select>` 上按下按键时，切换选中状态
     * 通常为验证不通过时，默认聚焦到 `<input>` 或 `<select>` 上，此时按下按键，切换第一个元素的选中状态
     */
    private onInputKeyDown;
    private onSlotChange;
    private setSelectedKeys;
    private setValue;
    private updateItems;
}
export interface SegmentedButtonGroupEventMap {
    change: CustomEvent<void>;
    invalid: CustomEvent<void>;
}
declare global {
    interface HTMLElementTagNameMap {
        'mdui-segmented-button-group': SegmentedButtonGroup;
    }
}
