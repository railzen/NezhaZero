import { css } from 'lit';
export const tabPanelStyle = css `:host{display:block;overflow-y:auto;flex:1 1 auto}:host(:not([active])){display:none}`;
