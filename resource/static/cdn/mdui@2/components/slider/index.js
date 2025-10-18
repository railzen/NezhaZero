import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { FormController, formResets } from '@mdui/shared/controllers/form.js';
import { defaultValue } from '@mdui/shared/decorators/default-value.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { SliderBase } from './slider-base.js';
import { style } from './style.js';
/**
 * @summary 滑块组件
 *
 * ```html
 * <mdui-slider></mdui-slider>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event change - 在值发生变更，且失去焦点时，将触发该事件
 * @event input - 值变更时触发
 * @event invalid - 表单字段验证未通过时触发
 *
 * @csspart track-inactive - 未激活状态的轨道
 * @csspart track-active - 已激活状态的轨道
 * @csspart handle - 操作杆
 * @csspart label 提示文本
 * @csspart tickmark - 刻度标记
 */
let Slider = class Slider extends SliderBase {
    constructor() {
        super(...arguments);
        /**
         * 滑块的值，将于表单数据一起提交
         */
        this.value = 0;
        /**
         * 默认值。在重置表单时，将重置为该默认值。该属性只能通过 JavaScript 属性设置
         */
        this.defaultValue = 0;
        this.rippleRef = createRef();
        this.handleRef = createRef();
        this.formController = new FormController(this);
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    async onValueChange() {
        this.value = this.fixValue(this.value);
        // reset 引起的值变更，不执行验证；直接修改值引起的变更，需要进行验证
        const form = this.formController.getForm();
        if (form && formResets.get(form)?.has(this)) {
            this.invalid = false;
            formResets.get(form).delete(this);
        }
        else {
            await this.updateComplete;
            this.invalid = !this.inputRef.value.checkValidity();
        }
        this.updateStyle();
    }
    connectedCallback() {
        super.connectedCallback();
        this.value = this.fixValue(this.value);
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        const onTouchStart = () => {
            if (!this.disabled) {
                this.labelVisible = true;
            }
        };
        const onTouchEnd = () => {
            if (!this.disabled) {
                this.labelVisible = false;
            }
        };
        this.addEventListener('touchstart', onTouchStart);
        this.addEventListener('mousedown', onTouchStart);
        this.addEventListener('touchend', onTouchEnd);
        this.addEventListener('mouseup', onTouchEnd);
        this.updateStyle();
    }
    /**
     * <input /> 用于提供拖拽操作
     * <input class="invalid" /> 用于提供 html5 自带的表单错误提示
     */
    render() {
        return html `<label class="${classMap({ invalid: this.invalid })}"><input ${ref(this.inputRef)} type="range" step="${this.step}" min="${this.min}" max="${this.max}" ?disabled="${this.disabled}" .value="${live(this.value.toString())}" @input="${this.onInput}" @change="${this.onChange}"><div part="track-inactive" class="track-inactive"></div><div ${ref(this.trackActiveRef)} part="track-active" class="track-active"></div><div ${ref(this.handleRef)} part="handle" class="handle"><div class="elevation"></div><mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.renderLabel(this.value)}</div>${when(this.tickmarks, () => map(this.getCandidateValues(), (value) => html `<div part="tickmark" class="tickmark ${classMap({ active: value < this.value })}" style="${styleMap({
            left: `${((value - this.min) / this.max) * 100}%`,
            display: value === this.value ? 'none' : 'block',
        })}"></div>`))}</label>`;
    }
    updateStyle() {
        const percent = ((this.value - this.min) / (this.max - this.min)) * 100;
        this.trackActiveRef.value.style.width = `${percent}%`;
        this.handleRef.value.style.left = `${percent}%`;
    }
    onInput() {
        this.value = parseFloat(this.inputRef.value.value);
        this.updateStyle();
    }
};
Slider.styles = [SliderBase.styles, style];
__decorate([
    property({ type: Number })
], Slider.prototype, "value", void 0);
__decorate([
    defaultValue()
], Slider.prototype, "defaultValue", void 0);
__decorate([
    watch('value', true)
], Slider.prototype, "onValueChange", null);
Slider = __decorate([
    customElement('mdui-slider')
], Slider);
export { Slider };
