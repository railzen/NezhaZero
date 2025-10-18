import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/get.js';
import { isString } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { DefinedController } from '@mdui/shared/controllers/defined.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { arraysEqualIgnoreOrder } from '@mdui/shared/helpers/array.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { segmentedButtonGroupStyle } from './segmented-button-group-style.js';
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
let SegmentedButtonGroup = class SegmentedButtonGroup extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否填满父元素宽度
         */
        this.fullWidth = false;
        /**
         * 是否为禁用状态
         */
        this.disabled = false;
        /**
         * 提交表单时，是否必须选中
         */
        this.required = false;
        /**
         * 提交表单时的名称，将与表单数据一起提交
         */
        this.name = '';
        /**
         * 当前选中的 `<mdui-segmented-button>` 的值。
         *
         * **Note**：该属性的 HTML 属性始终为字符串，且仅在 `selects="single"` 时可以通过 HTML 属性设置初始值。该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。所以，在 `selects="multiple"` 时，如果要修改该值，只能通过修改 JavaScript 属性值实现。
         */
        this.value = '';
        /**
         * 默认选中的值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
         */
        this.defaultValue = '';
        // 因为 segmented-button 的 value 可能会重复，所以在每个 segmented-button 元素上都加了一个唯一的 key 属性，通过 selectedKeys 来记录选中状态的 key
        this.selectedKeys = [];
        /**
         * 是否验证未通过
         */
        this.invalid = false;
        // 是否为初始状态，初始状态不触发 change 事件
        this.isInitial = true;
        this.inputRef = createRef();
        this.formController = new FormController(this);
        this.definedController = new DefinedController(this, {
            relatedElements: ['mdui-segmented-button'],
        });
    }
    /**
     * 表单验证状态对象，具体参见 [`ValidityState`](https://developer.mozilla.org/zh-CN/docs/Web/API/ValidityState)
     */
    get validity() {
        return this.inputRef.value.validity;
    }
    /**
     * 如果表单验证未通过，此属性将包含提示信息。如果验证通过，此属性将为空字符串
     */
    get validationMessage() {
        return this.inputRef.value.validationMessage;
    }
    // 为了使 <mdui-segmented-button> 可以不是该组件的直接子元素，这里不用 @queryAssignedElements()
    get items() {
        return $(this)
            .find('mdui-segmented-button')
            .get();
    }
    // 所有的子项元素（不包含已禁用的）
    get itemsEnabled() {
        return $(this)
            .find('mdui-segmented-button:not([disabled])')
            .get();
    }
    // 是否为单选
    get isSingle() {
        return this.selects === 'single';
    }
    // 是否为多选
    get isMultiple() {
        return this.selects === 'multiple';
    }
    // 是否可选择
    get isSelectable() {
        return this.isSingle || this.isMultiple;
    }
    async onSelectsChange() {
        if (!this.isSelectable) {
            // 不可选中，清空选中值
            this.setSelectedKeys([]);
        }
        else if (this.isSingle) {
            // 单选，只保留第一个选中的值
            this.setSelectedKeys(this.selectedKeys.slice(0, 1));
        }
        await this.onSelectedKeysChange();
    }
    async onSelectedKeysChange() {
        await this.definedController.whenDefined();
        // 根据 selectedKeys 读取出对应 segmented-button 的 value
        const values = this.itemsEnabled
            .filter((item) => this.selectedKeys.includes(item.key))
            .map((item) => item.value);
        const value = this.isMultiple ? values : values[0] || '';
        this.setValue(value);
        if (!this.isInitial) {
            this.emit('change');
        }
    }
    async onValueChange() {
        this.isInitial = !this.hasUpdated;
        await this.definedController.whenDefined();
        // 根据 value 找出对应的 segmented-button，并把这些元素的 key 赋值给 selectedKeys
        if (!this.isSelectable) {
            this.updateItems();
            return;
        }
        const values = (this.isSingle
            ? [this.value]
            : // 多选时，传入的值可能是字符串（通过 attribute 属性设置）；或字符串数组（通过 property 属性设置）
                isString(this.value)
                    ? [this.value]
                    : this.value).filter((i) => i);
        if (!values.length) {
            this.setSelectedKeys([]);
        }
        else if (this.isSingle) {
            const firstItem = this.itemsEnabled.find((item) => item.value === values[0]);
            this.setSelectedKeys(firstItem ? [firstItem.key] : []);
        }
        else if (this.isMultiple) {
            this.setSelectedKeys(this.itemsEnabled
                .filter((item) => values.includes(item.value))
                .map((item) => item.key));
        }
        this.updateItems();
        // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
        if (!this.isInitial) {
            const form = this.formController.getForm();
            if (form && formResets.get(form)?.has(this)) {
                this.invalid = false;
                formResets.get(form).delete(this);
            }
            else {
                this.invalid = !this.inputRef.value.checkValidity();
            }
        }
    }
    async onInvalidChange() {
        await this.definedController.whenDefined();
        this.updateItems();
    }
    connectedCallback() {
        super.connectedCallback();
        this.value =
            this.isMultiple && isString(this.value)
                ? this.value
                    ? [this.value]
                    : []
                : this.value;
        this.defaultValue = this.selects === 'multiple' ? [] : '';
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity() {
        const valid = this.inputRef.value.checkValidity();
        if (!valid) {
            this.emit('invalid', {
                bubbles: false,
                cancelable: true,
                composed: false,
            });
        }
        return valid;
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`。
     *
     * 如果验证未通过，还会在组件上显示验证失败的提示。
     */
    reportValidity() {
        this.invalid = !this.inputRef.value.reportValidity();
        if (this.invalid) {
            const eventProceeded = this.emit('invalid', {
                bubbles: false,
                cancelable: true,
                composed: false,
            });
            if (!eventProceeded) {
                // 调用了 preventDefault() 时，隐藏默认的表单错误提示
                this.inputRef.value.blur();
                this.inputRef.value.focus();
            }
        }
        return !this.invalid;
    }
    /**
     * 设置自定义的错误提示文本。只要这个文本不为空，就表示字段未通过验证
     *
     * @param message 自定义的错误提示文本
     */
    setCustomValidity(message) {
        this.inputRef.value.setCustomValidity(message);
        this.invalid = !this.inputRef.value.checkValidity();
    }
    render() {
        return html `${when(this.isSelectable && this.isSingle, () => html `<input ${ref(this.inputRef)} type="radio" name="${ifDefined(this.name)}" value="1" .disabled="${this.disabled}" .required="${this.required}" .checked="${!!this.value}" tabindex="-1" @keydown="${this.onInputKeyDown}">`)}${when(this.isSelectable && this.isMultiple, () => html `<select ${ref(this.inputRef)} name="${ifDefined(this.name)}" .disabled="${this.disabled}" .required="${this.required}" multiple="multiple" tabindex="-1" @keydown="${this.onInputKeyDown}">${map(this.value, (value) => html `<option selected="selected" value="${value}"></option>`)}</select>`)}<slot @slotchange="${this.onSlotChange}" @click="${this.onClick}"></slot>`;
    }
    // 切换一个元素的选中状态
    selectOne(item) {
        if (this.isMultiple) {
            // 直接修改 this.selectedKeys 无法被 watch 监听到，需要先克隆一份 this.selectedKeys
            const selectedKeys = [...this.selectedKeys];
            if (selectedKeys.includes(item.key)) {
                selectedKeys.splice(selectedKeys.indexOf(item.key), 1);
            }
            else {
                selectedKeys.push(item.key);
            }
            this.setSelectedKeys(selectedKeys);
        }
        if (this.isSingle) {
            if (this.selectedKeys.includes(item.key)) {
                this.setSelectedKeys([]);
            }
            else {
                this.setSelectedKeys([item.key]);
            }
        }
        this.isInitial = false;
        this.updateItems();
    }
    async onClick(event) {
        // event.button 为 0 时，为鼠标左键点击。忽略鼠标中间和右键
        if (event.button) {
            return;
        }
        await this.definedController.whenDefined();
        const target = event.target;
        const item = target.closest('mdui-segmented-button');
        if (!item || item.disabled) {
            return;
        }
        if (this.isSelectable && item.value) {
            this.selectOne(item);
        }
    }
    /**
     * 在隐藏的 `<input>` 或 `<select>` 上按下按键时，切换选中状态
     * 通常为验证不通过时，默认聚焦到 `<input>` 或 `<select>` 上，此时按下按键，切换第一个元素的选中状态
     */
    async onInputKeyDown(event) {
        if (!['Enter', ' '].includes(event.key)) {
            return;
        }
        event.preventDefault();
        await this.definedController.whenDefined();
        if (this.isSingle) {
            const input = event.target;
            input.checked = !input.checked;
            this.selectOne(this.itemsEnabled[0]);
            this.itemsEnabled[0].focus();
        }
        if (this.isMultiple) {
            this.selectOne(this.itemsEnabled[0]);
            this.itemsEnabled[0].focus();
        }
    }
    async onSlotChange() {
        await this.definedController.whenDefined();
        this.updateItems(true);
    }
    setSelectedKeys(selectedKeys) {
        if (!arraysEqualIgnoreOrder(this.selectedKeys, selectedKeys)) {
            this.selectedKeys = selectedKeys;
        }
    }
    setValue(value) {
        if (this.isSingle) {
            this.value = value;
        }
        else if (!arraysEqualIgnoreOrder(this.value, value)) {
            this.value = value;
        }
    }
    updateItems(slotChange = false) {
        const items = this.items;
        items.forEach((item, index) => {
            item.invalid = this.invalid;
            item.groupDisabled = this.disabled;
            item.selected = this.selectedKeys.includes(item.key);
            if (slotChange) {
                item.classList.toggle('mdui-segmented-button-first', index === 0);
                item.classList.toggle('mdui-segmented-button-last', index === items.length - 1);
            }
        });
    }
};
SegmentedButtonGroup.styles = [
    componentStyle,
    segmentedButtonGroupStyle,
];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'full-width',
    })
], SegmentedButtonGroup.prototype, "fullWidth", void 0);
__decorate([
    property({ reflect: true })
    // eslint-disable-next-line prettier/prettier
], SegmentedButtonGroup.prototype, "selects", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], SegmentedButtonGroup.prototype, "disabled", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], SegmentedButtonGroup.prototype, "required", void 0);
__decorate([
    property({ reflect: true })
], SegmentedButtonGroup.prototype, "form", void 0);
__decorate([
    property({ reflect: true })
], SegmentedButtonGroup.prototype, "name", void 0);
__decorate([
    property()
], SegmentedButtonGroup.prototype, "value", void 0);
__decorate([
    defaultValue()
], SegmentedButtonGroup.prototype, "defaultValue", void 0);
__decorate([
    state()
], SegmentedButtonGroup.prototype, "selectedKeys", void 0);
__decorate([
    state()
], SegmentedButtonGroup.prototype, "invalid", void 0);
__decorate([
    watch('selects', true)
], SegmentedButtonGroup.prototype, "onSelectsChange", null);
__decorate([
    watch('selectedKeys', true)
], SegmentedButtonGroup.prototype, "onSelectedKeysChange", null);
__decorate([
    watch('value')
], SegmentedButtonGroup.prototype, "onValueChange", null);
__decorate([
    watch('invalid', true),
    watch('disabled')
], SegmentedButtonGroup.prototype, "onInvalidChange", null);
SegmentedButtonGroup = __decorate([
    customElement('mdui-segmented-button-group')
], SegmentedButtonGroup);
export { SegmentedButtonGroup };
