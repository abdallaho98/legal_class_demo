import Vue from 'vue'
import App from './App.vue'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

Vue.use(Donut);

Vue.config.productionTip = false

Vue.directive('visible', function(el, binding) {
	el.style.visibility = binding.value ? 'visible' : 'hidden';
});

new Vue({
  render: h => h(App),
}).$mount('#app')
