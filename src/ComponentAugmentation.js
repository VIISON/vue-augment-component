import Sizzle from 'sizzle';
import VdomAugmentors from './VdomAugmentors';
import getComponentTag from './getComponentTag';
import componentMatchesSelector from './componentMatchesSelector';

const componentSelectors = {};

export default class ComponentAugmentation {
  constructor(selector) {
    this.reverseSelectorPath = selector.split(/\s+/).reverse();
    if (this.reverseSelectorPath.length < 1) {
      throw new Error('Component selector path is empty.');
    }

    this.augmentations = [];
  }

  insertComponentBefore(component, subSelector) {
    const compiledSubSelector = Sizzle.compile(subSelector);
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.insertBefore(matchedComponent, vnode, compiledSubSelector, component),
    );

    return this;
  }

  insertComponentAfter(component, subSelector) {
    const compiledSubSelector = Sizzle.compile(subSelector);
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.insertAfter(matchedComponent, vnode, compiledSubSelector, component),
    );

    return this;
  }

  prependChildComponent(component) {
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.prependChildComponent(matchedComponent, vnode, component),
    );

    return this;
  }

  appendChildComponent(component) {
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.appendChildComponent(matchedComponent, vnode, component),
    );

    return this;
  }

  wrapComponentAround(component, subSelector) {
    const compiledSubSelector = Sizzle.compile(subSelector);
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.wrap(matchedComponent, vnode, compiledSubSelector, component),
    );

    return this;
  }

  augment(component, vnode) {
    for (let i = 0; i < this.augmentations.length; i += 1) {
      this.augmentations[i](component, vnode);
    }
  }

  static create(selector) {
    const componentAugmentation = new ComponentAugmentation(selector);

    const selectorPath = componentAugmentation.reverseSelectorPath;
    const augmentedLeafComponent = selectorPath[0];
    let leafComponentAugmentations = componentSelectors[augmentedLeafComponent];
    if (!leafComponentAugmentations) {
      leafComponentAugmentations = [];
      componentSelectors[augmentedLeafComponent] = leafComponentAugmentations;
    }

    leafComponentAugmentations.push(componentAugmentation);

    return componentAugmentation;
  }

  static render(component, vnode) {
    const componentTag = getComponentTag(component);
    const componentAugmentations = componentSelectors[componentTag];
    if (!componentAugmentations) {
      return vnode;
    }

    for (let i = 0; i < componentAugmentations.length; i += 1) {
      if (componentMatchesSelector(component, componentAugmentations[i].reverseSelectorPath)) {
        componentAugmentations[i].augment(component, vnode);
      }
    }

    return vnode;
  }
}
