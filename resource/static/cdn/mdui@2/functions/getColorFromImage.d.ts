import type { JQ } from '@mdui/jq/shared/core.js';
/**
 * 根据指定的图片，提取出主色调的十六进制颜色值
 * @param image `<img>` 元素的 CSS 选择器、或 `<img>` 元素、或 JQ 对象
 * @return string 十六进制颜色值。例如：`#ff0000`
 */
export declare const getColorFromImage: (image: string | HTMLImageElement | JQ<HTMLImageElement>) => Promise<string>;
