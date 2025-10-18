import { msg } from '@lit/localize';
import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/first.js';
import '@mdui/jq/methods/last.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/text.js';
import { isUndefined, returnTrue } from '@mdui/jq/shared/helper.js';
import { onLocaleReady, offLocaleReady } from '../internal/localize.js';
import { dialog as openDialog } from './dialog.js';
const getConfirmText = () => {
    return msg('OK', {
        id: 'functions.confirm.confirmText',
    });
};
const getCancelText = () => {
    return msg('Cancel', {
        id: 'functions.confirm.cancelText',
    });
};
/**
 * 打开一个 confirm，返回 Promise。
 * 如果是通过点击确定按钮关闭，则返回的 promise 会被 resolve；
 * 如果是通过其他方式关闭，则返回的 promise 会被 reject。
 * @param options
 */
export const confirm = (options) => {
    const mergedOptions = Object.assign({}, {
        confirmText: getConfirmText(),
        cancelText: getCancelText(),
        onConfirm: returnTrue,
        onCancel: returnTrue,
    }, options);
    const properties = [
        'headline',
        'description',
        'icon',
        'closeOnEsc',
        'closeOnOverlayClick',
        'stackedActions',
        'queue',
        'onOpen',
        'onOpened',
        'onClose',
        'onClosed',
        'onOverlayClick',
    ];
    return new Promise((resolve, reject) => {
        let isResolve = false;
        const dialog = openDialog({
            ...Object.fromEntries(properties
                .filter((key) => !isUndefined(mergedOptions[key]))
                .map((key) => [key, mergedOptions[key]])),
            actions: [
                {
                    text: mergedOptions.cancelText,
                    onClick: (dialog) => {
                        return mergedOptions.onCancel.call(dialog, dialog);
                    },
                },
                {
                    text: mergedOptions.confirmText,
                    onClick: (dialog) => {
                        const clickResult = mergedOptions.onConfirm.call(dialog, dialog);
                        if (isPromise(clickResult)) {
                            clickResult.then(() => {
                                isResolve = true;
                            });
                        }
                        else if (clickResult !== false) {
                            isResolve = true;
                        }
                        return clickResult;
                    },
                },
            ],
        });
        // 若未传入自定义文案，则监听 locale 变化更新文案
        if (!options.confirmText) {
            onLocaleReady(dialog, () => {
                $(dialog).find('[slot="action"]').last().text(getConfirmText());
            });
        }
        if (!options.cancelText) {
            onLocaleReady(dialog, () => {
                $(dialog).find('[slot="action"]').first().text(getCancelText());
            });
        }
        $(dialog).on('close', (e) => {
            if (e.target === dialog) {
                if (isResolve) {
                    resolve();
                }
                else {
                    reject();
                }
                offLocaleReady(dialog);
            }
        });
    });
};
