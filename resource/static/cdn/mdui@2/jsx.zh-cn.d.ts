import React from 'react';
import { JQ } from '@mdui/jq';

type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        /**
        * 头像组件
       * 
       * ```html
       * <mdui-avatar src="https://avatars githubusercontent com/u/3030330?s=40&v=4"></mdui-avatar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/avatar
        */
        'mdui-avatar': {
          /**
          * 头像图片的 URL 地址
          * @see https://www.mdui.org/zh-cn/docs/2/components/avatar#attributes-src
          */
          'src'?: string;
        /**
          * 图片如何适应容器框，与原生的 [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 属性相同。可选值包括：
         * 
         * * `contain`：保持图片原有尺寸比例，内容会被等比例缩放
         * * `cover`：保持图片原有尺寸比例，但部分内容可能被剪切
         * * `fill`：默认值，不保持图片原有尺寸比例，内容会被拉伸以填充整个容器
         * * `none`：保留图片原有尺寸，内容不会被缩放或拉伸
         * * `scale-down`：保持图片原有尺寸比例，内容尺寸与 `none` 或 `contain` 中较小的一个相同
          * @see https://www.mdui.org/zh-cn/docs/2/components/avatar#attributes-fit
          */
          'fit'?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
        /**
          * 头像的 Material Icons 图标名
          * @see https://www.mdui.org/zh-cn/docs/2/components/avatar#attributes-icon
          */
          'icon'?: string;
        /**
          * 头像的替代文本描述
          * @see https://www.mdui.org/zh-cn/docs/2/components/avatar#attributes-label
          */
          'label'?: string;
        } & HTMLElementProps;
      /**
        * 徽标组件
       * 
       * ```html
       * <mdui-badge>12</mdui-badge>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/badge
        */
        'mdui-badge': {
          /**
          * 徽标的形状。可选值包括：
         * 
         * * `small`：小型徽标，不显示文本
         * * `large`：大型徽标，会显示文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/badge#attributes-variant
          */
          'variant'?: 'small' | 'large';
        } & HTMLElementProps;
      /**
        * 底部应用栏组件
       * 
       * ```html
       * <mdui-bottom-app-bar>
       *   <mdui-button-icon icon="check_box--outlined"></mdui-button-icon>
       *   <mdui-button-icon icon="edit--outlined"></mdui-button-icon>
       *   <mdui-button-icon icon="mic_none--outlined"></mdui-button-icon>
       *   <mdui-button-icon icon="image--outlined"></mdui-button-icon>
       *   <div style="flex-grow: 1"></div>
       *   <mdui-fab icon="add"></mdui-fab>
       * </mdui-bottom-app-bar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar
        */
        'mdui-bottom-app-bar': {
          /**
          * 是否隐藏
          * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar#attributes-hide
          */
          'hide'?: boolean;
        /**
          * 是否让底部应用栏中的 [`<mdui-fab>`](https://www.mdui.org/zh-cn/docs/2/components/fab) 组件脱离应用栏。如果为 `true`，则当应用栏隐藏后，[`<mdui-fab>`](https://www.mdui.org/zh-cn/docs/2/components/fab) 仍会停留在页面上
          * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar#attributes-fab-detach
          */
          'fab-detach'?: boolean;
        /**
          * 滚动行为。可选值为：
         * 
         * * `hide`：滚动时隐藏
          * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar#attributes-scroll-behavior
          */
          'scroll-behavior'?: 'hide' | 'shrink' | 'elevate';
        /**
          * 需要监听其滚动事件的元素。值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](https://www.mdui.org/zh-cn/docs/2/functions/jq)。默认监听 `window` 的滚动事件
          * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar#attributes-scroll-target
          */
          'scroll-target'?: string | HTMLElement | JQ<HTMLElement>;
        /**
          * 在滚动多少距离之后触发滚动行为，单位为 `px`
          * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar#attributes-scroll-threshold
          */
          'scroll-threshold'?: number;
        /**
          * 该组件在 [`<mdui-layout>`](https://www.mdui.org/zh-cn/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/bottom-app-bar#attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * 图标按钮组件
       * 
       * ```html
       * <mdui-button-icon icon="search"></mdui-button-icon>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon
        */
        'mdui-button-icon': {
          /**
          * 图标按钮的形状。可选值包括：
         * 
         * * `standard`：适用于最低优先级的操作
         * * `filled`：视觉效果强烈，适用于高优先级的操作
         * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作
         * * `outlined`：适用于中等优先级的操作
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-variant
          */
          'variant'?: 'standard' | 'filled' | 'tonal' | 'outlined';
        /**
          * Material Icons 图标名。也可以通过 default slot 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-icon
          */
          'icon'?: string;
        /**
          * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * 是否可选中
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-selectable
          */
          'selectable'?: boolean;
        /**
          * 是否已被选中
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-selected
          */
          'selected'?: boolean;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 是否禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否处于加载中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-loading
          */
          'loading'?: boolean;
        /**
          * 按钮的名称，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-name
          */
          'name'?: string;
        /**
          * 按钮的初始值，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-value
          */
          'value'?: string;
        /**
          * 按钮的类型。默认类型为 `button`。可选类型包括：
         * 
         * * `submit`：点击按钮会提交表单数据到服务器
         * * `reset`：点击按钮会将表单中的所有字段重置为初始值
         * * `button`：此类型的按钮没有默认行为
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-form
          */
          'form'?: string;
        /**
          * 指定提交表单的 URL。
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-formaction
          */
          'formaction'?: string;
        /**
          * 指定提交表单到服务器的内容类型。可选值包括：
         * 
         * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
         * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
         * * `text/plain`：HTML5 新增，用于调试
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * 指定提交表单时使用的 HTTP 方法。可选值包括：
         * 
         * * `post`：表单数据包含在表单内容中，发送到服务器
         * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * 如果设置了此属性，表单提交时将不执行表单验证。
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * 提交表单后接收到的响应应显示在何处。可选值包括：
         * 
         * * `_self`：默认选项，在当前框架中打开
         * * `_blank`：在新窗口中打开
         * * `_parent`：在父框架中打开
         * * `_top`：在整个窗口中打开
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button-icon#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * 按钮组件
       * 
       * ```html
       * <mdui-button>Button</mdui-button>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/button
        */
        'mdui-button': {
          /**
          * 按钮的形状。可选值包括：
         * 
         * * `elevated`：带阴影的按钮，适用于需要将按钮与背景视觉分离的场景
         * * `filled`：视觉效果强烈，适用于重要流程的最终操作，如“保存”、“确认”等
         * * `tonal`：视觉效果介于 `filled` 和 `outlined` 之间，适用于中高优先级的操作，如流程中的“下一步”
         * * `outlined`：带边框的按钮，适用于中等优先级，且次要的操作，如“返回”
         * * `text`：文本按钮，适用于最低优先级的操作
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-variant
          */
          'variant'?: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';
        /**
          * 是否填满父元素宽度
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-full-width
          */
          'full-width'?: boolean;
        /**
          * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-icon
          */
          'icon'?: string;
        /**
          * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 是否禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否处于加载中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-loading
          */
          'loading'?: boolean;
        /**
          * 按钮的名称，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-name
          */
          'name'?: string;
        /**
          * 按钮的初始值，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-value
          */
          'value'?: string;
        /**
          * 按钮的类型。默认类型为 `button`。可选类型包括：
         * 
         * * `submit`：点击按钮会提交表单数据到服务器
         * * `reset`：点击按钮会将表单中的所有字段重置为初始值
         * * `button`：此类型的按钮没有默认行为
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-form
          */
          'form'?: string;
        /**
          * 指定提交表单的 URL。
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-formaction
          */
          'formaction'?: string;
        /**
          * 指定提交表单到服务器的内容类型。可选值包括：
         * 
         * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
         * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
         * * `text/plain`：HTML5 新增，用于调试
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * 指定提交表单时使用的 HTTP 方法。可选值包括：
         * 
         * * `post`：表单数据包含在表单内容中，发送到服务器
         * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * 如果设置了此属性，表单提交时将不执行表单验证。
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * 提交表单后接收到的响应应显示在何处。可选值包括：
         * 
         * * `_self`：默认选项，在当前框架中打开
         * * `_blank`：在新窗口中打开
         * * `_parent`：在父框架中打开
         * * `_top`：在整个窗口中打开
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/button#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * 卡片组件
       * 
       * ```html
       * <mdui-card>card content</mdui-card>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/card
        */
        'mdui-card': {
          /**
          * 卡片的形状。可选值包括：
         * 
         * * `elevated`：带阴影的卡片，与背景的视觉分离度较高
         * * `filled`：带填充色的卡片，与背景的视觉分离度较低
         * * `outlined`：带边框的卡片，与背景的视觉分离度最高
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-variant
          */
          'variant'?: 'elevated' | 'filled' | 'outlined';
        /**
          * 是否可点击。为 `true` 时，卡片将具有鼠标悬浮效果和点击涟漪效果
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-clickable
          */
          'clickable'?: boolean;
        /**
          * 是否禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/card#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 复选框组件
       * 
       * ```html
       * <mdui-checkbox>Checkbox</mdui-checkbox>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox
        */
        'mdui-checkbox': {
          /**
          * 是否为禁用状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否为选中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-checked
          */
          'checked'?: boolean;
        /**
          * 是否处于不确定状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-indeterminate
          */
          'indeterminate'?: boolean;
        /**
          * 提交表单时，是否必须选中此复选框
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-required
          */
          'required'?: boolean;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-form
          */
          'form'?: string;
        /**
          * 复选框名称，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-name
          */
          'name'?: string;
        /**
          * 复选框的值，将于表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-value
          */
          'value'?: string;
        /**
          * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-unchecked-icon
          */
          'unchecked-icon'?: string;
        /**
          * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-checked-icon
          */
          'checked-icon'?: string;
        /**
          * 不确定状态的 Material Icons 图标名。也可以通过 `slot="indeterminate-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-indeterminate-icon
          */
          'indeterminate-icon'?: string;
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/checkbox#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 纸片组件
       * 
       * ```html
       * <mdui-chip>Chip</mdui-chip>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/chip
        */
        'mdui-chip': {
          /**
          * 纸片的形状。可选值包括：
         * 
         * * `assist`：用于显示与当前上下文相关的辅助操作，如在点餐页面提供分享、收藏等功能
         * * `filter`：用于对内容进行筛选，如在搜索结果页过滤搜索结果
         * * `input`：用于表示用户输入的信息片段，如在 Gmail 的“收件人”字段中的联系人
         * * `suggestion`：用于提供动态生成的推荐信息，以简化用户操作，如在聊天应用中预测用户可能想发送的信息
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-variant
          */
          'variant'?: 'assist' | 'filter' | 'input' | 'suggestion';
        /**
          * 是否显示阴影
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-elevated
          */
          'elevated'?: boolean;
        /**
          * 是否可选中
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-selectable
          */
          'selectable'?: boolean;
        /**
          * 是否已选中
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-selected
          */
          'selected'?: boolean;
        /**
          * 是否可删除。为 `true` 时，纸片右侧会显示删除图标
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-deletable
          */
          'deletable'?: boolean;
        /**
          * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-icon
          */
          'icon'?: string;
        /**
          * 选中状态下左侧的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 可删除时，右侧删除图标的 Material Icons 图标名。也可以通过 `slot="delete-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-delete-icon
          */
          'delete-icon'?: string;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 是否禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否处于加载中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-loading
          */
          'loading'?: boolean;
        /**
          * 按钮的名称，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-name
          */
          'name'?: string;
        /**
          * 按钮的初始值，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-value
          */
          'value'?: string;
        /**
          * 按钮的类型。默认类型为 `button`。可选类型包括：
         * 
         * * `submit`：点击按钮会提交表单数据到服务器
         * * `reset`：点击按钮会将表单中的所有字段重置为初始值
         * * `button`：此类型的按钮没有默认行为
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-form
          */
          'form'?: string;
        /**
          * 指定提交表单的 URL。
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-formaction
          */
          'formaction'?: string;
        /**
          * 指定提交表单到服务器的内容类型。可选值包括：
         * 
         * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
         * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
         * * `text/plain`：HTML5 新增，用于调试
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * 指定提交表单时使用的 HTTP 方法。可选值包括：
         * 
         * * `post`：表单数据包含在表单内容中，发送到服务器
         * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * 如果设置了此属性，表单提交时将不执行表单验证。
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * 提交表单后接收到的响应应显示在何处。可选值包括：
         * 
         * * `_self`：默认选项，在当前框架中打开
         * * `_blank`：在新窗口中打开
         * * `_parent`：在父框架中打开
         * * `_top`：在整个窗口中打开
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/chip#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * 圆形进度指示器组件
       * 
       * ```html
       * <mdui-circular-progress></mdui-circular-progress>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/circular-progress
        */
        'mdui-circular-progress': {
          /**
          * 进度指示器的最大值。默认为 `1`
          * @see https://www.mdui.org/zh-cn/docs/2/components/circular-progress#attributes-max
          */
          'max'?: number;
        /**
          * 进度指示器的当前值。如果未指定该值，则显示为不确定状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/circular-progress#attributes-value
          */
          'value'?: number;
        } & HTMLElementProps;
      /**
        * 折叠面板项组件，需配合 `<mdui-collapse>` 组件使用
       * 
       * ```html
       * <mdui-collapse>
       *   <mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
       *   <mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
       * </mdui-collapse>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/collapse
        */
        'mdui-collapse-item': {
          /**
          * 此折叠面板项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-item-attributes-value
          */
          'value'?: string;
        /**
          * 此折叠面板项的头部文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-item-attributes-header
          */
          'header'?: string;
        /**
          * 是否禁用此折叠面板项
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-item-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 点击该元素时触发折叠，值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](https://www.mdui.org/zh-cn/docs/2/functions/jq)。默认为点击整个 header 区域触发
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-item-attributes-trigger
          */
          'trigger'?: string | HTMLElement | JQ<HTMLElement>;
        } & HTMLElementProps;
      /**
        * 折叠面板组件，需配合 `<mdui-collapse-item>` 组件使用
       * 
       * ```html
       * <mdui-collapse>
       *   <mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
       *   <mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
       * </mdui-collapse>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/collapse
        */
        'mdui-collapse': {
          /**
          * 是否启用手风琴模式
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-attributes-accordion
          */
          'accordion'?: boolean;
        /**
          * 当前展开的 `<mdui-collapse-item>` 的值
         * 
         * **Note**：该属性的 HTML 属性始终为字符串，只有在 `accordion` 为 `true` 时，才能设置初始值；该属性的 JavaScript 属性值在 `accordion` 为 `true` 时为字符串，在 `accordion` 为 `false` 时为字符串数组。因此，当 `accordion` 为 `false` 时，只能通过修改 JavaScript 属性值来改变此值。
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-attributes-value
          */
          'value'?: string | string[];
        /**
          * 是否禁用此折叠面板
          * @see https://www.mdui.org/zh-cn/docs/2/components/collapse#collapse-attributes-disabled
          */
          'disabled'?: boolean;
        } & HTMLElementProps;
      /**
        * 对话框组件
       * 
       * ```html
       * <mdui-dialog>content</mdui-dialog>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/dialog
        */
        'mdui-dialog': {
          /**
          * 顶部的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-icon
          */
          'icon'?: string;
        /**
          * 标题。也可以通过 `slot="headline"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-headline
          */
          'headline'?: string;
        /**
          * 标题下方的文本。也可以通过 `slot="description"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-description
          */
          'description'?: string;
        /**
          * 是否打开对话框
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-open
          */
          'open'?: boolean;
        /**
          * 是否全屏显示对话框
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-fullscreen
          */
          'fullscreen'?: boolean;
        /**
          * 是否允许按下 ESC 键关闭对话框
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-close-on-esc
          */
          'close-on-esc'?: boolean;
        /**
          * 是否允许点击遮罩层关闭对话框
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-close-on-overlay-click
          */
          'close-on-overlay-click'?: boolean;
        /**
          * 是否垂直排列底部操作按钮
          * @see https://www.mdui.org/zh-cn/docs/2/components/dialog#attributes-stacked-actions
          */
          'stacked-actions'?: boolean;
        } & HTMLElementProps;
      /**
        * 分割线组件
       * 
       * ```html
       * <mdui-divider></mdui-divider>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/divider
        */
        'mdui-divider': {
          /**
          * 是否为垂直分割线
          * @see https://www.mdui.org/zh-cn/docs/2/components/divider#attributes-vertical
          */
          'vertical'?: boolean;
        /**
          * 是否进行左侧缩进
          * @see https://www.mdui.org/zh-cn/docs/2/components/divider#attributes-inset
          */
          'inset'?: boolean;
        /**
          * 是否进行左右两侧缩进
          * @see https://www.mdui.org/zh-cn/docs/2/components/divider#attributes-middle
          */
          'middle'?: boolean;
        } & HTMLElementProps;
      /**
        * 下拉组件
       * 
       * ```html
       * <mdui-dropdown>
       *   <mdui-button slot="trigger">open dropdown</mdui-button>
       *   <mdui-menu>
       *     <mdui-menu-item>Item 1</mdui-menu-item>
       *     <mdui-menu-item>Item 2</mdui-menu-item>
       *   </mdui-menu>
       * </mdui-dropdown>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown
        */
        'mdui-dropdown': {
          /**
          * 是否打开下拉组件
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-open
          */
          'open'?: boolean;
        /**
          * 是否禁用下拉组件
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 下拉组件的触发方式，支持多个值，用空格分隔。可选值包括：
         * 
         * * `click`：点击触发
         * * `hover`：鼠标悬浮触发
         * * `focus`：聚焦触发
         * * `contextmenu`：鼠标右键点击、或触摸长按触发
         * * `manual`：仅能通过编程方式打开和关闭下拉组件，不能再指定其他触发方式
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-trigger
          */
          'trigger'?: 'click' | 'hover' | 'focus' | 'contextmenu' | 'manual' | string;
        /**
          * 下拉组件内容的位置。可选值包括：
         * 
         * * `auto`：自动判断位置
         * * `top-start`：上方左对齐
         * * `top`：上方居中
         * * `top-end`：上方右对齐
         * * `bottom-start`：下方左对齐
         * * `bottom`：下方居中
         * * `bottom-end`：下方右对齐
         * * `left-start`：左侧顶部对齐
         * * `left`：左侧居中
         * * `left-end`：左侧底部对齐
         * * `right-start`：右侧顶部对齐
         * * `right`：右侧居中
         * * `right-end`：右侧底部对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-placement
          */
          'placement'?: 'auto' | 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end';
        /**
          * 点击 [`<mdui-menu-item>`](https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-api) 后，下拉组件是否保持打开状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-stay-open-on-click
          */
          'stay-open-on-click'?: boolean;
        /**
          * 鼠标悬浮触发下拉组件打开的延时，单位为毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-open-delay
          */
          'open-delay'?: number;
        /**
          * 鼠标悬浮触发下拉组件关闭的延时，单位为毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-close-delay
          */
          'close-delay'?: number;
        /**
          * 是否在触发下拉组件的光标位置打开下拉组件，常用于打开鼠标右键菜单
          * @see https://www.mdui.org/zh-cn/docs/2/components/dropdown#attributes-open-on-pointer
          */
          'open-on-pointer'?: boolean;
        } & HTMLElementProps;
      /**
        * 浮动操作按钮组件
       * 
       * ```html
       * <mdui-fab icon="edit"></mdui-fab>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/fab
        */
        'mdui-fab': {
          /**
          * FAB 的形状，此组件的不同形状之间只有颜色不一样。可选值包括：
         * 
         * * `primary`：使用 Primary container 背景色
         * * `surface`：使用 Surface container high 背景色
         * * `secondary`：使用 Secondary container 背景色
         * * `tertiary`：使用 Tertiary container 背景色
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-variant
          */
          'variant'?: 'primary' | 'surface' | 'secondary' | 'tertiary';
        /**
          * FAB 的大小。可选值包括：
         * * `normal`：普通大小 FAB
         * * `small`：小型 FAB
         * * `large`：大型 FAB
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-size
          */
          'size'?: 'normal' | 'small' | 'large';
        /**
          * Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-icon
          */
          'icon'?: string;
        /**
          * 是否为展开状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-extended
          */
          'extended'?: boolean;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 是否禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否处于加载中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-loading
          */
          'loading'?: boolean;
        /**
          * 按钮的名称，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-name
          */
          'name'?: string;
        /**
          * 按钮的初始值，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-value
          */
          'value'?: string;
        /**
          * 按钮的类型。默认类型为 `button`。可选类型包括：
         * 
         * * `submit`：点击按钮会提交表单数据到服务器
         * * `reset`：点击按钮会将表单中的所有字段重置为初始值
         * * `button`：此类型的按钮没有默认行为
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-form
          */
          'form'?: string;
        /**
          * 指定提交表单的 URL。
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-formaction
          */
          'formaction'?: string;
        /**
          * 指定提交表单到服务器的内容类型。可选值包括：
         * 
         * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
         * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
         * * `text/plain`：HTML5 新增，用于调试
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * 指定提交表单时使用的 HTTP 方法。可选值包括：
         * 
         * * `post`：表单数据包含在表单内容中，发送到服务器
         * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * 如果设置了此属性，表单提交时将不执行表单验证。
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * 提交表单后接收到的响应应显示在何处。可选值包括：
         * 
         * * `_self`：默认选项，在当前框架中打开
         * * `_blank`：在新窗口中打开
         * * `_parent`：在父框架中打开
         * * `_top`：在整个窗口中打开
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/fab#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * 图标组件
       * 
       * ```html
       * <mdui-icon name="search"></mdui-icon>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/icon
        */
        'mdui-icon': {
          /**
          * Material Icons 图标名
          * @see https://www.mdui.org/zh-cn/docs/2/components/icon#attributes-name
          */
          'name'?: string;
        /**
          * svg 图标的路径
          * @see https://www.mdui.org/zh-cn/docs/2/components/icon#attributes-src
          */
          'src'?: string;
        } & HTMLElementProps;
      /**
        * 布局项组件
       * 
       * ```html
       * <mdui-layout>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-main></mdui-layout-main>
       * </mdui-layout>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/layout
        */
        'mdui-layout-item': {
          /**
          * 组件的位置。可选值包括：
         * 
         * * `top`：上方
         * * `bottom`：下方
         * * `left`：左侧
         * * `right`：右侧
          * @see https://www.mdui.org/zh-cn/docs/2/components/layout#layout-item-attributes-placement
          */
          'placement'?: 'top' | 'bottom' | 'left' | 'right';
        /**
          * 该组件在 [`<mdui-layout>`](https://www.mdui.org/zh-cn/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/layout#layout-item-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * 布局主体内容组件
       * 
       * ```html
       * <mdui-layout>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-main></mdui-layout-main>
       * </mdui-layout>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/layout
        */
        'mdui-layout-main': {
          
        } & HTMLElementProps;
      /**
        * 布局组件
       * 
       * ```html
       * <mdui-layout>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-main></mdui-layout-main>
       * </mdui-layout>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/layout
        */
        'mdui-layout': {
          /**
          * 设置当前布局的高度为 100%
          * @see https://www.mdui.org/zh-cn/docs/2/components/layout#layout-attributes-full-height
          */
          'full-height'?: boolean;
        } & HTMLElementProps;
      /**
        * 线性进度指示器组件
       * 
       * ```html
       * <mdui-linear-progress></mdui-linear-progress>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/linear-progress
        */
        'mdui-linear-progress': {
          /**
          * 进度指示器的最大值。默认为 `1`
          * @see https://www.mdui.org/zh-cn/docs/2/components/linear-progress#attributes-max
          */
          'max'?: number;
        /**
          * 进度指示器的当前值。如果未指定该值，则处于不确定状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/linear-progress#attributes-value
          */
          'value'?: number;
        } & HTMLElementProps;
      /**
        * 列表项组件。需配合 `<mdui-list>` 组件使用
       * 
       * ```html
       * <mdui-list>
       *   <mdui-list-subheader>Subheader</mdui-list-subheader>
       *   <mdui-list-item>Item 1</mdui-list-item>
       *   <mdui-list-item>Item 2</mdui-list-item>
       * </mdui-list>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/list
        */
        'mdui-list-item': {
          /**
          * 主文本。也可以通过 default slot 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-headline
          */
          'headline'?: string;
        /**
          * 主文本行数，超过限制后将截断显示。默认无行数限制。可选值包括：
         * 
         * * `1`：显示单行，超出后截断
         * * `2`：显示两行，超出后截断
         * * `3`：显示三行，超出后截断
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-headline-line
          */
          'headline-line'?: 1 | 2 | 3;
        /**
          * 副文本。也可以通过 `slot="description"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-description
          */
          'description'?: string;
        /**
          * 副文本行数，超过限制后将截断显示。默认无行数限制。可选值包括：
         * 
         * * `1`：显示单行，超出后截断
         * * `2`：显示两行，超出后截断
         * * `3`：显示三行，超出后截断
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-description-line
          */
          'description-line'?: 1 | 2 | 3;
        /**
          * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-icon
          */
          'icon'?: string;
        /**
          * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 是否禁用该列表项，禁用后，列表项将变为灰色，且其中的 [`<mdui-checkbox>`](https://www.mdui.org/zh-cn/docs/2/components/checkbox)、[`<mdui-radio>`](https://www.mdui.org/zh-cn/docs/2/components/radio)、[`<mdui-switch>`](https://www.mdui.org/zh-cn/docs/2/components/switch) 等也将禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否激活该列表项
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-active
          */
          'active'?: boolean;
        /**
          * 是否使列表项不可点击。设置后，列表项中的 [`<mdui-checkbox>`](https://www.mdui.org/zh-cn/docs/2/components/checkbox)、[`<mdui-radio>`](https://www.mdui.org/zh-cn/docs/2/components/radio)、[`<mdui-switch>`](https://www.mdui.org/zh-cn/docs/2/components/switch) 等仍可交互
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-nonclickable
          */
          'nonclickable'?: boolean;
        /**
          * 是否使用圆角形状的列表项
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-rounded
          */
          'rounded'?: boolean;
        /**
          * 列表项的垂直对齐方式。可选值包括：
         * 
         * * `start`：顶部对齐
         * * `center`：居中对齐
         * * `end`：底部对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-alignment
          */
          'alignment'?: 'start' | 'center' | 'end';
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/list#list-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 列表标题组件。需配合 `<mdui-list>` 组件使用
       * 
       * ```html
       * <mdui-list>
       *   <mdui-list-subheader>Subheader</mdui-list-subheader>
       *   <mdui-list-item>Item 1</mdui-list-item>
       *   <mdui-list-item>Item 2</mdui-list-item>
       * </mdui-list>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/list
        */
        'mdui-list-subheader': {
          
        } & HTMLElementProps;
      /**
        * 列表组件。需配合 `<mdui-list-item>` 组件使用
       * 
       * ```html
       * <mdui-list>
       *   <mdui-list-subheader>Subheader</mdui-list-subheader>
       *   <mdui-list-item>Item 1</mdui-list-item>
       *   <mdui-list-item>Item 2</mdui-list-item>
       * </mdui-list>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/list
        */
        'mdui-list': {
          
        } & HTMLElementProps;
      /**
        * 菜单项组件。需配合 `<mdui-menu>` 组件使用
       * 
       * ```html
       * <mdui-menu>
       *   <mdui-menu-item>Item 1</mdui-menu-item>
       *   <mdui-menu-item>Item 2</mdui-menu-item>
       * </mdui-menu>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/menu
        */
        'mdui-menu-item': {
          /**
          * 菜单项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-value
          */
          'value'?: string;
        /**
          * 是否禁用菜单项
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
         * 
         * 如果左侧不需要显示图标，但需要预留一个图标的位置，可传入空字符串进行占位
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-icon
          */
          'icon'?: string;
        /**
          * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 右侧的文本。也可以通过 `slot="end-text"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-end-text
          */
          'end-text'?: string;
        /**
          * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * 是否打开子菜单
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-submenu-open
          */
          'submenu-open'?: boolean;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 菜单组件。需配合 `<mdui-menu-item>` 组件使用
       * 
       * ```html
       * <mdui-menu>
       *   <mdui-menu-item>Item 1</mdui-menu-item>
       *   <mdui-menu-item>Item 2</mdui-menu-item>
       * </mdui-menu>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/menu
        */
        'mdui-menu': {
          /**
          * 菜单项的可选状态。默认不可选。可选值包括：
         * 
         * * `single`：单选
         * * `multiple`：多选
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-attributes-selects
          */
          'selects'?: 'single' | 'multiple';
        /**
          * 当前选中的 `<mdui-menu-item>` 的值。
         * 
         * **Note**：该属性的 HTML 属性始终为字符串，仅在 `selects="single"` 时可通过 HTML 属性设置初始值；该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。因此，在 `selects="multiple"` 时，若要修改该值，只能通过修改 JavaScript 属性值实现。
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-attributes-value
          */
          'value'?: string | string[];
        /**
          * 菜单项是否使用紧凑布局
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-attributes-dense
          */
          'dense'?: boolean;
        /**
          * 子菜单的触发方式，支持多个值，用空格分隔。可选值包括：
         * 
         * * `click`：点击菜单项时打开子菜单
         * * `hover`：鼠标悬浮到菜单项上时打开子菜单
         * * `focus`：聚焦到菜单项上时打开子菜单
         * * `manual`：仅能通过编程方式打开和关闭子菜单，不能再指定其他触发方式
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-attributes-submenu-trigger
          */
          'submenu-trigger'?: 'click' | 'hover' | 'focus' | 'manual' | string;
        /**
          * 鼠标悬浮触发子菜单打开的延时，单位毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-attributes-submenu-open-delay
          */
          'submenu-open-delay'?: number;
        /**
          * 鼠标悬浮触发子菜单关闭的延时，单位毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/menu#menu-attributes-submenu-close-delay
          */
          'submenu-close-delay'?: number;
        } & HTMLElementProps;
      /**
        * 底部导航栏项组件。需配合 `<mdui-navigation-bar>` 组件使用
       * 
       * ```html
       * <mdui-navigation-bar>
       *   <mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
       * </mdui-navigation-bar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar
        */
        'mdui-navigation-bar-item': {
          /**
          * 未激活状态的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-icon
          */
          'icon'?: string;
        /**
          * 激活状态的 Material Icons 图标名。也可以通过 `slot="active-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-active-icon
          */
          'active-icon'?: string;
        /**
          * 导航项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-value
          */
          'value'?: string;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 底部导航栏组件。需配合 `<mdui-navigation-bar-item>` 组件使用
       * 
       * ```html
       * <mdui-navigation-bar>
       *   <mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
       * </mdui-navigation-bar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar
        */
        'mdui-navigation-bar': {
          /**
          * 是否隐藏
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-hide
          */
          'hide'?: boolean;
        /**
          * 文本的可视状态。可选值包括：
         * 
         * * `auto`：当选项小于等于3个时，始终显示文本；当选项大于3个时，仅显示选中状态的文本
         * * `selected`：仅在选中状态显示文本
         * * `labeled`：始终显示文本
         * * `unlabeled`：始终不显示文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-label-visibility
          */
          'label-visibility'?: 'auto' | 'selected' | 'labeled' | 'unlabeled';
        /**
          * 当前选中的 `<mdui-navigation-bar-item>` 的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-value
          */
          'value'?: string;
        /**
          * 滚动行为。可选值包括：
         * 
         * * `hide`：滚动时隐藏
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-scroll-behavior
          */
          'scroll-behavior'?: 'hide' | 'shrink' | 'elevate';
        /**
          * 需要监听其滚动事件的元素。值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](https://www.mdui.org/zh-cn/docs/2/functions/jq)。默认监听 `window` 的滚动事件
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-scroll-target
          */
          'scroll-target'?: string | HTMLElement | JQ<HTMLElement>;
        /**
          * 在滚动多少距离之后触发滚动行为，单位为 `px`
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-scroll-threshold
          */
          'scroll-threshold'?: number;
        /**
          * 该组件在 [`<mdui-layout>`](https://www.mdui.org/zh-cn/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-bar#navigation-bar-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * 侧边抽屉栏组件
       * 
       * ```html
       * <mdui-navigation-drawer>content</mdui-navigation-drawer>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer
        */
        'mdui-navigation-drawer': {
          /**
          * 是否打开抽屉栏
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-open
          */
          'open'?: boolean;
        /**
          * 抽屉栏打开时，是否显示遮罩层
         * 
         * 在窄屏设备上（屏幕宽度小于 [`--mdui-breakpoint-md`](https://www.mdui.org/zh-cn/docs/2/styles/design-tokens#breakpoint)），会始终显示遮罩层，无视该参数
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-modal
          */
          'modal'?: boolean;
        /**
          * 在有遮罩层的情况下，按下 ESC 键是否关闭抽屉栏
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-close-on-esc
          */
          'close-on-esc'?: boolean;
        /**
          * 点击遮罩层时，是否关闭抽屉栏
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-close-on-overlay-click
          */
          'close-on-overlay-click'?: boolean;
        /**
          * 抽屉栏的位置。可选值包括：
         * 
         * * `left`：左侧
         * * `right`：右侧
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-placement
          */
          'placement'?: 'left' | 'right';
        /**
          * 默认情况下，抽屉栏相对于 `body` 元素显示。当该参数设置为 `true` 时，抽屉栏将相对于其父元素显示。
         * 
         * **Note**：设置该属性时，必须在父元素上手动设置样式 `position: relative; overflow: hidden;`。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-contained
          */
          'contained'?: boolean;
        /**
          * 该组件在 [`<mdui-layout>`](https://www.mdui.org/zh-cn/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-drawer#attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * 侧边导航项组件。需配合 `<mdui-navigation-rail>` 组件使用
       * 
       * ```html
       * <mdui-navigation-rail>
       *   <mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
       * </mdui-navigation-rail>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail
        */
        'mdui-navigation-rail-item': {
          /**
          * 未激活状态下的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-icon
          */
          'icon'?: string;
        /**
          * 激活状态下的 Material Icons 图标名。也可以通过 `slot="active-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-active-icon
          */
          'active-icon'?: string;
        /**
          * 导航项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-value
          */
          'value'?: string;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 侧边导航栏组件。需配合 `<mdui-navigation-rail-item>` 组件使用
       * 
       * ```html
       * <mdui-navigation-rail>
       *   <mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
       * </mdui-navigation-rail>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail
        */
        'mdui-navigation-rail': {
          /**
          * 当前选中的 `<mdui-navigation-rail-item>` 的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-attributes-value
          */
          'value'?: string;
        /**
          * 导航栏的位置。可选值包括：
         * 
         * * `left`：左侧
         * * `right`：右侧
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-attributes-placement
          */
          'placement'?: 'left' | 'right';
        /**
          * `<mdui-navigation-rail-item>` 元素的对齐方式。可选值包括：
         * 
         * * `start`：顶部对齐
         * * `center`：居中对齐
         * * `end`：底部对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-attributes-alignment
          */
          'alignment'?: 'start' | 'center' | 'end';
        /**
          * 默认情况下，导航栏相对于 `body` 元素显示。当该参数设置为 `true` 时，导航栏将相对于其父元素显示。
         * 
         * **Note**：设置该属性时，必须在父元素上手动设置样式 `position: relative;`。
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-attributes-contained
          */
          'contained'?: boolean;
        /**
          * 是否在导航栏和页面内容之间添加分割线
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-attributes-divider
          */
          'divider'?: boolean;
        /**
          * 该组件在 [`<mdui-layout>`](https://www.mdui.org/zh-cn/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/navigation-rail#navigation-rail-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * 单选框组组件。需配合 `<mdui-radio>` 组件使用
       * 
       * ```html
       * <mdui-radio-group value="chinese">
       *   <mdui-radio value="chinese">Chinese</mdui-radio>
       *   <mdui-radio value="english">English</mdui-radio>
       * </mdui-radio-group>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/radio
        */
        'mdui-radio-group': {
          /**
          * 是否禁用此组件
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-group-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-group-attributes-form
          */
          'form'?: string;
        /**
          * 单选框组的名称，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-group-attributes-name
          */
          'name'?: string;
        /**
          * 单选框组的名称，将于表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-group-attributes-value
          */
          'value'?: string;
        /**
          * 提交表单时，是否必须选中其中一个单选框
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-group-attributes-required
          */
          'required'?: boolean;
        } & HTMLElementProps;
      /**
        * 单选框组件。需配合 `<mdui-radio-group>` 组件使用
       * 
       * ```html
       * <mdui-radio-group value="chinese">
       *   <mdui-radio value="chinese">Chinese</mdui-radio>
       *   <mdui-radio value="english">English</mdui-radio>
       * </mdui-radio-group>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/radio
        */
        'mdui-radio': {
          /**
          * 当前单选项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-value
          */
          'value'?: string;
        /**
          * 是否禁用当前单选项
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 当前单选项是否已选中
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-checked
          */
          'checked'?: boolean;
        /**
          * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-unchecked-icon
          */
          'unchecked-icon'?: string;
        /**
          * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-checked-icon
          */
          'checked-icon'?: string;
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/radio#radio-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 范围滑块组件
       * 
       * ```html
       * <mdui-range-slider></mdui-range-slider>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider
        */
        'mdui-range-slider': {
          /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 滑块的最小值，默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-min
          */
          'min'?: number;
        /**
          * 滑块的最大值，默认为 `100`
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-max
          */
          'max'?: number;
        /**
          * 步进间隔，默认为 `1`
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-step
          */
          'step'?: number;
        /**
          * 是否添加刻度标记
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-tickmarks
          */
          'tickmarks'?: boolean;
        /**
          * 是否隐藏文本提示
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-nolabel
          */
          'nolabel'?: boolean;
        /**
          * 是否被禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-form
          */
          'form'?: string;
        /**
          * 滑块的名称，该名称将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/range-slider#attributes-name
          */
          'name'?: string;
        } & HTMLElementProps;
      /**
        * 分段按钮组件。需配合 `<mdui-segmented-button>` 组件使用
       * 
       * ```html
       * <mdui-segmented-button-group>
       *   <mdui-segmented-button>Day</mdui-segmented-button>
       *   <mdui-segmented-button>Week</mdui-segmented-button>
       *   <mdui-segmented-button>Month</mdui-segmented-button>
       * </mdui-segmented-button-group>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button
        */
        'mdui-segmented-button-group': {
          /**
          * 是否填满父元素宽度
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-full-width
          */
          'full-width'?: boolean;
        /**
          * 分段按钮的可选中状态，默认为不可选中。可选值包括：
         * 
         * * `single`：单选
         * * `multiple`：多选
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-selects
          */
          'selects'?: 'single' | 'multiple';
        /**
          * 是否为禁用状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 提交表单时，是否必须选中
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-required
          */
          'required'?: boolean;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-form
          */
          'form'?: string;
        /**
          * 提交表单时的名称，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-name
          */
          'name'?: string;
        /**
          * 当前选中的 `<mdui-segmented-button>` 的值。
         * 
         * **Note**：该属性的 HTML 属性始终为字符串，且仅在 `selects="single"` 时可以通过 HTML 属性设置初始值。该属性的 JavaScript 属性值在 `selects="single"` 时为字符串，在 `selects="multiple"` 时为字符串数组。所以，在 `selects="multiple"` 时，如果要修改该值，只能通过修改 JavaScript 属性值实现。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-group-attributes-value
          */
          'value'?: string | string[];
        } & HTMLElementProps;
      /**
        * 分段按钮项组件。需配合 `<mdui-segmented-button-group>` 组件使用
       * 
       * ```html
       * <mdui-segmented-button-group>
       *   <mdui-segmented-button>Day</mdui-segmented-button>
       *   <mdui-segmented-button>Week</mdui-segmented-button>
       *   <mdui-segmented-button>Month</mdui-segmented-button>
       * </mdui-segmented-button-group>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button
        */
        'mdui-segmented-button': {
          /**
          * 左侧的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-icon
          */
          'icon'?: string;
        /**
          * 右侧的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 选中状态的 Material Icons 图标名。也可以通过 `slot="selected-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * 链接的目标 URL。
         * 
         * 如果设置了此属性，组件内部将渲染为 `<a>` 元素，并可以使用链接相关的属性。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-href
          */
          'href'?: string;
        /**
          * 下载链接的目标。
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-download
          */
          'download'?: string;
        /**
          * 链接的打开方式。可选值包括：
         * 
         * * `_blank`：在新窗口中打开链接
         * * `_parent`：在父框架中打开链接
         * * `_self`：默认。在当前框架中打开链接
         * * `_top`：在整个窗口中打开链接
         * 
         * **Note**：仅在设置了 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * 当前文档与被链接文档之间的关系。可选值包括：
         * 
         * * `alternate`：当前文档的替代版本
         * * `author`：当前文档或文章的作者
         * * `bookmark`：永久链接到最近的祖先章节
         * * `external`：引用的文档与当前文档不在同一站点
         * * `help`：链接到相关的帮助文档
         * * `license`：当前文档的主要内容由被引用文件的版权许可覆盖
         * * `me`：当前文档代表链接内容的所有者
         * * `next`：当前文档是系列中的一部分，被引用的文档是系列的下一个文档
         * * `nofollow`：当前文档的作者或发布者不认可被引用的文件
         * * `noreferrer`：不包含 `Referer` 头。类似于 `noopener` 的效果
         * * `opener`：如果超链接会创建一个顶级浏览上下文（即 `target` 属性值为 `_blank`），则创建一个辅助浏览上下文
         * * `prev`：当前文档是系列的一部分，被引用的文档是系列的上一个文档
         * * `search`：提供一个资源链接，可用于搜索当前文件及其相关页面
         * * `tag`：提供一个适用于当前文档的标签（由给定地址识别）
         * 
         * **Note**：仅在指定了 `href` 属性时可用。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 是否禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否处于加载中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-loading
          */
          'loading'?: boolean;
        /**
          * 按钮的名称，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-name
          */
          'name'?: string;
        /**
          * 按钮的初始值，将与表单数据一起提交。
         * 
         * **Note**：仅在未设置 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-value
          */
          'value'?: string;
        /**
          * 按钮的类型。默认类型为 `button`。可选类型包括：
         * 
         * * `submit`：点击按钮会提交表单数据到服务器
         * * `reset`：点击按钮会将表单中的所有字段重置为初始值
         * * `button`：此类型的按钮没有默认行为
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
         * 
         * **Note**：仅在未指定 `href` 属性时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-form
          */
          'form'?: string;
        /**
          * 指定提交表单的 URL。
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `action` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-formaction
          */
          'formaction'?: string;
        /**
          * 指定提交表单到服务器的内容类型。可选值包括：
         * 
         * * `application/x-www-form-urlencoded`：未指定该属性时的默认值
         * * `multipart/form-data`：当表单包含 `<input type="file">` 元素时使用
         * * `text/plain`：HTML5 新增，用于调试
         * 
         * 如果指定了此属性，将覆盖 `<form>` 元素的 `enctype` 属性。
         * 
         * **Note**：仅在未指定 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * 指定提交表单时使用的 HTTP 方法。可选值包括：
         * 
         * * `post`：表单数据包含在表单内容中，发送到服务器
         * * `get`：表单数据以 `?` 作为分隔符附加到表单的 URI 属性中，生成的 URI 发送到服务器。当表单没有副作用，并且仅包含 ASCII 字符时，使用此方法
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `method` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * 如果设置了此属性，表单提交时将不执行表单验证。
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `novalidate` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * 提交表单后接收到的响应应显示在何处。可选值包括：
         * 
         * * `_self`：默认选项，在当前框架中打开
         * * `_blank`：在新窗口中打开
         * * `_parent`：在父框架中打开
         * * `_top`：在整个窗口中打开
         * 
         * 如果设置了此属性，将覆盖 `<form>` 元素的 `target` 属性。
         * 
         * **Note**：仅在未设置 `href` 属性且 `type="submit"` 时，此属性才有效。
          * @see https://www.mdui.org/zh-cn/docs/2/components/segmented-button#segmented-button-attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * 选择框组件。需配合 `<mdui-menu-item>` 组件使用
       * 
       * ```html
       * <mdui-select>
       *   <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
       *   <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
       * </mdui-select>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/select
        */
        'mdui-select': {
          /**
          * 选择框的样式。可选值包括：
         * 
         * * `filled`：带背景色的选择框，视觉效果较强
         * * `outlined`：带边框的选择框，视觉效果较弱
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-variant
          */
          'variant'?: 'filled' | 'outlined';
        /**
          * 是否支持多选
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-multiple
          */
          'multiple'?: boolean;
        /**
          * 选择框的名称，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-name
          */
          'name'?: string;
        /**
          * 选择框的值，将与表单数据一起提交。
         * 
         * 如果未指定 `multiple` 属性，该值为字符串；如果指定了 `multiple` 属性，该值为字符串数组。HTML 属性只能设置字符串值；如果需要设置数组值，请通过 JavaScript 属性设置。
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-value
          */
          'value'?: string | string[];
        /**
          * 标签文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-label
          */
          'label'?: string;
        /**
          * 占位符文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-placeholder
          */
          'placeholder'?: string;
        /**
          * 选择框底部的帮助文本。也可以通过 `slot="helper"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-helper
          */
          'helper'?: string;
        /**
          * 是否可以清空选择框
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-clearable
          */
          'clearable'?: boolean;
        /**
          * 当选择框可清空时，显示在选择框右侧的清空按钮的 Material Icons 图标名。也可以通过 `slot="clear-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-clear-icon
          */
          'clear-icon'?: string;
        /**
          * 选择框的位置。可选值包括：
         * 
         * * `auto`：自动判断位置
         * * `bottom`：位于下方
         * * `top`：位于上方
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-placement
          */
          'placement'?: 'auto' | 'bottom' | 'top';
        /**
          * 文本是否右对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-end-aligned
          */
          'end-aligned'?: boolean;
        /**
          * 选择框的前缀文本。仅在聚焦状态，或选择框有值时才会显示。也可以通过 `slot="prefix"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-prefix
          */
          'prefix'?: string;
        /**
          * 选择框的后缀文本。仅在聚焦状态，或选择框有值时才会显示。也可以通过 `slot="suffix"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-suffix
          */
          'suffix'?: string;
        /**
          * 选择框的前缀图标的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-icon
          */
          'icon'?: string;
        /**
          * 选择框的后缀图标的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 表单字段验证失败时，显示在选择框右侧的 Material Icons 图标名。也可以通过 `slot="error-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-error-icon
          */
          'error-icon'?: string;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-form
          */
          'form'?: string;
        /**
          * 是否为只读状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-readonly
          */
          'readonly'?: boolean;
        /**
          * 是否为禁用状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 提交表单时，是否必须填写该字段
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-required
          */
          'required'?: boolean;
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/select#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 滑块组件
       * 
       * ```html
       * <mdui-slider></mdui-slider>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/slider
        */
        'mdui-slider': {
          /**
          * 滑块的值，将于表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-value
          */
          'value'?: number;
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * 滑块的最小值，默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-min
          */
          'min'?: number;
        /**
          * 滑块的最大值，默认为 `100`
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-max
          */
          'max'?: number;
        /**
          * 步进间隔，默认为 `1`
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-step
          */
          'step'?: number;
        /**
          * 是否添加刻度标记
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-tickmarks
          */
          'tickmarks'?: boolean;
        /**
          * 是否隐藏文本提示
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-nolabel
          */
          'nolabel'?: boolean;
        /**
          * 是否被禁用
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-form
          */
          'form'?: string;
        /**
          * 滑块的名称，该名称将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/slider#attributes-name
          */
          'name'?: string;
        } & HTMLElementProps;
      /**
        * 消息条组件
       * 
       * ```html
       * <mdui-snackbar>message</mdui-snackbar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar
        */
        'mdui-snackbar': {
          /**
          * 是否显示 Snackbar
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-open
          */
          'open'?: boolean;
        /**
          * Snackbar 的显示位置。默认为 `bottom`。可选值包括：
         * 
         * * `top`：顶部居中
         * * `top-start`：顶部左对齐
         * * `top-end`：顶部右对齐
         * * `bottom`：底部居中
         * * `bottom-start`：底部左对齐
         * * `bottom-end`：底部右对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-placement
          */
          'placement'?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
        /**
          * 操作按钮的文本。也可以通过 `slot="action"` 设置操作按钮
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-action
          */
          'action'?: string;
        /**
          * 操作按钮是否处于加载中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-action-loading
          */
          'action-loading'?: boolean;
        /**
          * 是否在右侧显示关闭按钮
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-closeable
          */
          'closeable'?: boolean;
        /**
          * 关闭按钮的 Material Icons 图标名。也可以通过 `slot="close-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-close-icon
          */
          'close-icon'?: string;
        /**
          * 消息文本的最大显示行数。默认不限制。可选值包括：
         * 
         * * `1`：最多显示一行
         * * `2`：最多显示两行
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-message-line
          */
          'message-line'?: 1 | 2;
        /**
          * 自动关闭的延迟时间（单位：毫秒）。设置为 `0` 则不自动关闭。默认为 5000 毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-auto-close-delay
          */
          'auto-close-delay'?: number;
        /**
          * 点击或触摸 Snackbar 以外的区域时，是否关闭 Snackbar
          * @see https://www.mdui.org/zh-cn/docs/2/components/snackbar#attributes-close-on-outside-click
          */
          'close-on-outside-click'?: boolean;
        } & HTMLElementProps;
      /**
        * 开关切换组件
       * 
       * ```html
       * <mdui-switch></mdui-switch>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/switch
        */
        'mdui-switch': {
          /**
          * 是否为禁用状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否为选中状态
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-checked
          */
          'checked'?: boolean;
        /**
          * 未选中状态的 Material Icons 图标名。也可以通过 `slot="unchecked-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-unchecked-icon
          */
          'unchecked-icon'?: string;
        /**
          * 选中状态的 Material Icons 图标名。也可以通过 `slot="checked-icon"` 设置
         * 
         * 默认为 `check` 图标，可传入空字符串移除默认图标
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-checked-icon
          */
          'checked-icon'?: string;
        /**
          * 提交表单时，是否必须选中此开关
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-required
          */
          'required'?: boolean;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-form
          */
          'form'?: string;
        /**
          * 开关的名称，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-name
          */
          'name'?: string;
        /**
          * 开关的值，将于表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-value
          */
          'value'?: string;
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/switch#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 选项卡面板项组件。需配合 `<mdui-tabs>` 和 `<mdui-tab>` 组件使用
       * 
       * ```html
       * <mdui-tabs value="tab-1">
       *   <mdui-tab value="tab-1">Tab 1</mdui-tab>
       *   <mdui-tab value="tab-2">Tab 2</mdui-tab>
       *   <mdui-tab value="tab-3">Tab 3</mdui-tab>
       * 
       *   <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
       *   <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
       *   <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
       * </mdui-tabs>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/tabs
        */
        'mdui-tab-panel': {
          /**
          * 选项卡面板项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tab-panel-attributes-value
          */
          'value'?: string;
        } & HTMLElementProps;
      /**
        * 选项卡导航项组件。需配合 `<mdui-tabs>` 和 `<mdui-tab-panel>` 组件使用
       * 
       * ```html
       * <mdui-tabs value="tab-1">
       *   <mdui-tab value="tab-1">Tab 1</mdui-tab>
       *   <mdui-tab value="tab-2">Tab 2</mdui-tab>
       *   <mdui-tab value="tab-3">Tab 3</mdui-tab>
       * 
       *   <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
       *   <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
       *   <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
       * </mdui-tabs>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/tabs
        */
        'mdui-tab': {
          /**
          * 选项卡导航项的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tab-attributes-value
          */
          'value'?: string;
        /**
          * Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tab-attributes-icon
          */
          'icon'?: string;
        /**
          * 是否把图标和文本水平排列
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tab-attributes-inline
          */
          'inline'?: boolean;
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tab-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tab-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 选项卡组件。需配合 `<mdui-tab>` 和 `<mdui-tab-panel>` 组件使用
       * 
       * ```html
       * <mdui-tabs value="tab-1">
       *   <mdui-tab value="tab-1">Tab 1</mdui-tab>
       *   <mdui-tab value="tab-2">Tab 2</mdui-tab>
       *   <mdui-tab value="tab-3">Tab 3</mdui-tab>
       * 
       *   <mdui-tab-panel slot="panel" value="tab-1">Panel 1</mdui-tab-panel>
       *   <mdui-tab-panel slot="panel" value="tab-2">Panel 2</mdui-tab-panel>
       *   <mdui-tab-panel slot="panel" value="tab-3">Panel 3</mdui-tab-panel>
       * </mdui-tabs>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/tabs
        */
        'mdui-tabs': {
          /**
          * 选项卡形状。可选值包括：
         * 
         * * `primary`：适用于位于 `<mdui-top-app-bar>` 下方，用于切换应用的主页面的场景
         * * `secondary`：适用于位于页面中，用于切换一组相关内容的场景
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tabs-attributes-variant
          */
          'variant'?: 'primary' | 'secondary';
        /**
          * 当前激活的 `<mdui-tab>` 的值
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tabs-attributes-value
          */
          'value'?: string;
        /**
          * 选项卡位置。默认为 `top-start`。可选值包括：
         * 
         * * `top-start`：位于上方，左对齐
         * * `top`：位于上方，居中对齐
         * * `top-end`：位于上方，右对齐
         * * `bottom-start`：位于下方，左对齐
         * * `bottom`：位于下方，居中对齐
         * * `bottom-end`：位于下方，右对齐
         * * `left-start`：位于左侧，顶部对齐
         * * `left`：位于左侧，居中对齐
         * * `left-end`：位于左侧，底部对齐
         * * `right-start`：位于右侧，顶部对齐
         * * `right`：位于右侧，居中对齐
         * * `right-end`：位于右侧，底部对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tabs-attributes-placement
          */
          'placement'?: 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end';
        /**
          * 是否填满父元素宽度
          * @see https://www.mdui.org/zh-cn/docs/2/components/tabs#tabs-attributes-full-width
          */
          'full-width'?: boolean;
        } & HTMLElementProps;
      /**
        * 文本框组件
       * 
       * ```html
       * <mdui-text-field label="Text Field"></mdui-text-field>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/text-field
        */
        'mdui-text-field': {
          /**
          * 文本框的形状。默认为 `filled`。可选值包括：
         * 
         * * `filled`：带背景色的文本框，视觉效果较强
         * * `outlined`：带边框的文本框，视觉效果较弱
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-variant
          */
          'variant'?: 'filled' | 'outlined';
        /**
          * 文本框输入类型。默认为 `text`。可选值包括：
         * 
         * * `text`：默认值。文本字段
         * * `number`：只能输入数字。拥有动态键盘的设备上会显示数字键盘
         * * `password`：用于输入密码，其值会被遮盖
         * * `url`：用于输入 URL，会验证 URL 格式。在支持动态键盘的设备上有相应的键盘
         * * `email`：用于输入邮箱地址，会验证邮箱格式。在支持动态键盘的设备上有相应的键盘
         * * `search`：用于搜索框。拥有动态键盘的设备上的回车图标会变成搜索图标
         * * `tel`：用于输入电话号码。拥有动态键盘的设备上会显示电话数字键盘
         * * `hidden`：隐藏该控件，但其值仍会提交到服务器
         * * `date`：输入日期的控件（年、月、日，不包括时间）。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮
         * * `datetime-local`：输入日期和时间的控件，不包括时区。在支持的浏览器激活时打开日期选择器或年月日的数字滚轮
         * * `month`：输入年和月的控件，没有时区
         * * `time`：用于输入时间的控件，不包括时区
         * * `week`：用于输入以年和周数组成的日期，不带时区
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-type
          */
          'type'?: 'text' | 'number' | 'password' | 'url' | 'email' | 'search' | 'tel' | 'hidden' | 'date' | 'datetime-local' | 'month' | 'time' | 'week';
        /**
          * 文本框名称，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-name
          */
          'name'?: string;
        /**
          * 文本框的值，将与表单数据一起提交
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-value
          */
          'value'?: string;
        /**
          * 标签文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-label
          */
          'label'?: string;
        /**
          * 占位符文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-placeholder
          */
          'placeholder'?: string;
        /**
          * 文本框底部的帮助文本。也可以通过 `slot="helper"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-helper
          */
          'helper'?: string;
        /**
          * 是否仅在获得焦点时，显示底部的帮助文本
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-helper-on-focus
          */
          'helper-on-focus'?: boolean;
        /**
          * 是否可清空文本框内容
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-clearable
          */
          'clearable'?: boolean;
        /**
          * 可清空文本框时，显示在文本框右侧的清空按钮的 Material Icons 图标名。也可以通过 `slot="clear-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-clear-icon
          */
          'clear-icon'?: string;
        /**
          * 是否将文本右对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-end-aligned
          */
          'end-aligned'?: boolean;
        /**
          * 文本框的前缀文本。只在文本框聚焦或有值时显示。也可以通过 `slot="prefix"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-prefix
          */
          'prefix'?: string;
        /**
          * 文本框的后缀文本。只在文本框聚焦或有值时显示。也可以通过 `slot="suffix"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-suffix
          */
          'suffix'?: string;
        /**
          * 文本框的前缀图标的 Material Icons 图标名。也可以通过 `slot="icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-icon
          */
          'icon'?: string;
        /**
          * 文本框的后缀图标的 Material Icons 图标名。也可以通过 `slot="end-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * 表单字段验证失败时，显示在文本框右侧的 Material Icons 图标名。也可以通过 `slot="error-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-error-icon
          */
          'error-icon'?: string;
        /**
          * 关联的 `<form>` 元素。此属性值应为同一页面中的一个 `<form>` 元素的 `id`。
         * 
         * 如果未指定此属性，则该元素必须是 `<form>` 元素的子元素。通过此属性，你可以将元素放置在页面的任何位置，而不仅仅是 `<form>` 元素的子元素。
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-form
          */
          'form'?: string;
        /**
          * 是否为只读模式
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-readonly
          */
          'readonly'?: boolean;
        /**
          * 是否禁用输入框
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 提交表单时，是否必须填写该字段
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-required
          */
          'required'?: boolean;
        /**
          * 文本框的固定显示行数
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-rows
          */
          'rows'?: number;
        /**
          * 是否根据输入内容自动调整文本框高度
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-autosize
          */
          'autosize'?: boolean;
        /**
          * `autosize` 为 `true` 时，文本框的最小行数
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-min-rows
          */
          'min-rows'?: number;
        /**
          * `autosize` 为 `true` 时，文本框的最大行数
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-max-rows
          */
          'max-rows'?: number;
        /**
          * 允许输入的最小字符数
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-minlength
          */
          'minlength'?: number;
        /**
          * 允许输入的最大字符数
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-maxlength
          */
          'maxlength'?: number;
        /**
          * 是否显示字数统计，只在 `maxlength` 被指定时有效
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-counter
          */
          'counter'?: boolean;
        /**
          * 当 `type` 为 `number` 时，允许输入的最小数值
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-min
          */
          'min'?: number;
        /**
          * 当 `type` 为 `number` 时，允许输入的最大数值
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-max
          */
          'max'?: number;
        /**
          * `type` 为 `number` 时，数值增减的步长
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-step
          */
          'step'?: number;
        /**
          * 用于表单验证的正则表达式
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-pattern
          */
          'pattern'?: string;
        /**
          * `type` 为 `password` 时，设置此属性会添加一个切换按钮，用于在明文和密文之间切换
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-toggle-password
          */
          'toggle-password'?: boolean;
        /**
          * 密码切换按钮的 Material Icons 图标，当密码为明文时显示。也可以通过 `slot="show-password-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-show-password-icon
          */
          'show-password-icon'?: string;
        /**
          * 密码切换按钮的 Material Icons 图标，当密码为密文时显示。也可以通过 `slot="hide-password-icon"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-hide-password-icon
          */
          'hide-password-icon'?: string;
        /**
          * iOS 的非标准属性，用于控制文本首字母是否自动大写。在 iOS5 及以后的版本上有效。可选值包括：
         * 
         * * `none`：禁用首字母大写
         * * `sentences`：句子首字母大写
         * * `words`：单词首字母大写
         * * `characters`：所有字母大写
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-autocapitalize
          */
          'autocapitalize'?: 'none' | 'sentences' | 'words' | 'characters';
        /**
          * `input` 元素的 `autocorrect` 属性
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-autocorrect
          */
          'autocorrect'?: string;
        /**
          * `input` 元素的 `autocomplete` 属性
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-autocomplete
          */
          'autocomplete'?: string;
        /**
          * `input` 元素的 `enterkeyhint` 属性，用于定制虚拟键盘上的 Enter 键的显示文本或图标。具体显示效果取决于用户使用的设备和语言。可选值包括：
         * 
         * * `enter`：插入新行
         * * `done`：完成输入，关闭虚拟键盘
         * * `go`：导航到输入文本的目标
         * * `next`：移动到下一个输入项
         * * `previous`：移动到上一个输入项
         * * `search`：导航到搜索结果
         * * `send`：发送文本信息
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-enterkeyhint
          */
          'enterkeyhint'?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
        /**
          * 是否启用拼写检查
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-spellcheck
          */
          'spellcheck'?: boolean;
        /**
          * `input` 元素的 `inputmode` 属性，用于定制虚拟键盘的类型。可选值包括：
         * 
         * * `none`：无虚拟键盘。在需要实现自己的键盘输入控件时很有用
         * * `text`：标准文本输入键盘
         * * `decimal`：小数输入键盘，除了数字之外可能会有小数点 `.` 或者千分符逗号 `,`
         * * `numeric`：显示 0-9 的数字键盘
         * * `tel`：手机数字键盘，包含 0-9 数字、星号 `*` 或者井号 `#` 键
         * * `search`：为搜索输入优化的虚拟键盘，提交按钮通常会显示 `search` 或者 “搜索”
         * * `email`：为邮件地址输入优化的虚拟键盘，通常会有 `@ .` 等键
         * * `url`：为 URL 输入优化的虚拟键盘，通常会有 `. / #` 等键
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-inputmode
          */
          'inputmode'?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
        /**
          * 是否在页面加载完成后自动获取焦点
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * 元素在使用 Tab 键切换焦点时的顺序
          * @see https://www.mdui.org/zh-cn/docs/2/components/text-field#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * 工具提示组件
       * 
       * ```html
       * <mdui-tooltip content="tooltip content">
       *   <mdui-button>button</mdui-button>
       * </mdui-tooltip>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip
        */
        'mdui-tooltip': {
          /**
          * tooltip 的形状。默认为 `plain`。可选值包括：
         * 
         * * `plain`：纯文本，适用于简单的单行文本
         * * `rich`：富文本，可以包含标题、正文和操作按钮
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-variant
          */
          'variant'?: 'plain' | 'rich';
        /**
          * tooltip 的位置。默认为 `auto`。可选值包括：
         * 
         * * `auto`：自动判断位置。`variant="plain"` 时，优先使用 `top`；`variant="rich"` 时，优先使用 `bottom-right`
         * * `top-left`：位于左上方
         * * `top-start`：位于上方，左对齐
         * * `top`：位于上方，居中对齐
         * * `top-end`：位于上方，右对齐
         * * `top-right`：位于右上方
         * * `bottom-left`：位于左下方
         * * `bottom-start`：位于下方，左对齐
         * * `bottom`：位于下方，居中对齐
         * * `bottom-end`：位于下方，右对齐
         * * `bottom-right`：位于右下方
         * * `left-start`：位于左侧，顶部对齐
         * * `left`：位于左侧，居中对齐
         * * `left-end`：位于左侧，底部对齐
         * * `right-start`：位于右侧，顶部对齐
         * * `right`：位于右侧，居中对齐
         * * `right-end`：位于右侧，底部对齐
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-placement
          */
          'placement'?: 'auto' | 'top-left' | 'top-start' | 'top' | 'top-end' | 'top-right' | 'bottom-left' | 'bottom-start' | 'bottom' | 'bottom-end' | 'bottom-right' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end';
        /**
          * 鼠标悬浮触发显示的延时，单位为毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-open-delay
          */
          'open-delay'?: number;
        /**
          * 鼠标悬浮触发隐藏的延时，单位为毫秒
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-close-delay
          */
          'close-delay'?: number;
        /**
          * tooltip 的标题。仅 `variant="rich"` 时可使用。也可以通过 `slot="headline"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-headline
          */
          'headline'?: string;
        /**
          * tooltip 的内容。也可以通过 `slot="content"` 设置
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-content
          */
          'content'?: string;
        /**
          * 触发方式，支持多个值，用空格分隔。可选值包括：
         * 
         * * `click`：点击时触发
         * * `hover`：鼠标悬浮时触发
         * * `focus`：聚焦时触发
         * * `manual`：只能通过编程方式打开和关闭 tooltip，不能再指定其他触发方式
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-trigger
          */
          'trigger'?: 'click' | 'hover' | 'focus' | 'manual' | string;
        /**
          * 是否禁用 tooltip
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * 是否显示 tooltip
          * @see https://www.mdui.org/zh-cn/docs/2/components/tooltip#attributes-open
          */
          'open'?: boolean;
        } & HTMLElementProps;
      /**
        * 顶部应用栏标题组件。需配合 `<mdui-top-app-bar>` 组件使用
       * 
       * ```html
       * <mdui-top-app-bar>
       *   <mdui-button-icon icon="menu"></mdui-button-icon>
       *   <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
       *   <div style="flex-grow: 1"></div>
       *   <mdui-button-icon icon="more_vert"></mdui-button-icon>
       * </mdui-top-app-bar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar
        */
        'mdui-top-app-bar-title': {
          
        } & HTMLElementProps;
      /**
        * 顶部应用栏组件
       * 
       * ```html
       * <mdui-top-app-bar>
       *   <mdui-button-icon icon="menu"></mdui-button-icon>
       *   <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
       *   <div style="flex-grow: 1"></div>
       *   <mdui-button-icon icon="more_vert"></mdui-button-icon>
       * </mdui-top-app-bar>
       * ```
        * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar
        */
        'mdui-top-app-bar': {
          /**
          * 顶部应用栏的形状。默认为 `small`。可选值包括：
         * 
         * * `center-aligned`：小型应用栏，标题居中
         * * `small`：小型应用栏
         * * `medium`：中型应用栏
         * * `large`：大型应用栏
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-variant
          */
          'variant'?: 'center-aligned' | 'small' | 'medium' | 'large';
        /**
          * 是否隐藏
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-hide
          */
          'hide'?: boolean;
        /**
          * 是否缩小为 `variant="small"` 的样式，仅在 `variant="medium"` 或 `variant="large"` 时生效
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-shrink
          */
          'shrink'?: boolean;
        /**
          * 滚动行为。可同时使用多个值，用空格分隔。可选值包括：
         * 
         * * `hide`：滚动时隐藏
         * * `shrink`：在中型、大型应用栏中可使用，滚动时缩小成小型应用栏的样式
         * * `elevate`：滚动时添加阴影
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-scroll-behavior
          */
          'scroll-behavior'?: 'hide' | 'shrink' | 'elevate';
        /**
          * 需要监听其滚动事件的元素。值可以是 CSS 选择器、DOM 元素、或 [JQ 对象](https://www.mdui.org/zh-cn/docs/2/functions/jq)。默认监听 `window` 的滚动事件
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-scroll-target
          */
          'scroll-target'?: string | HTMLElement | JQ<HTMLElement>;
        /**
          * 在滚动多少距离之后触发滚动行为，单位为 `px`
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-scroll-threshold
          */
          'scroll-threshold'?: number;
        /**
          * 该组件在 [`<mdui-layout>`](https://www.mdui.org/zh-cn/docs/2/components/layout) 中的布局顺序，按从小到大排序。默认为 `0`
          * @see https://www.mdui.org/zh-cn/docs/2/components/top-app-bar#top-app-bar-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      }
    }
  }
}
