import { configureLocalization, LOCALE_STATUS_EVENT } from '@lit/localize';
import { getWindow } from 'ssr-window';
import { sourceLocale, targetLocales } from './localeCodes.js';
export const uninitializedError = 'You must call `loadLocale` first to set up the localized template.';
export let getLocale;
export let setLocale;
/**
 * 初始化 localization
 * @param loadFunc
 */
export const initializeLocalize = (loadFunc) => {
    const window = getWindow();
    const result = configureLocalization({
        sourceLocale,
        targetLocales,
        loadLocale: loadFunc,
    });
    getLocale = result.getLocale;
    setLocale = result.setLocale;
    window.addEventListener(LOCALE_STATUS_EVENT, (event) => {
        window.dispatchEvent(new CustomEvent('mdui-localize-status', {
            detail: event.detail,
        }));
    });
};
let listeningLitLocalizeStatus = false;
const localeReadyCallbacksMap = new Map();
/**
 * 监听 localize ready 事件
 * @param target
 * @param callback
 */
export const onLocaleReady = (target, callback) => {
    if (!listeningLitLocalizeStatus) {
        listeningLitLocalizeStatus = true;
        const window = getWindow();
        window.addEventListener(LOCALE_STATUS_EVENT, (event) => {
            if (event.detail.status === 'ready') {
                localeReadyCallbacksMap.forEach((callbacks) => {
                    callbacks.forEach((cb) => cb());
                });
            }
        });
    }
    const callbacks = localeReadyCallbacksMap.get(target) || [];
    callbacks.push(callback);
    localeReadyCallbacksMap.set(target, callbacks);
};
/**
 * 取消监听 localize ready 事件
 * @param target
 */
export const offLocaleReady = (target) => {
    localeReadyCallbacksMap.delete(target);
};
