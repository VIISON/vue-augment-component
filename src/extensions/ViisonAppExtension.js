import Vue from 'vue';
import ViisonEcosystem from '../components/ViisonEcosystem';

export default () => {
  Vue.insertComponentAfter(ViisonEcosystem, 'HelloWorld > Ecosystem');
  Vue.insertComponentBefore(ViisonEcosystem, 'HelloWorld > Ecosystem');
  Vue.appendChildComponentTo(ViisonEcosystem, 'HelloWorld');
  Vue.prependChildComponentTo(ViisonEcosystem, 'HelloWorld');

};

// Proposed async extension syntax

// (augmenter) => {
//   if (augmenter.componentName === 'HelloWorld') {
//     return asyncRequire('../components/ViisonEcosystem').then(ViisonEcosystem => augmenter.insertAfter(2, ViisonEcosystem));
//   }
// }
