import { __decorate } from "tslib";
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/data.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/filter.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/offset.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/prependTo.js';
import '@mdui/jq/methods/remove.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { style } from './style.js';
/**
 * 处理点击时的涟漪动画；及添加 hover、focused、dragged 的背景色
 * 背景色通过在 .surface 元素上添加对应的 class 实现
 * 阴影在 ripple-mixin 中处理，通过在 :host 元素上添加 attribute 供 CSS 选择器添加样式
 */
let Ripple = class Ripple extends MduiElement {
    constructor() {
        super(...arguments);
        /**
         * 是否禁用涟漪动画
         */
        this.noRipple = false;
        this.hover = false;
        this.focused = false;
        this.dragged = false;
        this.surfaceRef = createRef();
    }
    startPress(event) {
        if (this.noRipple) {
            return;
        }
        const $surface = $(this.surfaceRef.value);
        const surfaceHeight = $surface.innerHeight();
        const surfaceWidth = $surface.innerWidth();
        // 点击位置坐标
        let touchStartX;
        let touchStartY;
        if (!event) {
            // 未传入事件对象，涟漪从中间扩散
            touchStartX = surfaceWidth / 2;
            touchStartY = surfaceHeight / 2;
        }
        else {
            // 传入了事件对象，涟漪从点击位置扩散
            const touchPosition = typeof TouchEvent !== 'undefined' &&
                event instanceof TouchEvent &&
                event.touches.length
                ? event.touches[0]
                : event;
            const offset = $surface.offset();
            // 点击位置不在 surface 内，不执行
            if (touchPosition.pageX < offset.left ||
                touchPosition.pageX > offset.left + surfaceWidth ||
                touchPosition.pageY < offset.top ||
                touchPosition.pageY > offset.top + surfaceHeight) {
                return;
            }
            touchStartX = touchPosition.pageX - offset.left;
            touchStartY = touchPosition.pageY - offset.top;
        }
        // 涟漪直径
        const diameter = Math.max(Math.pow(Math.pow(surfaceHeight, 2) + Math.pow(surfaceWidth, 2), 0.5), 48);
        // 涟漪扩散动画
        const translateX = `${-touchStartX + surfaceWidth / 2}px`;
        const translateY = `${-touchStartY + surfaceHeight / 2}px`;
        const translate = `translate3d(${translateX}, ${translateY}, 0) scale(1)`;
        // 涟漪 DOM 元素
        $('<div class="wave"></div>')
            .css({
            width: diameter,
            height: diameter,
            marginTop: -diameter / 2,
            marginLeft: -diameter / 2,
            left: touchStartX,
            top: touchStartY,
        })
            .each((_, wave) => {
            wave.style.setProperty('--mdui-comp-ripple-transition-x', translateX);
            wave.style.setProperty('--mdui-comp-ripple-transition-y', translateY);
        })
            .prependTo(this.surfaceRef.value)
            .each((_, wave) => wave.clientLeft) // 重绘
            .css('transform', translate)
            .on('animationend', function (e) {
            const event = e;
            if (event.animationName === 'mdui-comp-ripple-radius-in') {
                $(this).data('filled', true); // 扩散动画完成后，添加标记
            }
        });
    }
    endPress() {
        const $waves = $(this.surfaceRef.value)
            .children()
            .filter((_, wave) => !$(wave).data('removing'))
            .data('removing', true);
        const hideAndRemove = ($waves) => {
            $waves
                .addClass('out')
                .each((_, wave) => wave.clientLeft) // 重绘
                .on('animationend', function () {
                $(this).remove();
            });
        };
        // 扩散动画未完成，先完成扩散，再隐藏并移除
        $waves
            .filter((_, wave) => !$(wave).data('filled'))
            .on('animationend', function (e) {
            const event = e;
            if (event.animationName === 'mdui-comp-ripple-radius-in') {
                hideAndRemove($(this));
            }
        });
        // 扩散动画已完成，直接隐藏并移除
        hideAndRemove($waves.filter((_, wave) => !!$(wave).data('filled')));
    }
    startHover() {
        this.hover = true;
    }
    endHover() {
        this.hover = false;
    }
    startFocus() {
        this.focused = true;
    }
    endFocus() {
        this.focused = false;
    }
    startDrag() {
        this.dragged = true;
    }
    endDrag() {
        this.dragged = false;
    }
    render() {
        return html `<div ${ref(this.surfaceRef)} class="surface ${classMap({
            hover: this.hover,
            focused: this.focused,
            dragged: this.dragged,
        })}"></div>`;
    }
};
Ripple.styles = [componentStyle, style];
__decorate([
    property({
        type: Boolean,
        reflect: true,
        converter: booleanConverter,
        attribute: 'no-ripple',
    })
], Ripple.prototype, "noRipple", void 0);
__decorate([
    state()
], Ripple.prototype, "hover", void 0);
__decorate([
    state()
], Ripple.prototype, "focused", void 0);
__decorate([
    state()
], Ripple.prototype, "dragged", void 0);
Ripple = __decorate([
    customElement('mdui-ripple')
], Ripple);
export { Ripple };
