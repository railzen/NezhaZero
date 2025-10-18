import isPromise from 'is-promise';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/remove.js';
import { returnTrue, toKebabCase } from '@mdui/jq/shared/helper.js';
import { dequeue, queue } from '@mdui/shared/helpers/queue.js';
import { Snackbar } from '../components/snackbar.js';
const queueName = 'mdui.functions.snackbar.';
let currentSnackbar = undefined;
/**
 * 打开一个 Snackbar
 * @param options
 */
export const snackbar = (options) => {
    const snackbar = new Snackbar();
    const $snackbar = $(snackbar);
    Object.entries(options).forEach(([key, value]) => {
        if (key === 'message') {
            snackbar.innerHTML = value;
        }
        else if ([
            'onClick',
            'onActionClick',
            'onOpen',
            'onOpened',
            'onClose',
            'onClosed',
        ].includes(key)) {
            const eventName = toKebabCase(key.slice(2));
            $snackbar.on(eventName, (e) => {
                if (e.target !== snackbar) {
                    return;
                }
                if (key === 'onActionClick') {
                    const actionClick = (options.onActionClick ?? returnTrue).call(snackbar, snackbar);
                    if (isPromise(actionClick)) {
                        snackbar.actionLoading = true;
                        actionClick
                            .then(() => {
                            snackbar.open = false;
                        })
                            .finally(() => {
                            snackbar.actionLoading = false;
                        });
                    }
                    else if (actionClick !== false) {
                        snackbar.open = false;
                    }
                }
                else {
                    value.call(snackbar, snackbar);
                }
            });
        }
        else {
            // @ts-ignore
            snackbar[key] = value;
        }
    });
    $snackbar.appendTo('body').on('closed', (e) => {
        if (e.target !== snackbar) {
            return;
        }
        $snackbar.remove();
        if (options.queue) {
            currentSnackbar = undefined;
            dequeue(queueName + options.queue);
        }
    });
    if (!options.queue) {
        setTimeout(() => {
            snackbar.open = true;
        });
    }
    else if (currentSnackbar) {
        queue(queueName + options.queue, () => {
            snackbar.open = true;
            currentSnackbar = snackbar;
        });
    }
    else {
        setTimeout(() => {
            snackbar.open = true;
        });
        currentSnackbar = snackbar;
    }
    return snackbar;
};
