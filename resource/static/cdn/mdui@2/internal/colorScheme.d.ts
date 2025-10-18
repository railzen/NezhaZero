import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/remove.js';
import '@mdui/jq/methods/removeClass.js';
import type { JQ } from '@mdui/jq/shared/core.js';
export interface CustomColor {
    /**
     * 自定义颜色名
     */
    name: string;
    /**
     * 自定义十六进制颜色值，如 `#f82506`
     */
    value: string;
}
/**
 * 移除指定元素上的配色方案
 * @param target
 */
export declare const remove: (target: string | HTMLElement | JQ<HTMLElement>) => void;
/**
 * 设置配色方案
 * 在 head 中插入一个 <style id="mdui-custom-color-scheme-${source}"> 元素，
 * 并在 target 元素上添加 class="mdui-custom-color-scheme-${source}"
 *
 * 自定义颜色的 css 变量
 * --mdui-color-red
 * --mdui-color-on-red
 * --mdui-color-red-container
 * --mdui-color-on-red-container
 *
 * @param source
 * @param options
 */
export declare const setFromSource: (source: number, options?: {
    target?: string | HTMLElement | JQ<HTMLElement>;
    customColors?: CustomColor[];
}) => void;
