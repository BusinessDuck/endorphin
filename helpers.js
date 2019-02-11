/**
 * Helper functions, used in templates and component definitions.
 * The fist argument of every helper *must* be a component!
 */

/**
 * Dispatches `type` event on given `elem` element
 * @template {Element} T
 * @param {T} elem
 * @param {String} type Type of dispatched event
 * @param {Object} [detail] Event details
 * @returns {T}
 */
export function emit(elem, type, detail) {
	const evt = new CustomEvent(type, {
		bubbles: true,
		cancelable: true,
		composed: true, // break out of shadow root
		detail
	});

	elem.dispatchEvent(evt);
	return elem;
}

/**
 * Subscribes on given `type` event on `elem` element
 * @template {Element} T
 * @param {T} elem
 * @param {String} type
 * @param {Function} callback
 * @param {Object} options
 * @returns {T}
 */
export function on(elem, type, callback, options) {
	elem.addEventListener(type, callback, options);
	return elem;
}

/**
 * Unsubscribes from given `type` event on `elem` element
 * @template {Element} T
 * @param {T} elem
 * @param {String} type
 * @param {Function} callback
 * @param {Object} options
 * @returns {T}
 */
export function off(elem, name, callback, options) {
	elem.removeEventListener(name, callback, options);
	return elem;
}

/**
 * Updates state of given component
 * @param {Element} component
 * @param {Object} value
 */
export function setState(component, value) {
	if (value != null) {
		component.setState(value);
	}
}
