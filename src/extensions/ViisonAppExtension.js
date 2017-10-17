import Vue from 'vue';
import ViisonEcosystem from '../components/ViisonEcosystem';

export default () => {
  Vue.augment('HelloWorld').insertAfter(2, ViisonEcosystem);
};

// Proposed async extension syntax

// (augmenter) => {
//   if (augmenter.componentName === 'HelloWorld') {
//     return asyncRequire('../components/ViisonEcosystem').then(ViisonEcosystem => augmenter.insertAfter(2, ViisonEcosystem));
//   }
// }
