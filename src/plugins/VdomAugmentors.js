import Sizzle from 'sizzle';

function createElement(matchedComponent, componentToPrepend) {
  const element = matchedComponent.$createElement(componentToPrepend);
  if (!element.componentOptions.tag) {
    element.componentOptions.tag = componentToPrepend.name;
  }
  return element;
}

function spliceIntoParent(vnode, element, indexDelta) {
  const parentVnode = vnode.parentVnode;
  const selectedVnodeIndex = parentVnode.children.indexOf(vnode);
  parentVnode.children.splice(selectedVnodeIndex + indexDelta, 0, element);
}

const VdomAugmentors = {
  insertBefore: (matchedComponent, vnode, subSelector, componentToInsert) => {
    const selectedVnodes = Sizzle.select(subSelector, vnode);
    if (selectedVnodes.length < 1) {
      return;
    }
    const element = createElement(matchedComponent, componentToInsert);
    spliceIntoParent(selectedVnodes[0], element, 0);
  },

  insertAfter: (matchedComponent, vnode, subSelector, componentToInsert) => {
    const selectedVnodes = Sizzle.select(subSelector, vnode);
    if (selectedVnodes.length < 1) {
      return;
    }
    const element = createElement(matchedComponent, componentToInsert);
    spliceIntoParent(selectedVnodes[0], element, 1);
  },

  prependChildComponent: (matchedComponent, vnode, componentToPrepend) => {
    const element = createElement(matchedComponent, componentToPrepend);
    vnode.children.splice(0, 0, element);
  },

  appendChildComponent: (matchedComponent, vnode, componentToAppend) => {
    const element = createElement(matchedComponent, componentToAppend);
    vnode.children.splice(vnode.children.length, 0, element);
  },
};

export default VdomAugmentors;
