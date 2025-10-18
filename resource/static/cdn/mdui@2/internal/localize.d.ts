import { targetLocales } from './localeCodes.js';
import type { allLocales } from './localeCodes.js';
import type { LocaleModule, LocaleStatusEventDetail } from '@lit/localize';
export type LocaleTargetCode = (typeof targetLocales)[number];
export type LocaleCode = (typeof allLocales)[number];
export type LoadFunc = (locale: LocaleTargetCode) => Promise<LocaleModule>;
export type GetLocal = () => LocaleCode;
export type SetLocal = (locale: LocaleCode) => Promise<void>;
declare global {
    interface WindowEventMap {
        'mdui-localize-status': CustomEvent<LocaleStatusEventDetail>;
    }
}
export declare const uninitializedError = "You must call `loadLocale` first to set up the localized template.";
export declare let getLocale: GetLocal | undefined;
export declare let setLocale: SetLocal | undefined;
/**
 * 初始化 localization
 * @param loadFunc
 */
export declare const initializeLocalize: (loadFunc: LoadFunc) => void;
/**
 * 监听 localize ready 事件
 * @param target
 * @param callback
 */
export declare const onLocaleReady: (target: HTMLElement, callback: () => void) => void;
/**
 * 取消监听 localize ready 事件
 * @param target
 */
export declare const offLocaleReady: (target: HTMLElement) => void;
