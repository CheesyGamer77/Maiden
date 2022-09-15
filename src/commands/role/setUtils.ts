/* eslint-disable */
/**
 * Utilities for set operations.
 *
 * All code is taken and adapted from mozilla, found below:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
 */
/* eslint-enable */

/**
 * Union operation
 *
 * @param {Set<T>} a First set
 * @param {Set<T>} b Second set
 * @returns {Set<T>} The union of sets a and b
 */
export function union<T>(a: Set<T>, b: Set<T>) {
    const _union = new Set<T>(a);
    for (const elem of b) {
        _union.add(elem);
    }
    return _union;
}

/**
 * Intersection operation
 *
 * @param {Set<T>} a First set
 * @param {Set<T>} b Second set
 * @returns {Set<T>} The intersection of sets a and b
 */
export function intersection<T>(a: Set<T>, b: Set<T>) {
    const _intersection = new Set<T>();
    for (const elem of b) {
        if (a.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
