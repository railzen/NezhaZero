import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/get.js';
import type { LayoutItemBase } from './layout-item-base.js';
import type { LayoutMain } from './layout-main.js';
import type { Layout } from './layout.js';
export type LayoutPlacement = 'top' | 'left' | 'right' | 'bottom';
export declare class LayoutManager {
    private $main?;
    private states;
    private items?;
    /**
     * 注册 `<mdui-layout-main>`
     */
    registerMain(element: LayoutMain): void;
    /**
     * 取消注册 `<mdui-layout-main>`
     */
    unregisterMain(): void;
    /**
     * 注册新的 `<mdui-layout-item>`
     */
    registerItem(element: LayoutItemBase): void;
    /**
     * 取消注册 `<mdui-layout-item>`
     */
    unregisterItem(element: LayoutItemBase): void;
    /**
     * 获取所有 `<mdui-layout-item>` 元素（按在 DOM 中的顺序）
     */
    getItems(): LayoutItemBase[];
    /**
     * 获取 `<mdui-layout-main>` 元素
     */
    getMain(): LayoutMain | undefined;
    /**
     * 获取 `<mdui-layout-item>` 及 `<mdui-layout-main>` 元素
     */
    getItemsAndMain(): (LayoutItemBase | LayoutMain)[];
    /**
     * 更新 `order` 值，更新完后重新计算布局
     */
    updateOrder(): void;
    /**
     * 重新计算布局
     * @param element 从哪一个元素开始更新；若未传入参数，则将更新所有元素
     * @param size 此次更新中，元素的宽高（仅在此次更新中使用）。若不传则自动计算
     */
    updateLayout(element?: LayoutItemBase, size?: {
        width?: number;
        height?: number;
    }): void;
    /**
     * 按 order 排序，order 相同时，按在 DOM 中的顺序排序
     */
    private resort;
    /**
     * 组件宽度是否为 0
     * mdui-navigation-drawer 较为特殊，在为模态化时，占据的宽度为 0
     */
    private isNoWidth;
}
/**
 * 获取 layout 实例
 */
export declare const getLayout: (element: Layout) => LayoutManager;
