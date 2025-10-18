import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/get.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { observeResize } from '@mdui/shared/helpers/observeResize.js';
export class LayoutManager {
    constructor() {
        this.states = [];
    }
    /**
     * 注册 `<mdui-layout-main>`
     */
    registerMain(element) {
        this.$main = $(element);
    }
    /**
     * 取消注册 `<mdui-layout-main>`
     */
    unregisterMain() {
        this.$main = undefined;
    }
    /**
     * 注册新的 `<mdui-layout-item>`
     */
    registerItem(element) {
        const state = { element };
        this.states.push(state);
        // 监听元素尺寸变化
        state.observeResize = observeResize(state.element, () => {
            this.updateLayout(state.element, {
                width: this.isNoWidth(state) ? 0 : undefined,
            });
        });
        this.items = undefined;
        this.resort();
        // 从头更新布局
        this.updateLayout();
    }
    /**
     * 取消注册 `<mdui-layout-item>`
     */
    unregisterItem(element) {
        const index = this.states.findIndex((item) => item.element === element);
        if (index < 0) {
            return;
        }
        // 取消监听尺寸变化
        const item = this.states[index];
        item.observeResize?.unobserve();
        this.items = undefined;
        // 移除一个元素，并从下一个元素开始更新
        this.states.splice(index, 1);
        if (this.states[index]) {
            this.updateLayout(this.states[index].element);
        }
    }
    /**
     * 获取所有 `<mdui-layout-item>` 元素（按在 DOM 中的顺序）
     */
    getItems() {
        if (!this.items) {
            const items = this.states.map((state) => state.element);
            this.items = items.sort((a, b) => {
                const position = a.compareDocumentPosition(b);
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                    return -1;
                }
                else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        return this.items;
    }
    /**
     * 获取 `<mdui-layout-main>` 元素
     */
    getMain() {
        return this.$main ? this.$main[0] : undefined;
    }
    /**
     * 获取 `<mdui-layout-item>` 及 `<mdui-layout-main>` 元素
     */
    getItemsAndMain() {
        return [...this.getItems(), this.getMain()].filter((i) => i);
    }
    /**
     * 更新 `order` 值，更新完后重新计算布局
     */
    updateOrder() {
        this.resort();
        this.updateLayout();
    }
    /**
     * 重新计算布局
     * @param element 从哪一个元素开始更新；若未传入参数，则将更新所有元素
     * @param size 此次更新中，元素的宽高（仅在此次更新中使用）。若不传则自动计算
     */
    updateLayout(element, size) {
        const state = element
            ? {
                element,
                width: size?.width,
                height: size?.height,
            }
            : undefined;
        const index = state
            ? this.states.findIndex((v) => v.element === state.element)
            : 0;
        if (index < 0) {
            return;
        }
        Object.assign(this.states[index], state);
        this.states.forEach((currState, currIndex) => {
            if (currIndex < index) {
                return;
            }
            // @ts-ignore
            const placement = currState.element.layoutPlacement;
            // 前一个元素
            const prevState = currIndex > 0 ? this.states[currIndex - 1] : undefined;
            const top = prevState?.top ?? 0;
            const right = prevState?.right ?? 0;
            const bottom = prevState?.bottom ?? 0;
            const left = prevState?.left ?? 0;
            Object.assign(currState, { top, right, bottom, left });
            switch (placement) {
                case 'top':
                case 'bottom':
                    currState[placement] +=
                        currState.height ?? currState.element.offsetHeight;
                    break;
                case 'right':
                case 'left':
                    currState[placement] +=
                        (this.isNoWidth(currState) ? 0 : currState.width) ??
                            currState.element.offsetWidth;
                    break;
            }
            currState.height = currState.width = undefined;
            $(currState.element).css({
                position: 'absolute',
                top: placement === 'bottom' ? null : top,
                right: placement === 'left' ? null : right,
                bottom: placement === 'top' ? null : bottom,
                left: placement === 'right' ? null : left,
            });
        });
        // 更新完后，设置 layout-main 的 padding
        const lastState = this.states[this.states.length - 1];
        if (this.$main) {
            this.$main.css({
                paddingTop: lastState.top,
                paddingRight: lastState.right,
                paddingBottom: lastState.bottom,
                paddingLeft: lastState.left,
            });
        }
    }
    /**
     * 按 order 排序，order 相同时，按在 DOM 中的顺序排序
     */
    resort() {
        const items = this.getItems();
        this.states.sort((a, b) => {
            const aOrder = a.element.order ?? 0;
            const bOrder = b.element.order ?? 0;
            if (aOrder > bOrder) {
                return 1;
            }
            if (aOrder < bOrder) {
                return -1;
            }
            if (items.indexOf(a.element) > items.indexOf(b.element)) {
                return 1;
            }
            if (items.indexOf(a.element) < items.indexOf(b.element)) {
                return -1;
            }
            return 0;
        });
    }
    /**
     * 组件宽度是否为 0
     * mdui-navigation-drawer 较为特殊，在为模态化时，占据的宽度为 0
     */
    isNoWidth(state) {
        return (isNodeName(state.element, 'mdui-navigation-drawer') &&
            // @ts-ignore
            state.element.isModal);
    }
}
const layoutManagerMap = new WeakMap();
/**
 * 获取 layout 实例
 */
export const getLayout = (element) => {
    if (!layoutManagerMap.has(element)) {
        layoutManagerMap.set(element, new LayoutManager());
    }
    return layoutManagerMap.get(element);
};
