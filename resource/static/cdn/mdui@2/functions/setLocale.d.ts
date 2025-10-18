import type { SetLocal } from '../internal/localize.js';
/**
 * 切换到指定的语言。返回 Promise，在新的语言包加载完成后 resolve
 * @param locale 语言代码
 */
export declare const setLocale: SetLocal;
