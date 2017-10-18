import Sizzle from 'sizzle';

const augmentationsBySelector = {};

function recordAugmentation(component, selector, type) {
  let augmentations = augmentationsBySelector[selector];
  if (!augmentations) {
    augmentations = [];
    augmentationsBySelector[selector] = augmentations;
  }

  augmentations.push({
    component,
    type,
  });
}

const AUGMENTORS = {
  insertAfter: (vnode, component) => {
    // debugger;
    // vdom.children.splice(childNodeIndex + 1, 0, parent.$createElement(augmentationComponent));
    // childNodeIndex += 1;
  },
  insertBefore: () => {},
  prependTo: () => {},
  appendTo: () => {},
};

function performAugmentation(vnode, augmentations) {
  for (const augmentation of augmentations) {
    AUGMENTORS[augmentation.type](vnode, augmentation.component);
    console.log('augmenting ', vnode.tagName, ' with ', augmentation);
  }
}

function augment(vnode) {
  for (const selector of Object.keys(augmentationsBySelector)) {
    console.log('trying to match ', selector, ' with ', vnode);
    if (true || Sizzle.matchesSelector(vnode, selector)) {
      performAugmentation(vnode, augmentationsBySelector[selector]);
    }
  }

  if (vnode.children) {
    for (const child of vnode.children) {
      augment(child);
    }
  }
}

const GlobalAugment = {
  install(Vue, options) {
    Vue.insertComponentBefore = (component, selector) => {
      recordAugmentation(component, selector, 'insertBefore');
    };

    Vue.insertComponentAfter = (component, selector) => {
      recordAugmentation(component, selector, 'insertAfter');
    };

    Vue.prependChildComponentTo = (component, selector) => {
      recordAugmentation(component, selector, 'prependTo');
    };

    Vue.appendChildComponentTo = (component, selector) => {
      recordAugmentation(component, selector, 'appendTo');
    };


    const oldRender = Vue.prototype._render;
    Vue.prototype._render = function newRender() {
      let resultingVdom = oldRender.apply(this, arguments);

      augment(resultingVdom);

      return resultingVdom;
    };

  },
};

export default GlobalAugment;
