import { css } from 'lit';
export const collapseItemStyle = css `:host{display:flex;flex-direction:column}.header{display:block}.body{display:block;overflow:hidden;transition:height var(--mdui-motion-duration-short4) var(--mdui-motion-easing-emphasized)}.body.opened{overflow:visible}.body.active{transition-duration:var(--mdui-motion-duration-medium4)}`;
