import VdomAugmentors from './VdomAugmentors';

const componentSelectors = {};

function setParents(vnode, parent) {
  /* eslint-disable no-param-reassign */
  vnode.parentVnode = parent;

  if (vnode.children) {
    for (let i = 0; i < vnode.children.length; i += 1) {
      setParents(vnode.children[i], vnode);
    }
  }
}

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
    this.vnodesNeedParents = true;
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.insertBefore(matchedComponent, vnode, subSelector, component),
    );
  }

  insertComponentAfter(component, subSelector) {
    this.vnodesNeedParents = true;
    this.augmentations.push(
      (matchedComponent, vnode) =>
        VdomAugmentors.insertAfter(matchedComponent, vnode, subSelector, component),
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

  augment(component, vnode) {
    if (this.vnodesNeedParents) {
      setParents(vnode, null);
    }

    for (let i = 0; i < this.augmentations.length; i += 1) {
      this.augmentations[i](component, vnode);
    }

    // TODO clear parents
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
