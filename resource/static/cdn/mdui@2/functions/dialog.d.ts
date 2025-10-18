import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/remove.js';
import '../components/button.js';
import { Dialog } from '../components/dialog.js';
import type { JQ } from '@mdui/jq/shared/core.js';
interface Action {
    /**
     * 按钮文本
     */
    text: string;
    /**
     * 点击按钮时的回调函数。
     * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
     * 默认点击按钮后会关闭 dialog；若返回值为 false，则不关闭 dialog；若返回值为 promise，则将在 promise 被 resolve 后，关闭 dialog。
     * @param dialog
     */
    onClick?: (dialog: Dialog) => void | boolean | Promise<void>;
}
interface Options {
    /**
     * dialog 的标题
     */
    headline?: string;
    /**
     * dialog 的描述文本
     */
    description?: string;
    /**
     * dialog 中的 body 内容，可以是 HTML 字符串、DOM 元素、或 JQ 对象
     */
    body?: string | HTMLElement | JQ<HTMLElement>;
    /**
     * dialog 顶部的 Material Icons 图标名
     */
    icon?: string;
    /**
     * 是否在按下 ESC 键时，关闭 dialog
     */
    closeOnEsc?: boolean;
    /**
     * 是否在点击遮罩层时，关闭 dialog
     */
    closeOnOverlayClick?: boolean;
    /**
     * 底部操作按钮数组
     */
    actions?: Action[];
    /**
     * 是否垂直排列底部操作按钮
     */
    stackedActions?: boolean;
    /**
     * 队列名称。
     * 默认不启用队列，在多次调用该函数时，将同时显示多个 dialog。
     * 可在该参数中传入一个队列名称，具有相同队列名称的 dialog 函数，将在上一个 dialog 关闭后才打开下一个 dialog。
     * `dialog()`、`alert()`、`confirm()`、`prompt()` 这四个函数的队列名称若相同，则也将互相共用同一个队列。
     */
    queue?: string;
    /**
     * dialog 开始打开时的回调函数。
     * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
     * @param dialog
     */
    onOpen?: (dialog: Dialog) => void;
    /**
     * dialog 打开动画完成时的回调函数。
     * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
     * @param dialog
     */
    onOpened?: (dialog: Dialog) => void;
    /**
     * dialog 开始关闭时的回调函数。
     * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
     * @param dialog
     */
    onClose?: (dialog: Dialog) => void;
    /**
     * dialog 关闭动画完成时的回调函数。
     * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
     * @param dialog
     */
    onClosed?: (dialog: Dialog) => void;
    /**
     * 点击遮罩层时的回调函数。
     * 函数参数为 dialog 实例，`this` 也指向 dialog 实例。
     * @param dialog
     */
    onOverlayClick?: (dialog: Dialog) => void;
}
/**
 * 打开一个 dialog，返回 dialog 实例
 * @param options
 */
export declare const dialog: (options: Options) => Dialog;
export {};
