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
    Vue.mixin({
      beforeCreate() {
          // Check whether the VNode is already patched
        const VNode = Vue.prototype._e('').constructor;
        if (Object.prototype.hasOwnProperty.call(VNode.prototype, 'nodeType')) {
          return;
        }

          // Apply patch
        Object.defineProperty(VNode.prototype, 'nodeType', {
          get: function nodeType() {
            return 1;
          },
        });
        Object.defineProperty(VNode.prototype, 'nodeName', {
          get: function nodeName() {
            if (this.componentOptions) {
              return this.componentOptions.tag.toLowerCase();
            } else if (this.tag) {
              return this.tag.toLowerCase();
            }
            return undefined;
          },
        });
        Object.defineProperty(VNode.prototype, 'parentNode', {
          get: function parentNode() {
            return this.parent;
          },
        });
        Object.defineProperty(VNode.prototype, 'childNodes', {
          get: function childNodes() {
            return this.children || [];
          },
        });
        VNode.prototype.getElementById = function getElementById(id) {
          if (this.data && this.data.attr) {
            return this.data.attr.id;
          }
          return undefined;
        };
        VNode.prototype.getElementsByTagName = function getElementsByTagName(tagName) {
          const lcTagName = tagName.toLowerCase();
          const matchingElements = [];
          this.childNodes.forEach((child) => {
            if (child.nodeName === lcTagName) {
              matchingElements.push(child);
            }
            child.getElementsByTagName(tagName).forEach((result) => {
              matchingElements.push(result);
            });
          });

          return matchingElements;
        };
      },
    });

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
