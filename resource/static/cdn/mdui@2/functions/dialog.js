import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/remove.js';
import { returnTrue, toKebabCase } from '@mdui/jq/shared/helper.js';
import { dequeue, queue } from '@mdui/shared/helpers/queue.js';
import '../components/button.js';
import { Dialog } from '../components/dialog.js';
const defaultAction = {
    onClick: returnTrue,
};
const queueName = 'mdui.functions.dialog.';
let currentDialog = undefined;
/**
 * 打开一个 dialog，返回 dialog 实例
 * @param options
 */
export const dialog = (options) => {
    const dialog = new Dialog();
    const $dialog = $(dialog);
    const properties = [
        'headline',
        'description',
        'icon',
        'closeOnEsc',
        'closeOnOverlayClick',
        'stackedActions',
    ];
    const callbacks = ['onOpen', 'onOpened', 'onClose', 'onClosed', 'onOverlayClick'];
    Object.entries(options).forEach(([key, value]) => {
        // @ts-ignore
        if (properties.includes(key)) {
            // @ts-ignore
            dialog[key] = value;
            // @ts-ignore
        }
        else if (callbacks.includes(key)) {
            const eventName = toKebabCase(key.slice(2));
            $dialog.on(eventName, (e) => {
                if (e.target === dialog) {
                    value.call(dialog, dialog);
                }
            });
        }
    });
    if (options.body) {
        $dialog.append(options.body);
    }
    if (options.actions) {
        options.actions.forEach((action) => {
            const mergedAction = Object.assign({}, defaultAction, action);
            $(`<mdui-button
        slot="action"
        variant="text"
      >${mergedAction.text}</mdui-button>`)
                .appendTo($dialog)
                .on('click', function () {
                const clickResult = mergedAction.onClick.call(dialog, dialog);
                if (isPromise(clickResult)) {
                    this.loading = true;
                    clickResult
                        .then(() => {
                        dialog.open = false;
                    })
                        .finally(() => {
                        this.loading = false;
                    });
                }
                else if (clickResult !== false) {
                    dialog.open = false;
                }
            });
        });
    }
    $dialog.appendTo('body').on('closed', (e) => {
        if (e.target !== dialog) {
            return;
        }
        $dialog.remove();
        if (options.queue) {
            currentDialog = undefined;
            dequeue(queueName + options.queue);
        }
    });
    if (!options.queue) {
        setTimeout(() => {
            dialog.open = true;
        });
    }
    else if (currentDialog) {
        queue(queueName + options.queue, () => {
            dialog.open = true;
            currentDialog = dialog;
        });
    }
    else {
        setTimeout(() => {
            dialog.open = true;
        });
        currentDialog = dialog;
    }
    return dialog;
};
