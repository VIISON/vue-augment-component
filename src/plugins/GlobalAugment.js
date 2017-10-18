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
  insertBefore: () => {
  },
  prependTo: () => {
  },
  appendTo: () => {
  },
};

function performAugmentation(vnode, augmentations) {
  augmentations.forEach((augmentation) => {
    AUGMENTORS[augmentation.type](vnode, augmentation.component);
    console.log('augmenting ', vnode.tagName, ' with ', augmentation);
  });
}

function augment(vnode) {
  Object.keys(augmentationsBySelector).forEach((selector) => {
    console.log('trying to match ', selector, ' with ', vnode);
    if (true || Sizzle.matchesSelector(vnode, selector)) {
      performAugmentation(vnode, augmentationsBySelector[selector]);
    }
  });

  if (vnode.children) {
    vnode.children.forEach((child) => {
      augment(child);
    });
  }
}

const GlobalAugment = {
  install(Vue) {
    // Disable no-param-reassign since we need to patch the Vue we get passed as an argument
    /* eslint-disable no-param-reassign */
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


    // Vue uses dangling underscores internally, so we have no choice here either
    /* eslint-disable no-underscore-dangle */
    const oldRender = Vue.prototype._render;
    Vue.prototype._render = function newRender(...args) {
      const resultingVdom = oldRender.apply(this, args);

      augment(resultingVdom);

      return resultingVdom;
    };
  },
};

export default GlobalAugment;
