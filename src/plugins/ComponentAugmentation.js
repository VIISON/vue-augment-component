import Sizzle from 'sizzle';
import VdomAugmentors from './VdomAugmentors';

const componentSelectors = {};

export default class ComponentAugmentation {
  constructor(selector) {
    this.selectorPath = selector.split(/\s+/).reverse();
    if (this.selectorPath.length < 1) {
      throw new Error('Component selector path is empty.');
    }
    if (this.selectorPath.length > 1) {
      throw new Error('Complex selectors are not yet supported.');
    }

    this.augmentations = [];
  }

  insertComponentBefore(component, subSelector) {
    const compiledSubSelector = Sizzle.compile(subSelector);
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.insertBefore(matchedComponent, vnode, compiledSubSelector, component),
    );
  }

  insertComponentAfter(component, subSelector) {
    const compiledSubSelector = Sizzle.compile(subSelector);
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.insertAfter(matchedComponent, vnode, compiledSubSelector, component),
    );
  }

  prependChildComponent(component) {
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.prependChildComponent(matchedComponent, vnode, component),
    );
  }

  appendChildComponent(component) {
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.appendChildComponent(matchedComponent, vnode, component),
    );
  }

  wrapComponentAround(component, subSelector) {
    const compiledSubSelector = Sizzle.compile(subSelector);
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.wrap(matchedComponent, vnode, compiledSubSelector, component),
    );
  }

  augment(component, vnode) {
    for (let i = 0; i < this.augmentations.length; i += 1) {
      this.augmentations[i](component, vnode);
    }
  }

  static create(selector) {
    const componentAugmentation = new ComponentAugmentation(selector);

    const selectorPath = componentAugmentation.selectorPath;
    const augmentedLeafComponent = selectorPath[selectorPath.length - 1];
    let leafComponentAugmentations = componentSelectors[augmentedLeafComponent];
    if (!leafComponentAugmentations) {
      leafComponentAugmentations = [];
      componentSelectors[augmentedLeafComponent] = leafComponentAugmentations;
    }

    leafComponentAugmentations.push(componentAugmentation);

    return componentAugmentation;
  }

  static render(parentComponent, vnode) {
    const { _componentTag: componentTag } = parentComponent.$options || {};

    // TODO support selectors with length > 1
    const componentAugmentations = componentSelectors[componentTag];
    if (!componentAugmentations) {
      return vnode;
    }

    for (let i = 0; i < componentAugmentations.length; i += 1) {
      componentAugmentations[i].augment(parentComponent, vnode);
    }

    return vnode;
  }
}
