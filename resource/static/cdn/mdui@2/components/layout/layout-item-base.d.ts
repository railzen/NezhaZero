import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import type { LayoutManager, LayoutPlacement } from './helper.js';
import type { PlainObject } from '@mdui/jq/shared/helper.js';
export declare class LayoutItemBase<E = PlainObject> extends MduiElement<E> {
    /**
     * 该组件在 [`<mdui-layout>`](/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
     */
    order?: number;
    protected layoutManager?: LayoutManager;
    protected isParentLayout: boolean;
    /**
     * 当前布局组件所处的位置，父类必须实现该 getter
     */
    protected get layoutPlacement(): LayoutPlacement;
    private onOrderChange;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
