import { msg } from '@lit/localize';
import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/first.js';
import '@mdui/jq/methods/last.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/text.js';
import { isBoolean, isString, isUndefined, returnTrue, } from '@mdui/jq/shared/helper.js';
import { TextField } from '../components/text-field.js';
import { onLocaleReady, offLocaleReady } from '../internal/localize.js';
import { dialog as openDialog } from './dialog.js';
const getConfirmText = () => {
    return msg('OK', {
        id: 'functions.prompt.confirmText',
    });
};
const getCancelText = () => {
    return msg('Cancel', {
        id: 'functions.prompt.cancelText',
    });
};
/**
 * 打开一个 prompt，返回 Promise。
 * 如果是通过点击确定按钮关闭，则返回的 promise 会被 resolve，resolve 的参数为输入框的值；
 * 如果是通过其他方式关闭，则返回的 promise 会被 reject。
 * @param options
 */
export const prompt = (options) => {
    const mergedOptions = Object.assign({}, {
        confirmText: getConfirmText(),
        cancelText: getCancelText(),
        onConfirm: returnTrue,
        onCancel: returnTrue,
        validator: returnTrue,
        textFieldOptions: {},
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
    const textField = new TextField();
    Object.entries(mergedOptions.textFieldOptions).forEach(([key, value]) => {
        // @ts-ignore
        textField[key] = value;
    });
    return new Promise((resolve, reject) => {
        let isResolve = false;
        const dialog = openDialog({
            ...Object.fromEntries(properties
                .filter((key) => !isUndefined(mergedOptions[key]))
                .map((key) => [key, mergedOptions[key]])),
            body: textField,
            actions: [
                {
                    text: mergedOptions.cancelText,
                    onClick: (dialog) => {
                        return mergedOptions.onCancel.call(dialog, textField.value, dialog);
                    },
                },
                {
                    text: mergedOptions.confirmText,
                    onClick: (dialog) => {
                        const onConfirm = () => {
                            const clickResult = mergedOptions.onConfirm.call(dialog, textField.value, dialog);
                            if (isPromise(clickResult)) {
                                clickResult.then(() => {
                                    isResolve = true;
                                });
                            }
                            else if (clickResult !== false) {
                                isResolve = true;
                            }
                            return clickResult;
                        };
                        // 原生验证
                        textField.setCustomValidity('');
                        if (!textField.reportValidity()) {
                            return false;
                        }
                        // validator 函数验证
                        const validateResult = mergedOptions.validator.call(textField, textField.value);
                        if (isBoolean(validateResult) && !validateResult) {
                            textField.setCustomValidity(' ');
                            return false;
                        }
                        if (isString(validateResult)) {
                            textField.setCustomValidity(validateResult);
                            return false;
                        }
                        if (isPromise(validateResult)) {
                            return new Promise((resolve, reject) => {
                                validateResult.then(resolve).catch((reason) => {
                                    textField.setCustomValidity(reason);
                                    reject(reason);
                                });
                            });
                        }
                        return onConfirm();
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
                    resolve(textField.value);
                }
                else {
                    reject();
                }
                offLocaleReady(dialog);
            }
        });
    });
};
