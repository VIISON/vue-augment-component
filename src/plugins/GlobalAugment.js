import ComponentAugmentation from './ComponentAugmentation';

const allComponentAugmentations = {};

const GlobalAugment = {
  install(Vue, options) {
    Vue.augment = (componentName) => {
      let componentAugmentations = allComponentAugmentations[componentName];
      if (!componentAugmentations) {
        componentAugmentations = [];
        allComponentAugmentations[componentName] = componentAugmentations;
      }

      const componentAugmentation = new ComponentAugmentation(componentName);
      componentAugmentations.push(componentAugmentation);

      return componentAugmentation;
    };

    const oldRender = Vue.prototype._render;
    Vue.prototype._render = function newRender() {
      const args = arguments;
      let resultingVdom = oldRender.apply(this, arguments);
      const { _componentTag: tag } = this.$options || {};
      if (tag && allComponentAugmentations[tag]) {
        for (const augmentation of allComponentAugmentations[tag]) {
          resultingVdom = augmentation.performAugmentation(this, resultingVdom);
        }
      }

      return resultingVdom;
    }
  },
};

export default GlobalAugment;
