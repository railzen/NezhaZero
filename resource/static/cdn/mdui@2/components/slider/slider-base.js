import { __decorate } from "tslib";
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { sliderBaseStyle } from './slider-base-style.js';
export class SliderBase extends RippleMixin(FocusableMixin(MduiElement)) {
    constructor() {
        super(...arguments);
        /**
         * 滑块的最小值，默认为 `0`
         */
        this.min = 0;
        /**
         * 滑块的最大值，默认为 `100`
         */
        this.max = 100;
        /**
         * 步进间隔，默认为 `1`
         */
        this.step = 1;
        /**
         * 是否添加刻度标记
         */
        this.tickmarks = false;
        /**
         * 是否隐藏文本提示
         */
        this.nolabel = false;
        /**
         * 是否被禁用
         */
        this.disabled = false;
        /**
         * 滑块的名称，该名称将与表单数据一起提交
         */
        this.name = '';
        /**
         * 是否验证未通过
         *
         * 该验证为根据是否通过 `setCustomValidity` 方法设置了值，来判断是否验证通过
         */
        this.invalid = false;
        // 按下时，label 可见
        this.labelVisible = false;
        this.inputRef = createRef();
        this.trackActiveRef = createRef();
        /**
         * 用于自定义标签的显示格式的函数。函数参数为滑块的当前值，返回值为期望显示的文本。
         */
        this.labelFormatter = (value) => value.toString();
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
    get rippleDisabled() {
        return this.disabled;
    }
    get focusElement() {
        return this.inputRef.value;
    }
    get focusDisabled() {
        return this.disabled;
    }
    onDisabledChange() {
        this.invalid = !this.inputRef.value.checkValidity();
    }
    /**
     * 检查表单字段是否通过验证。如果未通过，返回 `false` 并触发 `invalid` 事件；如果通过，返回 `true`
     */
    checkValidity() {
        const valid = this.inputRef.value.checkValidity();
        if (!valid) {
            // @ts-ignore
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
            // @ts-ignore
            const eventProceeded = this.emit('invalid', {
                bubbles: false,
                cancelable: true,
                composed: false,
            });
            if (!eventProceeded) {
                // 调用了 preventDefault() 时，隐藏默认的表单错误提示
                this.blur();
                this.focus();
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
    /**
     * value 不在 min、max 或 step 的限制范围内时，修正 value 的值
     */
    fixValue(value) {
        const { min, max, step } = this;
        // 确保 value 在 min 和 max 范围内
        value = Math.min(Math.max(value, min), max);
        // 计算最接近 value 的 step 值
        const steps = Math.round((value - min) / step);
        let fixedValue = min + steps * step;
        // 如果修正后的值超出最大值，则减去一个 step
        if (fixedValue > max) {
            fixedValue -= step;
        }
        return fixedValue;
    }
    /**
     * 获取候选值组成的数组
     */
    getCandidateValues() {
        return Array.from({ length: this.max - this.min + 1 }, (_, index) => index + this.min).filter((value) => !((value - this.min) % this.step));
    }
    /**
     * 渲染浮动标签
     */
    renderLabel(value) {
        return when(!this.nolabel, () => html `<div part="label" class="label ${classMap({ 'label-visible': this.labelVisible })}">${this.labelFormatter(value)}</div>`);
    }
    onChange() {
        // @ts-ignore
        this.emit('change');
    }
}
SliderBase.styles = [
    componentStyle,
    sliderBaseStyle,
];
__decorate([
    property({ type: Number, reflect: true })
], SliderBase.prototype, "min", void 0);
__decorate([
    property({ type: Number, reflect: true })
], SliderBase.prototype, "max", void 0);
__decorate([
    property({ type: Number, reflect: true })
], SliderBase.prototype, "step", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], SliderBase.prototype, "tickmarks", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], SliderBase.prototype, "nolabel", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], SliderBase.prototype, "disabled", void 0);
__decorate([
    property({ reflect: true })
], SliderBase.prototype, "form", void 0);
__decorate([
    property({ reflect: true })
], SliderBase.prototype, "name", void 0);
__decorate([
    state()
], SliderBase.prototype, "invalid", void 0);
__decorate([
    state()
], SliderBase.prototype, "labelVisible", void 0);
__decorate([
    property({ attribute: false })
], SliderBase.prototype, "labelFormatter", void 0);
__decorate([
    watch('disabled', true)
], SliderBase.prototype, "onDisabledChange", null);
