import ComponentAugmentation from './ComponentAugmentation';

const AugmentComponentPlugin = {
  install(Vue) {
    // Disable no-param-reassign since we need to patch the Vue we get passed as an argument
    /* eslint-disable no-param-reassign */

    Vue.augmentComponent = selector => ComponentAugmentation.create(selector);

    const oldRender = Vue.prototype._render;
    Vue.prototype._render = function newRender(...args) {
      const originalVdom = oldRender.apply(this, args);

      return ComponentAugmentation.render(this, originalVdom);
    };
  },
};

export default AugmentComponentPlugin;
