import Vue from 'vue';
import ExtensionA from './ExtensionA';
import WrapperExtension from './WrapperExtension';

export default () => {
  Vue.augmentComponent('OuterComponent')
    .insertComponentBefore(ExtensionA, 'ComponentB')
    .insertComponentAfter(ExtensionA, 'ComponentB')
    .prependChildComponent(ExtensionA)
    .appendChildComponent(ExtensionA)
    .wrapComponentAround(WrapperExtension, 'ComponentA');
};
