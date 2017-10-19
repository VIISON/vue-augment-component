import Vue from 'vue';
import ViisonEcosystem from '../components/ViisonEcosystem';
import ViisonWrapper from '../components/ViisonWrapper';
import ViisonGreeting from '../components/ViisonGreeting';

export default () => {
  // Vue.augmentComponent('App HelloWorld').insertComponentBefore(ViisonEcosystem, 'Ecosystem');
  Vue.augmentComponent('HelloWorld').insertComponentBefore(ViisonEcosystem, 'Ecosystem');

  Vue.augmentComponent('HelloWorld').insertComponentAfter(ViisonEcosystem, 'Ecosystem');

  Vue.augmentComponent('HelloWorld').prependChildComponent(ViisonEcosystem);

  Vue.augmentComponent('HelloWorld').appendChildComponent(ViisonEcosystem);

  Vue.augmentComponent('HelloWorld').wrapComponentAround(ViisonWrapper, 'EssentialLinks');

  Vue.augmentComponent('App > HelloWorld > Ecosystem').insertComponentAfter(ViisonGreeting, 'h2');
};
