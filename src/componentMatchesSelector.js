import getComponentTag from './getComponentTag';

/**
 * @param {Vue} component
 * @param {String[]} selector
 */
export default function componentMatchesSelector(component, selector) {
  let currentComponent = component;

  for (let selectorIndex = 0; selectorIndex < selector.length; selectorIndex += 1) {
    const isChildSelector = selector[selectorIndex] === '>';
    if (isChildSelector) {
      selectorIndex += 1;
    }
    const selectorFragment = selector[selectorIndex];

    if (!currentComponent) {
      // Reached root currentComponent before selector was consumed fully
      return false;
    }

    let componentTag = getComponentTag(currentComponent);

    // Child selector rule
    if (isChildSelector && componentTag !== selectorFragment) {
      return false;
    }

    // No child selector - walk up the component hierarchy to find a matching component
    while (componentTag !== selectorFragment) {
      currentComponent = currentComponent.$parent;
      if (!currentComponent) {
        // Reached root currentComponent before selector was consumed fully
        return false;
      }

      componentTag = getComponentTag(currentComponent);
    }

    // componentTag === selectorFragment at this point, move one currentComponent upwards before
    // continuing with the next selector element
    currentComponent = currentComponent.$parent;
  }

  return true;
}
