import Vue from 'vue';
import ExtensionA from './ExtensionA';
import WrapperExtension from './WrapperExtension';

export default () => {
  Vue.augmentComponent('OuterComponent').insertComponentBefore(ExtensionA, 'ComponentB');

  Vue.augmentComponent('OuterComponent').insertComponentAfter(ExtensionA, 'ComponentB');

  Vue.augmentComponent('OuterComponent').prependChildComponent(ExtensionA);

  Vue.augmentComponent('OuterComponent').appendChildComponent(ExtensionA);

  Vue.augmentComponent('OuterComponent').wrapComponentAround(WrapperExtension, 'ComponentA');
};
