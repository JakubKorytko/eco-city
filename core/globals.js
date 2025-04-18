/**
 * Reactive state accessor object.
 *
 * You can destructure `state` to get individual reactive properties,
 * or call it as a function to dynamically access a property by name.
 *
 * Each property is a reactive reference object with a `.value` getter and setter.
 *
 * @example
 * // Destructuring access
 * const { display, nested } = state;
 * display.value = true;
 * console.log(nested.value.object.hide);
 *
 * @example
 * // Dynamic access
 * const user = state("user");
 * user.value = { name: "Anna" };
 *
 * @typedef {Object<string, StateRef<any>> & ((key: string) => StateRef<any>)} StateProxy
 */

/**
 * @typedef {Object} StateRef<any>
 * @property {any} value - The current value of the state property (reactive).
 */

/** @type {StateProxy} */
var state;

/**
 * Selects an element inside the component's shadow DOM and provides
 * a fluent API for managing event listeners and passing attributes or reactive references.
 *
 * @param {string} selector - A CSS selector for the target element inside shadow DOM.
 * @returns {ElementWrapper} An object with `.on`, `.off`, and `.pass` methods.
 *
 * @example
 * // Basic usage
 * element("#btn").on("click", () => {
 *   console.log("Clicked!");
 * });
 *
 * @example
 * // Using handler reference for later removal
 * const handler = () => console.log("Clicked!");
 * element("#btn").on("click", handler).off("click", handler);
 *
 * @example
 * // Passing attribute
 * element("#box").pass("title", "Tooltip text");
 *
 */

/**
 * @typedef {Object} ElementWrapper
 * @property {(event: string, callback: EventListenerOrEventListenerObject) => ElementWrapper} on - Attaches an event listener.
 * @property {(event: string, callback: EventListenerOrEventListenerObject) => ElementWrapper} off - Removes an event listener.
 * @property {(attrName: string, value: any) => ElementWrapper} pass - Passes a static value  an attribute/property.
 */
var element;

/**
 * Called when the component's state changes.
 *
 * @param {*} value - The new value of the state that was changed.
 * @param {string} property - The name of the property whose state has changed.
 */
var onStateChange;

/**
 * Asynchronously executes a callback once the host component is connected and available.
 * Uses `queueMicrotask` to ensure DOM setup is completed before executing the callback.
 *
 * @param {function(Object): void} callback - A function that receives the connected component's metadata.
 *   The `component` object passed to the callback contains:
 *   @property {string} name - The component's constructor name.
 *   @property {number|string} id - The component's internal ID (`__componentId`).
 *   @property {Object} tree - The component's tracked tree structure (`__tree`).
 *   @property {ShadowRoot|null} shadowRoot - The component's shadow root, if present.
 *   @property {string} key - Unique component key (`__componentKey`).
 *   @property {Function} state - Bound `state` method of the component (for accessing reactive state).
 *   @property {HTMLElement} element - The actual host element instance.
 *   @property {HTMLElement|null} parent - The parent custom element hosting this component, if any.
 */
var onConnect;

/**
 * Initializes the state with a default value.
 * @param {any} value - The default value for the state.
 * @returns {any} The initialized state.
 */
var init;
