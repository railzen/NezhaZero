import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import '@mdui/shared/icons/check.js';
import '@mdui/shared/icons/clear.js';
import { ButtonBase } from '../button/button-base.js';
import '../icon.js';
import { style } from './style.js';
/**
 * @summary 纸片组件
 *
 * ```html
 * <mdui-chip>Chip</mdui-chip>
 * ```
 *
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 * @event invalid - 表单字段验证未通过时触发
 * @event change - 选中状态变更时触发
 * @event delete - 点击删除图标时触发
 *
 * @slot - 纸片文本
 * @slot icon - 左侧元素
 * @slot end-icon - 右侧元素
 * @slot selected-icon - 选中状态下的左侧元素
 * @slot delete-icon - 可删除时的右侧删除元素
 *
 * @csspart button - 内部的 `<button>` 或 `<a>` 元素
 * @csspart label - 纸片文本
 * @csspart icon - 左侧图标
 * @csspart end-icon - 右侧图标
 * @csspart selected-icon - 选中状态下的左侧图标
 * @csspart delete-icon - 可删除时的右侧删除图标
 * @csspart loading - 加载中状态的 `<mdui-circular-progress>` 元素
 *
 * @cssprop --shape-corner - 组件的圆角大小。可以指定一个具体的像素值；但更推荐引用[设计令牌](/docs/2/styles/design-tokens#shape-corner)
 */
let Chip = class Chip extends ButtonBase {
    constructor() {
        super();
        /**
         * 纸片的形状。可选值包括：
         *
         * * `assist`：用于显示与当前上下文相关的辅助操作，如在点餐页面提供分享、收藏等功能
         * * `filter`：用于对内容进行筛选，如在搜索结果页过滤搜索结果
         * * `input`：用于表示用户输入的信息片段，如在 Gmail 的“收件人”字段中的联系人
         * * `suggestion`：用于提供动态生成的推荐信息，以简化用户操作，如在聊天应用中预测用户可能想发送的信息
         */
        this.variant = 'assist';
        /**
         * 是否显示阴影
         */
        this.elevated = false;
        /**
         * 是否可选中
         */
        this.selectable = false;
        /**
         * 是否已选中
         */
        this.selected = false;
        /**
         * 是否可删除。为 `true` 时，纸片右侧会显示删除图标
         */
        this.deletable = false;
        this.rippleRef = createRef();
        this.hasSlotController = new HasSlotController(this, 'icon', 'selected-icon', 'end-icon');
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    get rippleElement() {
        return this.rippleRef.value;
    }
    onSelectedChange() {
        this.emit('change');
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.addEventListener('click', this.onClick);
        this.addEventListener('keydown', this.onKeyDown);
    }
    render() {
        const hasIcon = this.icon || this.hasSlotController.test('icon');
        const hasEndIcon = this.endIcon || this.hasSlotController.test('end-icon');
        const hasSelectedIcon = this.selectedIcon ||
            ['assist', 'filter'].includes(this.variant) ||
            hasIcon ||
            this.hasSlotController.test('selected-icon');
        const className = cc({
            button: true,
            'has-icon': this.loading ||
                (!this.selected && hasIcon) ||
                (this.selected && hasSelectedIcon),
            'has-end-icon': hasEndIcon,
        });
        return html `<mdui-ripple ${ref(this.rippleRef)} .noRipple="${this.noRipple}"></mdui-ripple>${this.isButton()
            ? this.renderButton({
                className,
                part: 'button',
                content: this.renderInner(),
            })
            : this.disabled || this.loading
                ? html `<span part="button" class="${className} _a">${this.renderInner()}</span>`
                : this.renderAnchor({
                    className,
                    part: 'button',
                    content: this.renderInner(),
                })}`;
    }
    onClick() {
        if (this.disabled || this.loading) {
            return;
        }
        // 点击时，切换选中状态
        if (this.selectable) {
            this.selected = !this.selected;
        }
    }
    onKeyDown(event) {
        if (this.disabled || this.loading) {
            return;
        }
        // 按下空格键时，切换选中状态
        if (this.selectable && event.key === ' ') {
            event.preventDefault();
            this.selected = !this.selected;
        }
        // 按下 Delete 或 BackSpace 键时，触发 delete 事件
        if (this.deletable && ['Delete', 'Backspace'].includes(event.key)) {
            this.emit('delete');
        }
    }
    /**
     * 点击删除按钮
     */
    onDelete(event) {
        event.stopPropagation();
        this.emit('delete');
    }
    renderIcon() {
        if (this.loading) {
            return this.renderLoading();
        }
        const icon = () => {
            return this.icon
                ? html `<mdui-icon name="${this.icon}" class="i"></mdui-icon>`
                : nothingTemplate;
        };
        const selectedIcon = () => {
            if (this.selectedIcon) {
                return html `<mdui-icon name="${this.selectedIcon}" class="i"></mdui-icon>`;
            }
            if (this.variant === 'assist' || this.variant === 'filter') {
                return html `<mdui-icon-check class="i"></mdui-icon-check>`;
            }
            return icon();
        };
        return !this.selected
            ? html `<slot name="icon" part="icon" class="icon">${icon()}</slot>`
            : html `<slot name="selected-icon" part="selected-icon" class="selected-icon">${selectedIcon()}</slot>`;
    }
    renderLabel() {
        return html `<slot part="label" class="label"></slot>`;
    }
    renderEndIcon() {
        return html `<slot name="end-icon" part="end-icon" class="end-icon">${this.endIcon
            ? html `<mdui-icon name="${this.endIcon}" class="i"></mdui-icon>`
            : nothingTemplate}</slot>`;
    }
    renderDeleteIcon() {
        if (!this.deletable) {
            return nothingTemplate;
        }
        return html `<slot name="delete-icon" part="delete-icon" class="delete-icon" @click="${this.onDelete}">${this.deleteIcon
            ? html `<mdui-icon name="${this.deleteIcon}" class="i"></mdui-icon>`
            : html `<mdui-icon-clear class="i"></mdui-icon-clear>`}</slot>`;
    }
    renderInner() {
        return [
            this.renderIcon(),
            this.renderLabel(),
            this.renderEndIcon(),
            this.renderDeleteIcon(),
        ];
    }
};
Chip.styles = [ButtonBase.styles, style];
__decorate([
    property({ reflect: true })
], Chip.prototype, "variant", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Chip.prototype, "elevated", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Chip.prototype, "selectable", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Chip.prototype, "selected", void 0);
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
    })
], Chip.prototype, "deletable", void 0);
__decorate([
    property({ reflect: true })
], Chip.prototype, "icon", void 0);
__decorate([
    property({ reflect: true, attribute: 'selected-icon' })
], Chip.prototype, "selectedIcon", void 0);
__decorate([
    property({ reflect: true, attribute: 'end-icon' })
], Chip.prototype, "endIcon", void 0);
__decorate([
    property({ reflect: true, attribute: 'delete-icon' })
], Chip.prototype, "deleteIcon", void 0);
__decorate([
    watch('selected', true)
], Chip.prototype, "onSelectedChange", null);
Chip = __decorate([
    customElement('mdui-chip')
], Chip);
export { Chip };
