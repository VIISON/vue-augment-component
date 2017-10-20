import Sizzle from 'sizzle';
import SizzleNode from './SizzleNode';

function createElement(matchedComponent, componentToPrepend, options, children) {
  const element = matchedComponent.$createElement(componentToPrepend, options, children);
  if (!element.componentOptions.tag) {
    element.componentOptions.tag = componentToPrepend.name;
  }
  return element;
}

function spliceIntoParent(sizzleNode, element, indexDelta, removeCount) {
  const siblingVNodes = SizzleNode.getVNodeChildren(sizzleNode.parentNode.vnode);
  const selectedVnodeIndex = siblingVNodes.indexOf(sizzleNode.vnode);
  siblingVNodes.splice(selectedVnodeIndex + indexDelta, removeCount, element);
}

function sizzleSelect(selector, rootVNode) {
  const root = new SizzleNode(rootVNode, undefined);
  const selectedNodes = Sizzle.select(selector, root);

  return (selectedNodes.length > 0) ? selectedNodes[0] : undefined;
}

const VdomAugmentors = {
  insertBefore: (matchedComponent, vnode, subSelector, componentToInsert) => {
    const selectedSizzleNode = sizzleSelect(subSelector, vnode);
    if (!selectedSizzleNode) {
      return;
    }
    const element = createElement(matchedComponent, componentToInsert);
    spliceIntoParent(selectedSizzleNode, element, 0, 0);
  },

  insertAfter: (matchedComponent, vnode, subSelector, componentToInsert) => {
    const selectedSizzleNode = sizzleSelect(subSelector, vnode);
    if (!selectedSizzleNode) {
      return;
    }
    const element = createElement(matchedComponent, componentToInsert);
    spliceIntoParent(selectedSizzleNode, element, 1, 0);
  },

  prependChildComponent: (matchedComponent, vnode, componentToPrepend) => {
    const element = createElement(matchedComponent, componentToPrepend);
    const siblingVNodes = SizzleNode.getVNodeChildren(vnode);
    siblingVNodes.splice(0, 0, element);
  },

  appendChildComponent: (matchedComponent, vnode, componentToAppend) => {
    const element = createElement(matchedComponent, componentToAppend);
    const siblingVNodes = SizzleNode.getVNodeChildren(vnode);
    siblingVNodes.splice(siblingVNodes.length, 0, element);
  },

  wrap: (matchedComponent, vnode, subSelector, wrappingComponent) => {
    const selectedSizzleNode = sizzleSelect(subSelector, vnode);
    if (!selectedSizzleNode) {
      return;
    }
    const element = createElement(matchedComponent, wrappingComponent, {}, [selectedSizzleNode.vnode]);
    spliceIntoParent(selectedSizzleNode, element, 0, 1);
  },
};

export default VdomAugmentors;
