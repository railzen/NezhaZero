import { __decorate } from "tslib";
import { property } from 'lit/decorators.js';
import { isNodeName } from '@mdui/jq/shared/helper.js';
import { MduiElement } from '@mdui/shared/base/mdui-element.js';
import { watch } from '@mdui/shared/decorators/watch.js';
import { getLayout } from './helper.js';
export class LayoutItemBase extends MduiElement {
    constructor() {
        super(...arguments);
        // 父元素是否是 `mdui-layout`
        this.isParentLayout = false;
    }
    /**
     * 当前布局组件所处的位置，父类必须实现该 getter
     */
    get layoutPlacement() {
        throw new Error('Must implement placement getter!');
    }
    // order 变更时，需要重新调整布局
    onOrderChange() {
        this.layoutManager?.updateOrder();
    }
    connectedCallback() {
        super.connectedCallback();
        const parentElement = this.parentElement;
        this.isParentLayout = isNodeName(parentElement, 'mdui-layout');
        if (this.isParentLayout) {
            this.layoutManager = getLayout(parentElement);
            this.layoutManager.registerItem(this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.layoutManager) {
            this.layoutManager.unregisterItem(this);
        }
    }
}
__decorate([
    property({ type: Number, reflect: true })
], LayoutItemBase.prototype, "order", void 0);
__decorate([
    watch('order', true)
], LayoutItemBase.prototype, "onOrderChange", null);
