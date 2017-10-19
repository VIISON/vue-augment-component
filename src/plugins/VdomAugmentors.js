import Sizzle from 'sizzle';

function createElement(matchedComponent, componentToPrepend, options, children) {
  const element = matchedComponent.$createElement(componentToPrepend, options, children);
  if (!element.componentOptions.tag) {
    element.componentOptions.tag = componentToPrepend.name;
  }
  return element;
}

function spliceIntoParent(vnode, element, indexDelta, removeCount) {
  const parentVnode = vnode.parentVnode;
  const selectedVnodeIndex = parentVnode.children.indexOf(vnode);
  parentVnode.children.splice(selectedVnodeIndex + indexDelta, removeCount, element);
  /* eslint-disable no-param-reassign */
  element.parentVnode = vnode.parentVnode;
}

const VdomAugmentors = {
  insertBefore: (matchedComponent, vnode, subSelector, componentToInsert) => {
    const selectedVnodes = Sizzle.select(subSelector, vnode);
    if (selectedVnodes.length < 1) {
      return;
    }
    const element = createElement(matchedComponent, componentToInsert);
    spliceIntoParent(selectedVnodes[0], element, 0, 0);
  },

  insertAfter: (matchedComponent, vnode, subSelector, componentToInsert) => {
    const selectedVnodes = Sizzle.select(subSelector, vnode);
    if (selectedVnodes.length < 1) {
      return;
    }
    const element = createElement(matchedComponent, componentToInsert);
    spliceIntoParent(selectedVnodes[0], element, 1, 0);
  },

  prependChildComponent: (matchedComponent, vnode, componentToPrepend) => {
    const element = createElement(matchedComponent, componentToPrepend);
    vnode.children.splice(0, 0, element);
  },

  appendChildComponent: (matchedComponent, vnode, componentToAppend) => {
    const element = createElement(matchedComponent, componentToAppend);
    vnode.children.splice(vnode.children.length, 0, element);
  },

  wrap: (matchedComponent, vnode, subSelector, wrappingComponent) => {
    const selectedVnodes = Sizzle.select(subSelector, vnode);
    if (selectedVnodes.length < 1) {
      return;
    }
    const element = createElement(matchedComponent, wrappingComponent, {}, [selectedVnodes[0]]);
    spliceIntoParent(selectedVnodes[0], element, 0, 1);
    element.children = element.componentOptions.children;
    selectedVnodes[0].parentVnode = element;
  },
};

export default VdomAugmentors;
