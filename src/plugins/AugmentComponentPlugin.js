import VnodeDomInterfaceMixin from './VnodeDomInterfaceMixin';
import ComponentAugmentation from './ComponentAugmentation';

const AugmentComponentPlugin = {
  install(Vue) {
    // Disable no-param-reassign since we need to patch the Vue we get passed as an argument
    /* eslint-disable no-param-reassign */

    // Vue uses dangling underscores internally, so we have no choice here either
    /* eslint-disable no-underscore-dangle */

    Vue.mixin(VnodeDomInterfaceMixin(Vue));

    Vue.augmentComponent = selector => ComponentAugmentation.create(selector);

    const oldRender = Vue.prototype._render;
    Vue.prototype._render = function newRender(...args) {
      const originalVdom = oldRender.apply(this, args);

      return ComponentAugmentation.render(this, originalVdom);
    };
  },
};

export default AugmentComponentPlugin;
