import React from 'react';
import { JQ } from '@mdui/jq';

type HTMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        /**
        * Avatar Component 
       * 
       * ```html
       * <mdui-avatar src="https://avatars githubusercontent com/u/3030330?s=40&v=4"></mdui-avatar>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/avatar
        */
        'mdui-avatar': {
          /**
          * URL of the avatar image.
          * @see https://www.mdui.org/en/docs/2/components/avatar#attributes-src
          */
          'src'?: string;
        /**
          * Image resizing method, similar to the native CSS [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit). Possible values:
         * 
         * * `contain`: Scales the image to fit within the box while maintaining the aspect ratio. The image will be "letterboxed" if the aspect ratios do not match.
         * * `cover`: Scales the image to fill the box while maintaining the aspect ratio. The image will be clipped if the aspect ratios do not match.
         * * `fill`: Default. Scales the image to fill the box. The image will be stretched if the aspect ratios do not match.
         * * `none`: No resizing.
         * * `scale-down`: Scales as if `none` or `contain` were specified, choosing the smaller result.
          * @see https://www.mdui.org/en/docs/2/components/avatar#attributes-fit
          */
          'fit'?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
        /**
          * The Material Icons name for the avatar.
          * @see https://www.mdui.org/en/docs/2/components/avatar#attributes-icon
          */
          'icon'?: string;
        /**
          * Text description of the avatar.
          * @see https://www.mdui.org/en/docs/2/components/avatar#attributes-label
          */
          'label'?: string;
        } & HTMLElementProps;
      /**
        * Badge Component 
       * 
       * ```html
       * <mdui-badge>12</mdui-badge>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/badge
        */
        'mdui-badge': {
          /**
          * Defines the badge shape. Possible values:
         * * `small`: A small badge without text.
         * * `large`: A large badge with displayed text.
          * @see https://www.mdui.org/en/docs/2/components/badge#attributes-variant
          */
          'variant'?: 'small' | 'large';
        } & HTMLElementProps;
      /**
        * Bottom App Bar Component 
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
        * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar
        */
        'mdui-bottom-app-bar': {
          /**
          * Hides the bottom app bar when set.
          * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar#attributes-hide
          */
          'hide'?: boolean;
        /**
          * When set, detaches the [`<mdui-fab>`](https://www.mdui.org/en/docs/2/components/fab) from the bottom app bar. The [`<mdui-fab>`](https://www.mdui.org/en/docs/2/components/fab) remains on the page even after the app bar is hidden.
          * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar#attributes-fab-detach
          */
          'fab-detach'?: boolean;
        /**
          * Defines the scroll behavior. Possible values:
         * 
         * * `hide`: Hides when scrolling.
          * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar#attributes-scroll-behavior
          */
          'scroll-behavior'?: 'hide' | 'shrink' | 'elevate';
        /**
          * The element that listens for scroll events. Accepts a CSS selector, DOM element, or [JQ object](https://www.mdui.org/en/docs/2/functions/jq). Defaults to `window`.
          * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar#attributes-scroll-target
          */
          'scroll-target'?: string | HTMLElement | JQ<HTMLElement>;
        /**
          * The scroll distance (in pixels) that triggers the scroll behavior.
          * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar#attributes-scroll-threshold
          */
          'scroll-threshold'?: number;
        /**
          * Specifies the layout order within the [`<mdui-layout>`](https://www.mdui.org/en/docs/2/components/layout) component. Items are sorted in ascending order. The default value is `0`.
          * @see https://www.mdui.org/en/docs/2/components/bottom-app-bar#attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * Icon Button Component 
       * 
       * ```html
       * <mdui-button-icon icon="search"></mdui-button-icon>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/button-icon
        */
        'mdui-button-icon': {
          /**
          * Defines the icon button style. Possible values:
         * * `standard`: For low-priority actions.
         * * `filled`: Has the strongest visual effect, suitable for high-priority actions.
         * * `tonal`: A visual effect between `filled` and `outlined`, suitable for medium to high-priority actions.
         * * `outlined`: For medium-priority actions.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-variant
          */
          'variant'?: 'standard' | 'filled' | 'tonal' | 'outlined';
        /**
          * Specifies the Material Icons name. Alternatively, use the default slot.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-icon
          */
          'icon'?: string;
        /**
          * Specifies the Material Icons name when selected. Alternatively, use `slot="selected-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * Indicates if the button is selectable.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-selectable
          */
          'selectable'?: boolean;
        /**
          * Indicates if the button is selected.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-selected
          */
          'selected'?: boolean;
        /**
          * The URL for the hyperlink. If specified, the component renders as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to treat the linked URL as a download.
         * 
         * **Note**:  This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-download
          */
          'download'?: string;
        /**
          * Defines where to display the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent exists.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors exist.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: Author of the current document or article.
         * * `bookmark`: Permanent link for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: Link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Disables the element.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Indicates that the element is in a loading state.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-loading
          */
          'loading'?: boolean;
        /**
          * The button's name, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-name
          */
          'name'?: string;
        /**
          * The button's value, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-value
          */
          'value'?: string;
        /**
          * Defines the button's default behavior. The default is `button`. Possible values:
         * 
         * * `submit`: Submits the form data to the server.
         * * `reset`: Resets all the controls to their initial values.
         * * `button`: No default behavior, does nothing when pressed by default.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * Associates the button with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the button is associated with its parent `<form>`, if any.
         * 
         * This attribute allows button elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
         * 
         * **Note**: Only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-form
          */
          'form'?: string;
        /**
          * Specifies the URL that processes the button's submitted information. Overrides the `action` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-formaction
          */
          'formaction'?: string;
        /**
          * Specifies the form data encoding method. Possible values:
         * 
         * * `application/x-www-form-urlencoded`: Default if the attribute is not used.
         * * `multipart/form-data`: Used for `<input>` elements with `type` set to `file`.
         * * `text/plain`: For debugging, not for real form submission.
         * 
         * Overrides the `enctype` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * Specifies the HTTP method for form submission. Possible values:
         * 
         * * `post`: Form data included in HTTP request body.
         * * `get`: Form data appended to `action` URL.
         * 
         * Overrides the `method` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * Specifies that the form should not be validated on submission. Overrides the `novalidate` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * Specifies where to display the form submission response. Possible values:
         * 
         * * `_self`: Current browsing context. (Default).
         * * `_blank`: New tab or window.
         * * `_parent`: Parent browsing context or `_self` if no parent.
         * * `_top`: Topmost browsing context or `_self` if no ancestors.
         * 
         * Overrides the `target` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button-icon#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * Button Component 
       * 
       * ```html
       * <mdui-button>Button</mdui-button>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/button
        */
        'mdui-button': {
          /**
          * Defines the button style. Possible values:
         * * `elevated`: A shadowed button for visual distinction.
         * * `filled`: Used for final actions like 'Save' or 'Confirm'.
         * * `tonal`: A mix between `filled` and `outlined`, suitable for medium to high-priority actions.
         * * `outlined`: A bordered button for medium-priority and secondary actions.
         * * `text`: A text button for low-priority actions.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-variant
          */
          'variant'?: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';
        /**
          * If set, the button will fill the width of its parent element.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-full-width
          */
          'full-width'?: boolean;
        /**
          * Specifies the Material Icons name on the left. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-icon
          */
          'icon'?: string;
        /**
          * Specifies the Material Icons name on the right. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * The URL for the hyperlink. If provided, the component is rendered as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to download the linked URL.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-download
          */
          'download'?: string;
        /**
          * Defines where to open the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: The author of the current document or article.
         * * `bookmark`: The permalink for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: A link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Specifies that the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Defines the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Disables the element.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Indicates that the element is in a loading state.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-loading
          */
          'loading'?: boolean;
        /**
          * The button's name, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-name
          */
          'name'?: string;
        /**
          * The button's value, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-value
          */
          'value'?: string;
        /**
          * Defines the button's default behavior. The default is `button`. Possible values:
         * 
         * * `submit`: Submits the form data to the server.
         * * `reset`: Resets all the controls to their initial values.
         * * `button`: No default behavior, does nothing when pressed by default.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * Associates the button with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the button is associated with its parent `<form>`, if any.
         * 
         * This attribute allows button elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
         * 
         * **Note**: Only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-form
          */
          'form'?: string;
        /**
          * Specifies the URL that processes the button's submitted information. Overrides the `action` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-formaction
          */
          'formaction'?: string;
        /**
          * Specifies the form data encoding method. Possible values:
         * 
         * * `application/x-www-form-urlencoded`: Default if the attribute is not used.
         * * `multipart/form-data`: Used for `<input>` elements with `type` set to `file`.
         * * `text/plain`: For debugging, not for real form submission.
         * 
         * Overrides the `enctype` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * Specifies the HTTP method for form submission. Possible values:
         * 
         * * `post`: Form data included in HTTP request body.
         * * `get`: Form data appended to `action` URL.
         * 
         * Overrides the `method` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * Specifies that the form should not be validated on submission. Overrides the `novalidate` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * Specifies where to display the form submission response. Possible values:
         * 
         * * `_self`: Current browsing context. (Default).
         * * `_blank`: New tab or window.
         * * `_parent`: Parent browsing context or `_self` if no parent.
         * * `_top`: Topmost browsing context or `_self` if no ancestors.
         * 
         * Overrides the `target` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/button#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * Card Component 
       * 
       * ```html
       * <mdui-card>card content</mdui-card>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/card
        */
        'mdui-card': {
          /**
          * Defines the card style. Possible values:
         * * `elevated`: Shadowed, providing more visual separation from the background than `filled`, but less than `outlined`.
         * * `filled`: Provides minimal visual separation from the background.
         * * `outlined`: Bordered, providing maximum visual separation from the background.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-variant
          */
          'variant'?: 'elevated' | 'filled' | 'outlined';
        /**
          * Makes the card clickable. When set, a mouse hover effect and click ripple effect are added.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-clickable
          */
          'clickable'?: boolean;
        /**
          * Disables the card.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * The URL for the hyperlink. If specified, the component renders as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to treat the linked URL as a download.
         * 
         * **Note**:  This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-download
          */
          'download'?: string;
        /**
          * Defines where to display the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent exists.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors exist.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: Author of the current document or article.
         * * `bookmark`: Permanent link for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: Link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/card#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Checkbox Component 
       * 
       * ```html
       * <mdui-checkbox>Checkbox</mdui-checkbox>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/checkbox
        */
        'mdui-checkbox': {
          /**
          * Dsiables the checkbox.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Sets the checkbox to the checked state.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-checked
          */
          'checked'?: boolean;
        /**
          * Sets the checkbox to an indeterminate state.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-indeterminate
          */
          'indeterminate'?: boolean;
        /**
          * Requires the checkbox to be checked for form submission.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-required
          */
          'required'?: boolean;
        /**
          * Associates the checkbox with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the checkbox is associated with its parent `<form>`, if any.
         * 
         * This attribute allows checkbox elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-form
          */
          'form'?: string;
        /**
          * Sets the checkbox's name, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-name
          */
          'name'?: string;
        /**
          * Sets the checkbox's value, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-value
          */
          'value'?: string;
        /**
          * Sets the Material Icons name for the unchecked state. Alternatively, use `slot="unchecked-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-unchecked-icon
          */
          'unchecked-icon'?: string;
        /**
          * Sets the Material Icons name for the checked state. Alternatively, use `slot="checked-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-checked-icon
          */
          'checked-icon'?: string;
        /**
          * Sets the Material Icons name for the indeterminate state. Alternatively, use `slot="indeterminate-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-indeterminate-icon
          */
          'indeterminate-icon'?: string;
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/checkbox#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Chip Component 
       * 
       * ```html
       * <mdui-chip>Chip</mdui-chip>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/chip
        */
        'mdui-chip': {
          /**
          * Defines the chip type. Possible values:
         * 
         * * `assist`: Displays auxiliary actions related to the context, such as sharing and favoriting on a meal ordering page.
         * * `filter`: Filters content, like search results on a search results page.
         * * `input`: Represents fragments of user input, such as contacts in the 'To' field in Gmail.
         * * `suggestion`: Provides dynamically generated suggestions to simplify user actions, like message predictions in a chat application.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-variant
          */
          'variant'?: 'assist' | 'filter' | 'input' | 'suggestion';
        /**
          * Gives the chip a shadow.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-elevated
          */
          'elevated'?: boolean;
        /**
          * Makes the chip selectable.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-selectable
          */
          'selectable'?: boolean;
        /**
          * Marks the chip as selected.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-selected
          */
          'selected'?: boolean;
        /**
          * Makes the chip deletable. When set, a delete icon appears on the right.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-deletable
          */
          'deletable'?: boolean;
        /**
          * Sets the Material Icons name for the left icon. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-icon
          */
          'icon'?: string;
        /**
          * Sets the Material Icons name for the left icon when selected. Alternatively, use `slot="selected-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * Sets the Material Icons name for the right icon. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * Sets the Material Icons name for the delete icon when deletable. Alternatively, use `slot="delete-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-delete-icon
          */
          'delete-icon'?: string;
        /**
          * The URL for the hyperlink. If provided, the component is rendered as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to download the linked URL.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-download
          */
          'download'?: string;
        /**
          * Defines where to open the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: The author of the current document or article.
         * * `bookmark`: The permalink for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: A link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Specifies that the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Defines the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Disables the element.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Indicates that the element is in a loading state.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-loading
          */
          'loading'?: boolean;
        /**
          * The button's name, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-name
          */
          'name'?: string;
        /**
          * The button's value, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-value
          */
          'value'?: string;
        /**
          * Defines the button's default behavior. The default is `button`. Possible values:
         * 
         * * `submit`: Submits the form data to the server.
         * * `reset`: Resets all the controls to their initial values.
         * * `button`: No default behavior, does nothing when pressed by default.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * Associates the button with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the button is associated with its parent `<form>`, if any.
         * 
         * This attribute allows button elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
         * 
         * **Note**: Only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-form
          */
          'form'?: string;
        /**
          * Specifies the URL that processes the button's submitted information. Overrides the `action` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-formaction
          */
          'formaction'?: string;
        /**
          * Specifies the form data encoding method. Possible values:
         * 
         * * `application/x-www-form-urlencoded`: Default if the attribute is not used.
         * * `multipart/form-data`: Used for `<input>` elements with `type` set to `file`.
         * * `text/plain`: For debugging, not for real form submission.
         * 
         * Overrides the `enctype` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * Specifies the HTTP method for form submission. Possible values:
         * 
         * * `post`: Form data included in HTTP request body.
         * * `get`: Form data appended to `action` URL.
         * 
         * Overrides the `method` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * Specifies that the form should not be validated on submission. Overrides the `novalidate` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * Specifies where to display the form submission response. Possible values:
         * 
         * * `_self`: Current browsing context. (Default).
         * * `_blank`: New tab or window.
         * * `_parent`: Parent browsing context or `_self` if no parent.
         * * `_top`: Topmost browsing context or `_self` if no ancestors.
         * 
         * Overrides the `target` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/chip#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * Circular Progress Component 
       * 
       * ```html
       * <mdui-circular-progress></mdui-circular-progress>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/circular-progress
        */
        'mdui-circular-progress': {
          /**
          * Sets the maximum value for the progress indicator. The default value is `1`.
          * @see https://www.mdui.org/en/docs/2/components/circular-progress#attributes-max
          */
          'max'?: number;
        /**
          * Sets the current value of the progress indicator. If not specified, the progress indicator is in an indeterminate state.
          * @see https://www.mdui.org/en/docs/2/components/circular-progress#attributes-value
          */
          'value'?: number;
        } & HTMLElementProps;
      /**
        * Collapse Item Component  It should be used in conjunction with the `<mdui-collapse>` component 
       * 
       * ```html
       * <mdui-collapse>
       *   <mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
       *   <mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
       * </mdui-collapse>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/collapse
        */
        'mdui-collapse-item': {
          /**
          * Specifies the value of the collapsible panel item.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-item-attributes-value
          */
          'value'?: string;
        /**
          * Sets the header text for the collapsible panel item.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-item-attributes-header
          */
          'header'?: string;
        /**
          * Disables the collapsible panel item.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-item-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Identifies the element that triggers the collapse on click. This can be a CSS selector, a DOM element, or a [JQ object](https://www.mdui.org/en/docs/2/functions/jq). By default, the entire header area is the trigger.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-item-attributes-trigger
          */
          'trigger'?: string | HTMLElement | JQ<HTMLElement>;
        } & HTMLElementProps;
      /**
        * Collapse Panel Component  It should be used in conjunction with the `<mdui-collapse-item>` component 
       * 
       * ```html
       * <mdui-collapse>
       *   <mdui-collapse-item header="header-1">content-1</mdui-collapse-item>
       *   <mdui-collapse-item header="header-2">content-2</mdui-collapse-item>
       * </mdui-collapse>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/collapse
        */
        'mdui-collapse': {
          /**
          * Activates accordion mode.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-attributes-accordion
          */
          'accordion'?: boolean;
        /**
          * Specifies the open `<mdui-collapse-item>` value.
         * 
         * Note: The HTML attribute is always a string and can only be initially set when `accordion` is `true`. The JavaScript property value is a string when `accordion` is `true` and a string array when `accordion` is `false`. To modify this value when `accordion` is `false`, you must change the JavaScript property.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-attributes-value
          */
          'value'?: string | string[];
        /**
          * Disables the collapsible panel.
          * @see https://www.mdui.org/en/docs/2/components/collapse#collapse-attributes-disabled
          */
          'disabled'?: boolean;
        } & HTMLElementProps;
      /**
        * Dialog Component 
       * 
       * ```html
       * <mdui-dialog>content</mdui-dialog>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/dialog
        */
        'mdui-dialog': {
          /**
          * Sets the Material Icons name for the top icon. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-icon
          */
          'icon'?: string;
        /**
          * Sets the dialog title. Alternatively, use `slot="headline"`.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-headline
          */
          'headline'?: string;
        /**
          * Sets the text below the title. Alternatively, use `slot="description"`.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-description
          */
          'description'?: string;
        /**
          * Opens the dialog.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-open
          */
          'open'?: boolean;
        /**
          * Sets the dialog to full-screen.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-fullscreen
          */
          'fullscreen'?: boolean;
        /**
          * Closes the dialog when the ESC key is pressed.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-close-on-esc
          */
          'close-on-esc'?: boolean;
        /**
          * Closes the dialog when the overlay is clicked.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-close-on-overlay-click
          */
          'close-on-overlay-click'?: boolean;
        /**
          * Stacks the bottom action buttons vertically.
          * @see https://www.mdui.org/en/docs/2/components/dialog#attributes-stacked-actions
          */
          'stacked-actions'?: boolean;
        } & HTMLElementProps;
      /**
        * Divider Component 
       * 
       * ```html
       * <mdui-divider></mdui-divider>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/divider
        */
        'mdui-divider': {
          /**
          * Displays the divider vertically.
          * @see https://www.mdui.org/en/docs/2/components/divider#attributes-vertical
          */
          'vertical'?: boolean;
        /**
          * Adds an inset from the left side.
          * @see https://www.mdui.org/en/docs/2/components/divider#attributes-inset
          */
          'inset'?: boolean;
        /**
          * Adds insets from both the left and right sides.
          * @see https://www.mdui.org/en/docs/2/components/divider#attributes-middle
          */
          'middle'?: boolean;
        } & HTMLElementProps;
      /**
        * Dropdown Component 
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
        * @see https://www.mdui.org/en/docs/2/components/dropdown
        */
        'mdui-dropdown': {
          /**
          * Opens the dropdown.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-open
          */
          'open'?: boolean;
        /**
          * Disables the dropdown.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Defines the trigger method for the dropdown. Supports multiple space-separated values. Possible values:
         * 
         * * `click`: Trigger on click.
         * * `hover`: Trigger on mouse hover.
         * * `focus`: Trigger on focus.
         * * `contextmenu`: Trigger on right-click or touch long press.
         * * `manual`: If used, the dropdown can only be opened and closed programmatically, and no other trigger methods can be specified.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-trigger
          */
          'trigger'?: 'click' | 'hover' | 'focus' | 'contextmenu' | 'manual' | string;
        /**
          * Sets the position of the dropdown. Possible values:
         * 
         * * `auto`: Automatically determine the position.
         * * `top-start`: Above and left-aligned.
         * * `top`: Above and centered.
         * * `top-end`: Above and right-aligned.
         * * `bottom-start`: Below and left-aligned.
         * * `bottom`: Below and centered.
         * * `bottom-end`: Below and right-aligned.
         * * `left-start`: Left and top-aligned.
         * * `left`: Left and centered.
         * * `left-end`: Left and bottom-aligned.
         * * `right-start`: Right and top-aligned.
         * * `right`: Right and centered.
         * * `right-end`: Right and bottom-aligned.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-placement
          */
          'placement'?: 'auto' | 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end';
        /**
          * Keeps the dropdown open after clicking an [`<mdui-menu-item>`](https://www.mdui.org/en/docs/2/components/menu#menu-item-api).
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-stay-open-on-click
          */
          'stay-open-on-click'?: boolean;
        /**
          * Sets the delay (in ms) for opening the dropdown on hover.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-open-delay
          */
          'open-delay'?: number;
        /**
          * Sets the delay (in ms) for closing the dropdown on hover.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-close-delay
          */
          'close-delay'?: number;
        /**
          * Opens the dropdown at the cursor position. This is typically used for context menus.
          * @see https://www.mdui.org/en/docs/2/components/dropdown#attributes-open-on-pointer
          */
          'open-on-pointer'?: boolean;
        } & HTMLElementProps;
      /**
        * Floating Action Button Component 
       * 
       * ```html
       * <mdui-fab icon="edit"></mdui-fab>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/fab
        */
        'mdui-fab': {
          /**
          * Sets the FAB color. Possible values:
         * 
         * * `primary`: Uses the primary container background color.
         * * `surface`: Uses the surface container high background color.
         * * `secondary`: Uses the secondary container background color.
         * * `tertiary`: Uses the tertiary container background color.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-variant
          */
          'variant'?: 'primary' | 'surface' | 'secondary' | 'tertiary';
        /**
          * Sets the FAB size. Possible values:
         * * `normal`: Sets the FAB to a normal size.
         * * `small`: Sets the FAB to a small size.
         * * `large`: Sets the FAB to a large size.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-size
          */
          'size'?: 'normal' | 'small' | 'large';
        /**
          * Sets the Material Icons name. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-icon
          */
          'icon'?: string;
        /**
          * Indicates if the FAB is in the extended state.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-extended
          */
          'extended'?: boolean;
        /**
          * The URL for the hyperlink. If provided, the component is rendered as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to download the linked URL.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-download
          */
          'download'?: string;
        /**
          * Defines where to open the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: The author of the current document or article.
         * * `bookmark`: The permalink for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: A link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Specifies that the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Defines the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Disables the element.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Indicates that the element is in a loading state.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-loading
          */
          'loading'?: boolean;
        /**
          * The button's name, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-name
          */
          'name'?: string;
        /**
          * The button's value, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-value
          */
          'value'?: string;
        /**
          * Defines the button's default behavior. The default is `button`. Possible values:
         * 
         * * `submit`: Submits the form data to the server.
         * * `reset`: Resets all the controls to their initial values.
         * * `button`: No default behavior, does nothing when pressed by default.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * Associates the button with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the button is associated with its parent `<form>`, if any.
         * 
         * This attribute allows button elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
         * 
         * **Note**: Only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-form
          */
          'form'?: string;
        /**
          * Specifies the URL that processes the button's submitted information. Overrides the `action` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-formaction
          */
          'formaction'?: string;
        /**
          * Specifies the form data encoding method. Possible values:
         * 
         * * `application/x-www-form-urlencoded`: Default if the attribute is not used.
         * * `multipart/form-data`: Used for `<input>` elements with `type` set to `file`.
         * * `text/plain`: For debugging, not for real form submission.
         * 
         * Overrides the `enctype` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * Specifies the HTTP method for form submission. Possible values:
         * 
         * * `post`: Form data included in HTTP request body.
         * * `get`: Form data appended to `action` URL.
         * 
         * Overrides the `method` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * Specifies that the form should not be validated on submission. Overrides the `novalidate` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * Specifies where to display the form submission response. Possible values:
         * 
         * * `_self`: Current browsing context. (Default).
         * * `_blank`: New tab or window.
         * * `_parent`: Parent browsing context or `_self` if no parent.
         * * `_top`: Topmost browsing context or `_self` if no ancestors.
         * 
         * Overrides the `target` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/fab#attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * Icon Component 
       * 
       * ```html
       * <mdui-icon name="search"></mdui-icon>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/icon
        */
        'mdui-icon': {
          /**
          * Specifies the name of the Material Icons.
          * @see https://www.mdui.org/en/docs/2/components/icon#attributes-name
          */
          'name'?: string;
        /**
          * Specifies the path of the SVG icon.
          * @see https://www.mdui.org/en/docs/2/components/icon#attributes-src
          */
          'src'?: string;
        } & HTMLElementProps;
      /**
        * Layout Item Component 
       * 
       * ```html
       * <mdui-layout>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-main></mdui-layout-main>
       * </mdui-layout>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/layout
        */
        'mdui-layout-item': {
          /**
          * Determines the component's position. Possible values:
         * 
         * * `top`: Positions the component at the top.
         * * `bottom`: Positions the component at the bottom.
         * * `left`: Positions the component on the left.
         * * `right`: Positions the component on the right.
          * @see https://www.mdui.org/en/docs/2/components/layout#layout-item-attributes-placement
          */
          'placement'?: 'top' | 'bottom' | 'left' | 'right';
        /**
          * Specifies the layout order within the [`<mdui-layout>`](https://www.mdui.org/en/docs/2/components/layout) component. Items are sorted in ascending order. The default value is `0`.
          * @see https://www.mdui.org/en/docs/2/components/layout#layout-item-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * Layout Main Component 
       * 
       * ```html
       * <mdui-layout>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-main></mdui-layout-main>
       * </mdui-layout>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/layout
        */
        'mdui-layout-main': {
          
        } & HTMLElementProps;
      /**
        * Layout Component 
       * 
       * ```html
       * <mdui-layout>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-item></mdui-layout-item>
       *   <mdui-layout-main></mdui-layout-main>
       * </mdui-layout>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/layout
        */
        'mdui-layout': {
          /**
          * Sets the layout height to 100%.
          * @see https://www.mdui.org/en/docs/2/components/layout#layout-attributes-full-height
          */
          'full-height'?: boolean;
        } & HTMLElementProps;
      /**
        * Linear Progress Component 
       * 
       * ```html
       * <mdui-linear-progress></mdui-linear-progress>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/linear-progress
        */
        'mdui-linear-progress': {
          /**
          * Sets the maximum value for the progress indicator. The default value is `1`.
          * @see https://www.mdui.org/en/docs/2/components/linear-progress#attributes-max
          */
          'max'?: number;
        /**
          * Sets the current value of the progress indicator. If not specified, the progress indicator is in an indeterminate state.
          * @see https://www.mdui.org/en/docs/2/components/linear-progress#attributes-value
          */
          'value'?: number;
        } & HTMLElementProps;
      /**
        * List Item Component  It should be used in conjunction with the `<mdui-list>` component 
       * 
       * ```html
       * <mdui-list>
       *   <mdui-list-subheader>Subheader</mdui-list-subheader>
       *   <mdui-list-item>Item 1</mdui-list-item>
       *   <mdui-list-item>Item 2</mdui-list-item>
       * </mdui-list>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/list
        */
        'mdui-list-item': {
          /**
          * Main text. Alternatively, use the default slot.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-headline
          */
          'headline'?: string;
        /**
          * Line limit for main text. Truncates after exceeding. Default is no limit. Possible values:
         * 
         * * `1`: Single-line text, truncates after exceeding
         * * `2`: Double-line text, truncates after exceeding.
         * * `3`: Triple-line text, truncates after exceeding.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-headline-line
          */
          'headline-line'?: 1 | 2 | 3;
        /**
          * Subtext. Alternatively, use `slot="description"`.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-description
          */
          'description'?: string;
        /**
          * Line limit for subtext. Truncates after exceeding. Default is no limit. Possible values:
         * 
         * * `1`: Single-line text, truncates after exceeding
         * * `2`: Double-line text, truncates after exceeding.
         * * `3`: Triple-line text, truncates after exceeding.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-description-line
          */
          'description-line'?: 1 | 2 | 3;
        /**
          * Material Icons name on the left. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-icon
          */
          'icon'?: string;
        /**
          * Material Icons name on the right. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * Disables the list item. Grays out the item and disables elements like [`<mdui-checkbox>`](https://www.mdui.org/en/docs/2/components/checkbox), [`<mdui-radio>`](https://www.mdui.org/en/docs/2/components/radio), [`<mdui-switch>`](https://www.mdui.org/en/docs/2/components/switch).
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Activates the list item.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-active
          */
          'active'?: boolean;
        /**
          * Makes the list item non-clickable. Elements like [`<mdui-checkbox>`](https://www.mdui.org/en/docs/2/components/checkbox), [`<mdui-radio>`](https://www.mdui.org/en/docs/2/components/radio), [`<mdui-switch>`](https://www.mdui.org/en/docs/2/components/switch) remain interactive.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-nonclickable
          */
          'nonclickable'?: boolean;
        /**
          * Applies rounded style to the list item.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-rounded
          */
          'rounded'?: boolean;
        /**
          * Vertical alignment of the list item. Possible values:
         * 
         * * `start`: Top alignment.
         * * `center`: Center alignment.
         * * `end`: Bottom alignment.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-alignment
          */
          'alignment'?: 'start' | 'center' | 'end';
        /**
          * The URL for the hyperlink. If specified, the component renders as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to treat the linked URL as a download.
         * 
         * **Note**:  This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-download
          */
          'download'?: string;
        /**
          * Defines where to display the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent exists.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors exist.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: Author of the current document or article.
         * * `bookmark`: Permanent link for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: Link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/list#list-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * List Subheader Component  It should be used in conjunction with the `<mdui-list>` component 
       * 
       * ```html
       * <mdui-list>
       *   <mdui-list-subheader>Subheader</mdui-list-subheader>
       *   <mdui-list-item>Item 1</mdui-list-item>
       *   <mdui-list-item>Item 2</mdui-list-item>
       * </mdui-list>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/list
        */
        'mdui-list-subheader': {
          
        } & HTMLElementProps;
      /**
        * List Component  It should be used in conjunction with the `<mdui-list-item>` component 
       * 
       * ```html
       * <mdui-list>
       *   <mdui-list-subheader>Subheader</mdui-list-subheader>
       *   <mdui-list-item>Item 1</mdui-list-item>
       *   <mdui-list-item>Item 2</mdui-list-item>
       * </mdui-list>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/list
        */
        'mdui-list': {
          
        } & HTMLElementProps;
      /**
        * Menu Item Component 
       * 
       * ```html
       * <mdui-menu>
       *   <mdui-menu-item>Item 1</mdui-menu-item>
       *   <mdui-menu-item>Item 2</mdui-menu-item>
       * </mdui-menu>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/menu
        */
        'mdui-menu-item': {
          /**
          * The value of the menu item.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-value
          */
          'value'?: string;
        /**
          * Disables the menu item.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Specifies the Material Icons name for the left icon. Alternatively, use `slot="icon"`. An empty string reserves space for an icon.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-icon
          */
          'icon'?: string;
        /**
          * Specifies the Material Icons name for the right icon. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * Specifies the right text. Alternatively, use `slot="end-text"`.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-end-text
          */
          'end-text'?: string;
        /**
          * Specifies the Material Icons name for the selected state. Alternatively, use `slot="selected-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * Opens the submenu.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-submenu-open
          */
          'submenu-open'?: boolean;
        /**
          * The URL for the hyperlink. If specified, the component renders as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to treat the linked URL as a download.
         * 
         * **Note**:  This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-download
          */
          'download'?: string;
        /**
          * Defines where to display the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent exists.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors exist.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: Author of the current document or article.
         * * `bookmark`: Permanent link for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: Link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Menu Component  It should be used in conjunction with the `<mdui-menu-item>` component 
       * 
       * ```html
       * <mdui-menu>
       *   <mdui-menu-item>Item 1</mdui-menu-item>
       *   <mdui-menu-item>Item 2</mdui-menu-item>
       * </mdui-menu>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/menu
        */
        'mdui-menu': {
          /**
          * Defines the selectable state of menu items. Defaults to non-selectable. Possible values:
         * 
         * * `single`: Only one item can be selected at a time.
         * * `multiple`: Multiple items can be selected.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-attributes-selects
          */
          'selects'?: 'single' | 'multiple';
        /**
          * The value of the selected `<mdui-menu-item>`.
         * 
         * Note: The HTML attribute is always a string and can only be set as an initial value when `selects="single"`. The JavaScript property value is a string when `selects="single"` and an array of strings when `selects="multiple"`. In `selects="multiple"`, this value can only be modified by changing the JavaScript property.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-attributes-value
          */
          'value'?: string | string[];
        /**
          * Indicates whether the menu items use a compact layout.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-attributes-dense
          */
          'dense'?: boolean;
        /**
          * Defines the trigger method for submenus. Supports multiple values separated by spaces. Possible values:
         * 
         * * `click`: Open submenu when clicking on a menu item.
         * * `hover`: Open submenu when hovering over a menu item.
         * * `focus`: Open submenu when focusing on a menu item.
         * * `manual`: Only programmatically open and close submenus, no other trigger methods can be specified.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-attributes-submenu-trigger
          */
          'submenu-trigger'?: 'click' | 'hover' | 'focus' | 'manual' | string;
        /**
          * Specifies the delay (in milliseconds) for opening a submenu via hover.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-attributes-submenu-open-delay
          */
          'submenu-open-delay'?: number;
        /**
          * Specifies the delay (in milliseconds) for closing a submenu via hover.
          * @see https://www.mdui.org/en/docs/2/components/menu#menu-attributes-submenu-close-delay
          */
          'submenu-close-delay'?: number;
        } & HTMLElementProps;
      /**
        * Navigation Bar Item Component  It should be used in conjunction with the `<mdui-navigation-bar>` component 
       * 
       * ```html
       * <mdui-navigation-bar>
       *   <mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
       * </mdui-navigation-bar>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/navigation-bar
        */
        'mdui-navigation-bar-item': {
          /**
          * Specifies the Material Icons name for the inactive state. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-icon
          */
          'icon'?: string;
        /**
          * Specifies the Material Icons name for the active state. Alternatively, use `slot="active-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-active-icon
          */
          'active-icon'?: string;
        /**
          * The value of the navigation item.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-value
          */
          'value'?: string;
        /**
          * The URL for the hyperlink. If specified, the component renders as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to treat the linked URL as a download.
         * 
         * **Note**:  This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-download
          */
          'download'?: string;
        /**
          * Defines where to display the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent exists.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors exist.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: Author of the current document or article.
         * * `bookmark`: Permanent link for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: Link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Navigation Bar Component  It should be used in conjunction with the `<mdui-navigation-bar-item>` component 
       * 
       * ```html
       * <mdui-navigation-bar>
       *   <mdui-navigation-bar-item icon="place">Item 1</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="commute">Item 2</mdui-navigation-bar-item>
       *   <mdui-navigation-bar-item icon="people">Item 3</mdui-navigation-bar-item>
       * </mdui-navigation-bar>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/navigation-bar
        */
        'mdui-navigation-bar': {
          /**
          * Hides the navigation bar when set.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-hide
          */
          'hide'?: boolean;
        /**
          * Specifies the visibility of the text. Possible values:
         * 
         * * `auto`: Visible if there are 3 or fewer options, otherwise only the selected state is visible.
         * * `selected`: Only visible in the selected state.
         * * `labeled`: Always visible.
         * * `unlabeled`: Never visible.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-label-visibility
          */
          'label-visibility'?: 'auto' | 'selected' | 'labeled' | 'unlabeled';
        /**
          * The value of the selected `<mdui-navigation-bar-item>`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-value
          */
          'value'?: string;
        /**
          * Defines the scroll behavior. Possible values:
         * 
         * * `hide`: Hides when scrolling.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-scroll-behavior
          */
          'scroll-behavior'?: 'hide' | 'shrink' | 'elevate';
        /**
          * The element that listens for scroll events. Accepts a CSS selector, DOM element, or [JQ object](https://www.mdui.org/en/docs/2/functions/jq). Defaults to `window`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-scroll-target
          */
          'scroll-target'?: string | HTMLElement | JQ<HTMLElement>;
        /**
          * The scroll distance (in pixels) that triggers the scroll behavior.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-scroll-threshold
          */
          'scroll-threshold'?: number;
        /**
          * Specifies the layout order within the [`<mdui-layout>`](https://www.mdui.org/en/docs/2/components/layout) component. Items are sorted in ascending order. The default value is `0`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-bar#navigation-bar-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * Navigation Drawer Component 
       * 
       * ```html
       * <mdui-navigation-drawer>content</mdui-navigation-drawer>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/navigation-drawer
        */
        'mdui-navigation-drawer': {
          /**
          * Opens the navigation drawer.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-open
          */
          'open'?: boolean;
        /**
          * Displays an overlay when open.
         * 
         * On narrow devices (screen width < [`--mdui-breakpoint-md`](https://www.mdui.org/en/docs/2/styles/design-tokens#breakpoint)), the overlay always displays.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-modal
          */
          'modal'?: boolean;
        /**
          * Closes the drawer when the ESC key is pressed and an overlay is present.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-close-on-esc
          */
          'close-on-esc'?: boolean;
        /**
          * Closes the drawer when the overlay is clicked.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-close-on-overlay-click
          */
          'close-on-overlay-click'?: boolean;
        /**
          * Sets the drawer's display position. Possible values:
         * 
         * * `left`: Display on the left side.
         * * `right`: Display on the right side.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-placement
          */
          'placement'?: 'left' | 'right';
        /**
          * By default, the navigation drawer displays relative to the `body` element. When set, it displays relative to its parent element.
         * 
         * Note: You must add `position: relative; overflow: hidden;` style to the parent element when this attribute is set.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-contained
          */
          'contained'?: boolean;
        /**
          * Specifies the layout order within the [`<mdui-layout>`](https://www.mdui.org/en/docs/2/components/layout) component. Items are sorted in ascending order. The default value is `0`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-drawer#attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * Navigation Rail Item Component  It should be used in conjunction with the `<mdui-navigation-rail>` component 
       * 
       * ```html
       * <mdui-navigation-rail>
       *   <mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
       * </mdui-navigation-rail>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/navigation-rail
        */
        'mdui-navigation-rail-item': {
          /**
          * Specifies the Material Icons name for the inactive state. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-icon
          */
          'icon'?: string;
        /**
          * Specifies the Material Icons name for the active state. Alternatively, use `slot="active-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-active-icon
          */
          'active-icon'?: string;
        /**
          * The value of the navigation item.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-value
          */
          'value'?: string;
        /**
          * The URL for the hyperlink. If specified, the component renders as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to treat the linked URL as a download.
         * 
         * **Note**:  This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-download
          */
          'download'?: string;
        /**
          * Defines where to display the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent exists.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors exist.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: Author of the current document or article.
         * * `bookmark`: Permanent link for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: Link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-item-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Navigation Rail Component  It should be used in conjunction with the `<mdui-navigation-rail-item>` component 
       * 
       * ```html
       * <mdui-navigation-rail>
       *   <mdui-navigation-rail-item icon="watch_later">Recent</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="image">Images</mdui-navigation-rail-item>
       *   <mdui-navigation-rail-item icon="library_music">Library</mdui-navigation-rail-item>
       * </mdui-navigation-rail>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/navigation-rail
        */
        'mdui-navigation-rail': {
          /**
          * The value of the selected `<mdui-navigation-rail-item>`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-attributes-value
          */
          'value'?: string;
        /**
          * Sets the navigation bar's position. Possible values:
         * 
         * * `left`: Display on the left.
         * * `right`: Display on the right.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-attributes-placement
          */
          'placement'?: 'left' | 'right';
        /**
          * Sets the alignment of `<mdui-navigation-rail-item>`. Possible values:
         * 
         * * `start`: Aligns to the top.
         * * `center`: Aligns to the center.
         * * `end`: Aligns to the bottom.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-attributes-alignment
          */
          'alignment'?: 'start' | 'center' | 'end';
        /**
          * By default, the navigation rail displays relative to the `body` element. When set, it displays relative to its parent element.
         * 
         * Note: You must add `position: relative; overflow: hidden;` style to the parent element when this attribute is set.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-attributes-contained
          */
          'contained'?: boolean;
        /**
          * Adds a divider between the navigation bar and the page content.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-attributes-divider
          */
          'divider'?: boolean;
        /**
          * Specifies the layout order within the [`<mdui-layout>`](https://www.mdui.org/en/docs/2/components/layout) component. Items are sorted in ascending order. The default value is `0`.
          * @see https://www.mdui.org/en/docs/2/components/navigation-rail#navigation-rail-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      /**
        * Radio Group Component  It should be used in conjunction with the `<mdui-radio>` component 
       * 
       * ```html
       * <mdui-radio-group value="chinese">
       *   <mdui-radio value="chinese">Chinese</mdui-radio>
       *   <mdui-radio value="english">English</mdui-radio>
       * </mdui-radio-group>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/radio
        */
        'mdui-radio-group': {
          /**
          * Disables the radio group when set.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-group-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Associates the radio group with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the radio group is associated with its parent `<form>`, if any.
         * 
         * This attribute allows radio group elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-group-attributes-form
          */
          'form'?: string;
        /**
          * The name of the radio group, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-group-attributes-name
          */
          'name'?: string;
        /**
          * The value of the selected radio button, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-group-attributes-value
          */
          'value'?: string;
        /**
          * Requires a radio selection when the form is submitted.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-group-attributes-required
          */
          'required'?: boolean;
        } & HTMLElementProps;
      /**
        * Radio Component  It should be used in conjunction with the `<mdui-radio-group>` component 
       * 
       * ```html
       * <mdui-radio-group value="chinese">
       *   <mdui-radio value="chinese">Chinese</mdui-radio>
       *   <mdui-radio value="english">English</mdui-radio>
       * </mdui-radio-group>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/radio
        */
        'mdui-radio': {
          /**
          * Specifies the value of the radio.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-value
          */
          'value'?: string;
        /**
          * Disables the radio when set.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Sets the radio to the checked state.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-checked
          */
          'checked'?: boolean;
        /**
          * Specifies the Material Icons name for the unchecked state. Alternatively, use `slot="unchecked-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-unchecked-icon
          */
          'unchecked-icon'?: string;
        /**
          * Specifies the Material Icons name for the checked state. Alternatively, use `slot="checked-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-checked-icon
          */
          'checked-icon'?: string;
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/radio#radio-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Range Slider Component 
       * 
       * ```html
       * <mdui-range-slider></mdui-range-slider>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/range-slider
        */
        'mdui-range-slider': {
          /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Specifies the minimum value. Default is `0`.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-min
          */
          'min'?: number;
        /**
          * Specifies the maximum value. Default is `100`.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-max
          */
          'max'?: number;
        /**
          * Specifies the step interval. Default is `1`.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-step
          */
          'step'?: number;
        /**
          * Adds tickmarks to the slider.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-tickmarks
          */
          'tickmarks'?: boolean;
        /**
          * Hides the tooltip.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-nolabel
          */
          'nolabel'?: boolean;
        /**
          * Disables the slider.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Associates the slider with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the slider is associated with its parent `<form>`, if any.
         * 
         * This attribute allows slider elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-form
          */
          'form'?: string;
        /**
          * Specifies the slider's name, which is submitted with the form data.
          * @see https://www.mdui.org/en/docs/2/components/range-slider#attributes-name
          */
          'name'?: string;
        } & HTMLElementProps;
      /**
        * Segmented Button Group Component  It should be used in conjunction with the `<mdui-segmented-button>` component 
       * 
       * ```html
       * <mdui-segmented-button-group>
       *   <mdui-segmented-button>Day</mdui-segmented-button>
       *   <mdui-segmented-button>Week</mdui-segmented-button>
       *   <mdui-segmented-button>Month</mdui-segmented-button>
       * </mdui-segmented-button-group>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/segmented-button
        */
        'mdui-segmented-button-group': {
          /**
          * If set, the segmented button group will fill the width of its parent element.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-full-width
          */
          'full-width'?: boolean;
        /**
          * Defines selectable states. Default is non-selectable. Possible values:
         * 
         * * `single`: Only one can be selected.
         * * `multiple`: Multiple selections are allowed.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-selects
          */
          'selects'?: 'single' | 'multiple';
        /**
          * Disables the segmented button group when set.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Requires a selection when the form is submitted.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-required
          */
          'required'?: boolean;
        /**
          * Associates the segmented button group with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the segmented button group is associated with its parent `<form>`, if any.
         * 
         * This attribute allows segmented button group elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-form
          */
          'form'?: string;
        /**
          * The name of the segmented button group, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-name
          */
          'name'?: string;
        /**
          * The value of the selected `<mdui-segmented-button>`. This value is submitted with form data.
         * 
         * Note: The HTML attribute is always a string and can only be set as an initial value when `selects="single"`. The JavaScript property is a string when `selects="single"` and an array of strings when `selects="multiple"`. In `selects="multiple"`, this value can only be modified by changing the JavaScript property.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-group-attributes-value
          */
          'value'?: string | string[];
        } & HTMLElementProps;
      /**
        * Segmented Button Component  It should be used in conjunction with the `<mdui-segmented-button-group>` component 
       * 
       * ```html
       * <mdui-segmented-button-group>
       *   <mdui-segmented-button>Day</mdui-segmented-button>
       *   <mdui-segmented-button>Week</mdui-segmented-button>
       *   <mdui-segmented-button>Month</mdui-segmented-button>
       * </mdui-segmented-button-group>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/segmented-button
        */
        'mdui-segmented-button': {
          /**
          * Specifies the Material Icons name for the left icon. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-icon
          */
          'icon'?: string;
        /**
          * Specifies the Material Icons name for the right icon. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * Specifies the Material Icons name for the selected state. Alternatively, use `slot="selected-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-selected-icon
          */
          'selected-icon'?: string;
        /**
          * The URL for the hyperlink. If provided, the component is rendered as an `<a>` element and can use link-related attributes.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-href
          */
          'href'?: string;
        /**
          * Instructs the browser to download the linked URL.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-download
          */
          'download'?: string;
        /**
          * Defines where to open the linked URL. Possible values:
         * 
         * * `_blank`: Opens in a new tab or window.
         * * `_parent`: Opens in the parent browsing context or `_self` if no parent.
         * * `_self`: Opens in the current browsing context. (Default).
         * * `_top`: Opens in the topmost browsing context or `_self` if no ancestors.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-target
          */
          'target'?: '_blank' | '_parent' | '_self' | '_top';
        /**
          * Specifies the relationship of the linked URL as space-separated link types. Possible values:
         * 
         * * `alternate`: Alternate versions of the current document.
         * * `author`: The author of the current document or article.
         * * `bookmark`: The permalink for the nearest ancestor section.
         * * `external`: The referenced document is not part of the same site as the current document.
         * * `help`: A link to context-sensitive help.
         * * `license`: Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
         * * `me`: Indicates that the current document represents the person who owns the linked content.
         * * `next`: Indicates that the current document is part of a series and the next document in the series is the referenced document.
         * * `nofollow`: Indicates that the current document's original author or publisher does not endorse the referenced document.
         * * `noreferrer`: No `Referer` header will be included. Also has the same effect as `noopener`.
         * * `opener`: Creates an auxiliary browsing context if the hyperlink would otherwise create a top-level browsing context that is not an auxiliary browsing context (i.e., has "`_blank`" as `target` attribute value).
         * * `prev`: Indicates that the current document is part of a series and the previous document in the series is the referenced document.
         * * `search`: Links to a resource that can be used to search through the current document and its related pages.
         * * `tag`: Gives a tag (identified by the given address) that applies to the current document.
         * 
         * **Note**: This is only available when `href` is specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-rel
          */
          'rel'?: 'alternate' | 'author' | 'bookmark' | 'external' | 'help' | 'license' | 'me' | 'next' | 'nofollow' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'tag';
        /**
          * Specifies that the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Defines the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Disables the element.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Indicates that the element is in a loading state.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-loading
          */
          'loading'?: boolean;
        /**
          * The button's name, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-name
          */
          'name'?: string;
        /**
          * The button's value, which is submitted with form data.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-value
          */
          'value'?: string;
        /**
          * Defines the button's default behavior. The default is `button`. Possible values:
         * 
         * * `submit`: Submits the form data to the server.
         * * `reset`: Resets all the controls to their initial values.
         * * `button`: No default behavior, does nothing when pressed by default.
         * 
         * **Note**: This is only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-type
          */
          'type'?: 'submit' | 'reset' | 'button';
        /**
          * Associates the button with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the button is associated with its parent `<form>`, if any.
         * 
         * This attribute allows button elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
         * 
         * **Note**: Only available when `href` is not specified.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-form
          */
          'form'?: string;
        /**
          * Specifies the URL that processes the button's submitted information. Overrides the `action` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-formaction
          */
          'formaction'?: string;
        /**
          * Specifies the form data encoding method. Possible values:
         * 
         * * `application/x-www-form-urlencoded`: Default if the attribute is not used.
         * * `multipart/form-data`: Used for `<input>` elements with `type` set to `file`.
         * * `text/plain`: For debugging, not for real form submission.
         * 
         * Overrides the `enctype` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-formenctype
          */
          'formenctype'?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
        /**
          * Specifies the HTTP method for form submission. Possible values:
         * 
         * * `post`: Form data included in HTTP request body.
         * * `get`: Form data appended to `action` URL.
         * 
         * Overrides the `method` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-formmethod
          */
          'formmethod'?: 'post' | 'get';
        /**
          * Specifies that the form should not be validated on submission. Overrides the `novalidate` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-formnovalidate
          */
          'formnovalidate'?: boolean;
        /**
          * Specifies where to display the form submission response. Possible values:
         * 
         * * `_self`: Current browsing context. (Default).
         * * `_blank`: New tab or window.
         * * `_parent`: Parent browsing context or `_self` if no parent.
         * * `_top`: Topmost browsing context or `_self` if no ancestors.
         * 
         * Overrides the `target` attribute of the button's form owner.
         * 
         * **Note**: Only available when `href` is not specified and `type="submit"`.
          * @see https://www.mdui.org/en/docs/2/components/segmented-button#segmented-button-attributes-formtarget
          */
          'formtarget'?: '_self' | '_blank' | '_parent' | '_top';
        } & HTMLElementProps;
      /**
        * Select Component  It should be used in conjunction with the `<mdui-menu-item>` component 
       * 
       * ```html
       * <mdui-select>
       *   <mdui-menu-item value="item-1">Item 1</mdui-menu-item>
       *   <mdui-menu-item value="item-2">Item 2</mdui-menu-item>
       * </mdui-select>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/select
        */
        'mdui-select': {
          /**
          * Defines the select style. Possible values:
         * 
         * * `filled`: Solid background, strong visual emphasis.
         * * `outlined`: Bordered, less visual emphasis.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-variant
          */
          'variant'?: 'filled' | 'outlined';
        /**
          * Enables multiple selections.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-multiple
          */
          'multiple'?: boolean;
        /**
          * Name of the select, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-name
          */
          'name'?: string;
        /**
          * Value of the select, which is submitted with form data.
         * 
         * If `multiple` is not set, the value is a string; if set, it's an array of strings. HTML attributes can only set string values; array values must be set via JavaScript property.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-value
          */
          'value'?: string | string[];
        /**
          * Label text.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-label
          */
          'label'?: string;
        /**
          * Placeholder text.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-placeholder
          */
          'placeholder'?: string;
        /**
          * Helper text displayed below the select. Alternatively, use `slot="helper"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-helper
          */
          'helper'?: string;
        /**
          * Allows the select to be cleared.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-clearable
          */
          'clearable'?: boolean;
        /**
          * Material Icons name for the clear button displayed on the right of the select when clearable. Alternatively, use `slot="clear-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-clear-icon
          */
          'clear-icon'?: string;
        /**
          * Select placement. Possible values:
         * 
         * * `auto`: Automatically determined.
         * * `bottom`: Below the input.
         * * `top`: Above the input.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-placement
          */
          'placement'?: 'auto' | 'bottom' | 'top';
        /**
          * Aligns text to the right.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-end-aligned
          */
          'end-aligned'?: boolean;
        /**
          * Prefix text of the select. Displayed only when the select is focused or has a value. Alternatively, use `slot="prefix"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-prefix
          */
          'prefix'?: string;
        /**
          * Suffix text of the select. Displayed only when the select is focused or has a value. Alternatively, use `slot="suffix"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-suffix
          */
          'suffix'?: string;
        /**
          * Material Icons name for the prefix icon. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-icon
          */
          'icon'?: string;
        /**
          * Material Icons name for the suffix icon. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * Material Icons name displayed on the right when form field validation fails. Alternatively, use `slot="error-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-error-icon
          */
          'error-icon'?: string;
        /**
          * Associates the select with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the select is associated with its parent `<form>`, if any.
         * 
         * This attribute allows select elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-form
          */
          'form'?: string;
        /**
          * Makes the select read-only.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-readonly
          */
          'readonly'?: boolean;
        /**
          * Disables the select.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Requires a selection when the form is submitted.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-required
          */
          'required'?: boolean;
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/select#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Slider Component 
       * 
       * ```html
       * <mdui-slider></mdui-slider>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/slider
        */
        'mdui-slider': {
          /**
          * The value of the slider, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-value
          */
          'value'?: number;
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-tabindex
          */
          'tabindex'?: number;
        /**
          * Specifies the minimum value. Default is `0`.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-min
          */
          'min'?: number;
        /**
          * Specifies the maximum value. Default is `100`.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-max
          */
          'max'?: number;
        /**
          * Specifies the step interval. Default is `1`.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-step
          */
          'step'?: number;
        /**
          * Adds tickmarks to the slider.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-tickmarks
          */
          'tickmarks'?: boolean;
        /**
          * Hides the tooltip.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-nolabel
          */
          'nolabel'?: boolean;
        /**
          * Disables the slider.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Associates the slider with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the slider is associated with its parent `<form>`, if any.
         * 
         * This attribute allows slider elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-form
          */
          'form'?: string;
        /**
          * Specifies the slider's name, which is submitted with the form data.
          * @see https://www.mdui.org/en/docs/2/components/slider#attributes-name
          */
          'name'?: string;
        } & HTMLElementProps;
      /**
        * Snackbar Component 
       * 
       * ```html
       * <mdui-snackbar>message</mdui-snackbar>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/snackbar
        */
        'mdui-snackbar': {
          /**
          * Opens the Snackbar.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-open
          */
          'open'?: boolean;
        /**
          * Snackbar placement. Default is `bottom`. Possible values:
         * 
         * * `top`: Top, centered.
         * * `top-start`: Top, left-aligned.
         * * `top-end`: Top, right-aligned.
         * * `bottom`: Bottom, centered.
         * * `bottom-start`: Bottom, left-aligned.
         * * `bottom-end`: Bottom, right-aligned.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-placement
          */
          'placement'?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
        /**
          * Text for the action button. Alternatively, use `slot="action"`.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-action
          */
          'action'?: string;
        /**
          * Indicates if the action button is in the loading state.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-action-loading
          */
          'action-loading'?: boolean;
        /**
          * Shows a close button on the right.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-closeable
          */
          'closeable'?: boolean;
        /**
          * Material Icons name for the close button. Alternatively, use `slot="close-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-close-icon
          */
          'close-icon'?: string;
        /**
          * Maximum lines for message text. Default is unlimited. Possible values:
         * 
         * * `1`: Single line.
         * * `2`: Two lines.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-message-line
          */
          'message-line'?: 1 | 2;
        /**
          * Automatically closes the Snackbar after a specified time (in milliseconds). Set to `0` to disable auto-closing. Default is 5 seconds.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-auto-close-delay
          */
          'auto-close-delay'?: number;
        /**
          * Closes the Snackbar when clicking or touching outside the Snackbar area.
          * @see https://www.mdui.org/en/docs/2/components/snackbar#attributes-close-on-outside-click
          */
          'close-on-outside-click'?: boolean;
        } & HTMLElementProps;
      /**
        * Switch Component 
       * 
       * ```html
       * <mdui-switch></mdui-switch>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/switch
        */
        'mdui-switch': {
          /**
          * Disables the switch.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Sets the switch to the checked state.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-checked
          */
          'checked'?: boolean;
        /**
          * The Material Icons name for the unchecked state. Alternatively, use `slot="unchecked-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-unchecked-icon
          */
          'unchecked-icon'?: string;
        /**
          * The Material Icons name for the checked state. Alternatively, use `slot="checked-icon"`. Defaults to the `check` icon; an empty string removes the default icon.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-checked-icon
          */
          'checked-icon'?: string;
        /**
          * The switch must be checked when submitting the form.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-required
          */
          'required'?: boolean;
        /**
          * Associates the switch with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the switch is associated with its parent `<form>`, if any.
         * 
         * This attribute allows switch elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-form
          */
          'form'?: string;
        /**
          * The name of the switch, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-name
          */
          'name'?: string;
        /**
          * The value of the switch, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-value
          */
          'value'?: string;
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/switch#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Tab Panel Component  It should be used in conjunction with the `<mdui-tabs>` and `<mdui-tab>` components 
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
        * @see https://www.mdui.org/en/docs/2/components/tabs
        */
        'mdui-tab-panel': {
          /**
          * Specifies the value of the tab panel.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tab-panel-attributes-value
          */
          'value'?: string;
        } & HTMLElementProps;
      /**
        * Tab Component  It should be used in conjunction with the `<mdui-tabs>` and `<mdui-tab-panel>` components 
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
        * @see https://www.mdui.org/en/docs/2/components/tabs
        */
        'mdui-tab': {
          /**
          * Specifies the tab value.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tab-attributes-value
          */
          'value'?: string;
        /**
          * Specifies the Material Icons name. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tab-attributes-icon
          */
          'icon'?: string;
        /**
          * Arranges the icon and text horizontally.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tab-attributes-inline
          */
          'inline'?: boolean;
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tab-attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tab-attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Tabs Component  It should be used in conjunction with the `<mdui-tab>` and `<mdui-tab-panel>` components 
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
        * @see https://www.mdui.org/en/docs/2/components/tabs
        */
        'mdui-tabs': {
          /**
          * Defines the tab shape. Possible values:
         * 
         * * `primary`: Located below `<mdui-top-app-bar>`, used for switching between main application pages.
         * * `secondary`: Located within the page, used for switching between related content groups.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tabs-attributes-variant
          */
          'variant'?: 'primary' | 'secondary';
        /**
          * Specifies the active `<mdui-tab>` value.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tabs-attributes-value
          */
          'value'?: string;
        /**
          * Defines the tab position. Default is `top-start`. Possible values:
         * 
         * * `top-start`: Top, left-aligned.
         * * `top`: Top, center-aligned.
         * * `top-end`: Top, right-aligned.
         * * `bottom-start`: Bottom, left-aligned.
         * * `bottom`: Bottom, center-aligned.
         * * `bottom-end`: Bottom, right-aligned.
         * * `left-start`: Left, top-aligned.
         * * `left`: Left, center-aligned.
         * * `left-end`: Left, bottom-aligned.
         * * `right-start`: Right, top-aligned.
         * * `right`: Right, center-aligned.
         * * `right-end`: Right, bottom-aligned.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tabs-attributes-placement
          */
          'placement'?: 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end';
        /**
          * If set, the tabs will fill the width of its parent element.
          * @see https://www.mdui.org/en/docs/2/components/tabs#tabs-attributes-full-width
          */
          'full-width'?: boolean;
        } & HTMLElementProps;
      /**
        * Text Field Component 
       * 
       * ```html
       * <mdui-text-field label="Text Field"></mdui-text-field>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/text-field
        */
        'mdui-text-field': {
          /**
          * Defines the text field style. Default is `filled`. Possible values:
         * 
         * * `filled`: Text field with background color, providing a stronger visual effect.
         * * `outlined`: Text field with border, providing a subtler visual effect.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-variant
          */
          'variant'?: 'filled' | 'outlined';
        /**
          * Specifies the text field type. Default is `text`. Possible values:
         * 
         * * `text`: Standard text field.
         * * `number`: Allows only numeric input. Devices with dynamic keyboards will display a numeric keyboard.
         * * `password`: Masks the input for password confidentiality.
         * * `url`: Validates URL format. Devices with dynamic keyboards will display a URL-specific keyboard.
         * * `email`: Validates email format. Devices with dynamic keyboards will display an email-specific keyboard.
         * * `search`: Changes the enter icon to a search icon on devices with dynamic keyboards.
         * * `tel`: Displays a phone number keyboard on devices with dynamic keyboards.
         * * `hidden`: Hides the control, but its value will still be submitted to the server.
         * * `date`: Activates a date picker or a numeric scroll wheel for year, month, and day in supported browsers.
         * * `datetime-local`: Activates a date and time picker in supported browsers, excluding time zone.
         * * `month`: Allows input for year and month, excluding time zone.
         * * `time`: Allows time input, excluding time zone.
         * * `week`: Allows input for dates consisting of a year and week, excluding time zone.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-type
          */
          'type'?: 'text' | 'number' | 'password' | 'url' | 'email' | 'search' | 'tel' | 'hidden' | 'date' | 'datetime-local' | 'month' | 'time' | 'week';
        /**
          * The name of text field, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-name
          */
          'name'?: string;
        /**
          * The value of text field, which is submitted with form data.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-value
          */
          'value'?: string;
        /**
          * Label text.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-label
          */
          'label'?: string;
        /**
          * Placeholder text.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-placeholder
          */
          'placeholder'?: string;
        /**
          * The helper text displayed at the bottom of the text field. Alternatively, use `slot="helper"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-helper
          */
          'helper'?: string;
        /**
          * If set, the helper text is only displayed when the text field is focused.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-helper-on-focus
          */
          'helper-on-focus'?: boolean;
        /**
          * If set, the text field can be cleared.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-clearable
          */
          'clearable'?: boolean;
        /**
          * Material Icons name displayed on the right when the text field is clearable. Alternatively, use `slot="clear-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-clear-icon
          */
          'clear-icon'?: string;
        /**
          * Aligns the text to the right.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-end-aligned
          */
          'end-aligned'?: boolean;
        /**
          * The prefix text for the text field. It is only displayed when the text field is focused or has a value. Alternatively, use `slot="prefix"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-prefix
          */
          'prefix'?: string;
        /**
          * The suffix text for the text field. It is only displayed when the text field is focused or has a value. Alternatively, use `slot="suffix"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-suffix
          */
          'suffix'?: string;
        /**
          * Material Icons name for the prefix icon of the text field. Alternatively, use `slot="icon"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-icon
          */
          'icon'?: string;
        /**
          * Material Icons name for the suffix icon of the text field. Alternatively, use `slot="end-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-end-icon
          */
          'end-icon'?: string;
        /**
          * Material Icons name displayed on the right side of the text field when the form field validation fails. Alternatively, use `slot="error-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-error-icon
          */
          'error-icon'?: string;
        /**
          * Associates the text field with a `<form>` element. The value should be the `id` of a `<form>` in the same document. If not set, the text field is associated with its parent `<form>`, if any.
         * 
         * This attribute allows text field elements to be associated with `<form>`s anywhere in the document, not just inside a `<form>`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-form
          */
          'form'?: string;
        /**
          * Makes the text field read-only.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-readonly
          */
          'readonly'?: boolean;
        /**
          * Disables the text field.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * The field must be filled in before the form is submitted.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-required
          */
          'required'?: boolean;
        /**
          * The number of rows in the text field.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-rows
          */
          'rows'?: number;
        /**
          * Allows the text field height to adjust automatically based on the input content.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-autosize
          */
          'autosize'?: boolean;
        /**
          * The minimum number of rows when `autosize` is enabled.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-min-rows
          */
          'min-rows'?: number;
        /**
          * The maximum number of rows when `autosize` is enabled.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-max-rows
          */
          'max-rows'?: number;
        /**
          * The minimum number of characters for input.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-minlength
          */
          'minlength'?: number;
        /**
          * The maximum number of characters for input.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-maxlength
          */
          'maxlength'?: number;
        /**
          * Displays the character count when `maxlength` is specified.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-counter
          */
          'counter'?: boolean;
        /**
          * The minimum value when `type` is `number`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-min
          */
          'min'?: number;
        /**
          * The maximum value when `type` is `number`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-max
          */
          'max'?: number;
        /**
          * The step interval during increment and decrement when `type` is `number`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-step
          */
          'step'?: number;
        /**
          * The regular expression for form validation.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-pattern
          */
          'pattern'?: string;
        /**
          * Adds a toggle button for showing and hiding the password when `type` is `password`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-toggle-password
          */
          'toggle-password'?: boolean;
        /**
          * Material Icons name for the visible password toggle button. Alternatively, use `slot="show-password-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-show-password-icon
          */
          'show-password-icon'?: string;
        /**
          * Material Icons name for the hidden password toggle button. Alternatively, use `slot="hide-password-icon"`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-hide-password-icon
          */
          'hide-password-icon'?: string;
        /**
          * A non-standard iOS attribute for automatic capitalization. Possible values:
         * 
         * * `none`: Disables automatic capitalization.
         * * `sentences`: Capitalizes the first letter of each sentence.
         * * `words`: Capitalizes the first letter of each word.
         * * `characters`: Capitalizes all letters.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-autocapitalize
          */
          'autocapitalize'?: 'none' | 'sentences' | 'words' | 'characters';
        /**
          * The `autocorrect` attribute of the `input` element.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-autocorrect
          */
          'autocorrect'?: string;
        /**
          * The `autocomplete` attribute of the `input` element.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-autocomplete
          */
          'autocomplete'?: string;
        /**
          * Customizes the Enter key text or icon on the virtual keyboard. The effect varies based on the device and language. Possible values:
         * 
         * * `enter`: Inserts a new line, typically used in a multi-line text field.
         * * `done`: Indicates input completion, closes the virtual keyboard.
         * * `go`: Navigates to the target of the entered text.
         * * `next`: Moves to the next text field.
         * * `previous`: Moves to the previous text field.
         * * `search`: Navigates to search results.
         * * `send`: Sends a text message.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-enterkeyhint
          */
          'enterkeyhint'?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
        /**
          * Enable spell checking.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-spellcheck
          */
          'spellcheck'?: boolean;
        /**
          * Customizes the virtual keyboard. Possible values:
         * 
         * * `none`: No virtual keyboard. This is useful for custom input controls.
         * * `text`: Standard text input keyboard.
         * * `decimal`: Decimal input keyboard. This includes a period `.` or comma `,` and numbers.
         * * `numeric`: Numeric keyboard. This displays numbers 0-9.
         * * `tel`: Phone number keyboard. This includes numbers 0-9, asterisk `*`, and hash `#` keys.
         * * `search`: Search-optimized virtual keyboard. 'Search' is displayed on the submit button.
         * * `email`: Email-optimized virtual keyboard. This typically includes `@ .`.
         * * `url`: URL-optimized virtual keyboard. This typically includes `. / #`.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-inputmode
          */
          'inputmode'?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
        /**
          * Determines if the element should be focused when the page loads.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-autofocus
          */
          'autofocus'?: boolean;
        /**
          * Specifies the order in which the element receives focus when navigating with the Tab key.
          * @see https://www.mdui.org/en/docs/2/components/text-field#attributes-tabindex
          */
          'tabindex'?: number;
        } & HTMLElementProps;
      /**
        * Tooltip Component 
       * 
       * ```html
       * <mdui-tooltip content="tooltip content">
       *   <mdui-button>button</mdui-button>
       * </mdui-tooltip>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/tooltip
        */
        'mdui-tooltip': {
          /**
          * Defines the tooltip shape. Default is `plain`. Possible values:
         * 
         * * `plain`: For simple single-line text.
         * * `rich`: For text including a title, body text, and action buttons.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-variant
          */
          'variant'?: 'plain' | 'rich';
        /**
          * Sets the tooltip position. Default is `auto`. Possible values:
         * 
         * * `auto`: Position is determined automatically.
         * * `top-left`: Top-left corner.
         * * `top-start`: Top, left-aligned.
         * * `top`: Top, centered.
         * * `top-end`: Top, right-aligned.
         * * `top-right`: Top-right corner.
         * * `bottom-left`: Bottom-left corner.
         * * `bottom-start`: Bottom, left-aligned.
         * * `bottom`: Bottom, centered.
         * * `bottom-end`: Bottom, right-aligned.
         * * `bottom-right`: Bottom-right corner.
         * * `left-start`: Left, top-aligned.
         * * `left`: Left, centered.
         * * `left-end`: Left, bottom-aligned.
         * * `right-start`: Right, top-aligned.
         * * `right`: Right, centered.
         * * `right-end`: Right, bottom-aligned.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-placement
          */
          'placement'?: 'auto' | 'top-left' | 'top-start' | 'top' | 'top-end' | 'top-right' | 'bottom-left' | 'bottom-start' | 'bottom' | 'bottom-end' | 'bottom-right' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end';
        /**
          * Sets the delay in milliseconds before the tooltip appears on hover.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-open-delay
          */
          'open-delay'?: number;
        /**
          * Sets the delay in milliseconds before the tooltip disappears on hover.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-close-delay
          */
          'close-delay'?: number;
        /**
          * Sets the tooltip title. Only applicable when `variant="rich"`. Alternatively, use `slot="headline"`.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-headline
          */
          'headline'?: string;
        /**
          * Sets the tooltip content. Alternatively, use `slot="content"`.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-content
          */
          'content'?: string;
        /**
          * Defines the trigger method. Supports multiple values separated by spaces. Possible values:
         * 
         * * `click`: Triggered on click.
         * * `hover`: Triggered on mouse hover.
         * * `focus`: Triggered on focus.
         * * `manual`: Can only open and close the tooltip programmatically, cannot specify other trigger methods.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-trigger
          */
          'trigger'?: 'click' | 'hover' | 'focus' | 'manual' | string;
        /**
          * Disables the tooltip.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-disabled
          */
          'disabled'?: boolean;
        /**
          * Opens the tooltip.
          * @see https://www.mdui.org/en/docs/2/components/tooltip#attributes-open
          */
          'open'?: boolean;
        } & HTMLElementProps;
      /**
        * Top App Bar Title Component  It should be used in conjunction with the `<mdui-top-app-bar>` component 
       * 
       * ```html
       * <mdui-top-app-bar>
       *   <mdui-button-icon icon="menu"></mdui-button-icon>
       *   <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
       *   <div style="flex-grow: 1"></div>
       *   <mdui-button-icon icon="more_vert"></mdui-button-icon>
       * </mdui-top-app-bar>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/top-app-bar
        */
        'mdui-top-app-bar-title': {
          
        } & HTMLElementProps;
      /**
        * Top App Bar Component 
       * 
       * ```html
       * <mdui-top-app-bar>
       *   <mdui-button-icon icon="menu"></mdui-button-icon>
       *   <mdui-top-app-bar-title>Title</mdui-top-app-bar-title>
       *   <div style="flex-grow: 1"></div>
       *   <mdui-button-icon icon="more_vert"></mdui-button-icon>
       * </mdui-top-app-bar>
       * ```
        * @see https://www.mdui.org/en/docs/2/components/top-app-bar
        */
        'mdui-top-app-bar': {
          /**
          * Defines the top app bar style. Default is `small`. Possible values:
         * 
         * * `center-aligned`: Small app bar with a center-aligned title.
         * * `small`: Small app bar.
         * * `medium`: Medium-sized app bar.
         * * `large`: Large-sized app bar.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-variant
          */
          'variant'?: 'center-aligned' | 'small' | 'medium' | 'large';
        /**
          * Hide the top app bar.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-hide
          */
          'hide'?: boolean;
        /**
          * Shrinks the app bar to `small` style. Only applicable for `medium` or `large` variants.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-shrink
          */
          'shrink'?: boolean;
        /**
          * Defines the scroll behavior. Accepts multiple space-separated values. Possible values:
         * 
         * * `hide`: Hides when scrolling.
         * * `shrink`: Shrinks when scrolling for medium to large app bars.
         * * `elevate`: Increases elevation when scrolling.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-scroll-behavior
          */
          'scroll-behavior'?: 'hide' | 'shrink' | 'elevate';
        /**
          * The element that listens for scroll events. Accepts a CSS selector, DOM element, or [JQ object](https://www.mdui.org/en/docs/2/functions/jq). Defaults to `window`.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-scroll-target
          */
          'scroll-target'?: string | HTMLElement | JQ<HTMLElement>;
        /**
          * The scroll distance (in pixels) that triggers the scroll behavior.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-scroll-threshold
          */
          'scroll-threshold'?: number;
        /**
          * Specifies the layout order within the [`<mdui-layout>`](https://www.mdui.org/en/docs/2/components/layout) component. Items are sorted in ascending order. The default value is `0`.
          * @see https://www.mdui.org/en/docs/2/components/top-app-bar#top-app-bar-attributes-order
          */
          'order'?: number;
        } & HTMLElementProps;
      }
    }
  }
}
