/** @import {UseState, UseObserver, StateValue} from "@jsdocs/browser/hooks.d" */
import { sendToExtension } from "@Piglet/browser/helpers";
import CONST from "@Piglet/browser/CONST";
import State from "@Piglet/browser/classes/State";

/**
 * @template T
 * @type {UseState<T>}
 */
const useState = (
  componentName,
  path,
  initialValue,
  isCreatedByListener = false,
  asRef,
) => {
  if (!window.Piglet.state[componentName]) {
    window.Piglet.state[componentName] = {};
  }

  const key = Array.isArray(path) ? path.join(".") : path;

  if (!window.Piglet.state[componentName][key]) {
    window.Piglet.state[componentName][key] = new State(
      initialValue,
      isCreatedByListener,
      asRef,
    );
  } else if (
    !isCreatedByListener &&
    window.Piglet.state[componentName][key].__isCreatedByListener
  ) {
    window.Piglet.state[componentName][key]._isRef = asRef;
    window.Piglet.state[componentName][key].setState(initialValue);
    window.Piglet.state[componentName][key].__isCreatedByListener = false;
  }

  /**
   * @template T
   * @type {StateValue<T>}
   */
  return {
    /**
     * Gets the current state value.
     */
    get value() {
      return /** @type {T} */ (window.Piglet.state[componentName][key].state);
    },

    /**
     * Sets a new state value and triggers state update.
     */
    set value(newValue) {
      window.Piglet.state[componentName][key].setState(newValue);
      sendToExtension(CONST.extension.state);
    },
  };
};

/**
 * @template T
 * @type {UseObserver<T>}
 */
function useObserver(componentName, path) {
  const key = Array.isArray(path) ? path.join(".") : path;

  if (
    !window.Piglet.state[componentName] ||
    !window.Piglet.state[componentName][key]
  ) {
    return [() => {}, () => {}];
  }

  const state = window.Piglet.state[componentName][key];

  return [state.addObserver.bind(state), state.removeObserver.bind(state)];
}

export { useState, useObserver };
