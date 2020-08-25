<template>
  <div id="app">
    <center>
        <img class="image" id="text-img" alt="Vue logo" src="./assets/screen.png">
        <div class="all">
            <button class="btn" v-on:click="show">recognize</button>
        </div>
        <div v-show="showLoading" class="loader"></div>
        <div  v-bind:key="legal" v-for="legal in data">
            <div>
                <legal v-bind:legal="legal"/>
            </div>
        </div>
    </center>
  </div>
</template>

<script>
/* eslint-disable */
import { createWorker, PSM, OEM } from 'tesseract.js';
import legal from './legal'
const worker = createWorker({
  logger: m => console.log(m),
});


export default {
  name: 'app',
  components:{
         legal
    },
  methods: {
    recognize: async (context) => {
      const img = document.getElementById('text-img');
      console.log(img);
      await worker.load();
      await worker.loadLanguage('ara');
      await worker.initialize('ara', OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const { data: { text } } = await worker.recognize(img);
      context.hide(text);
      console.log(context);
      return text;
    } ,
    show() {
        this.data = null;
        this.showLoading = true;
        this.recognize(this);
    },
    hide(dataText) {
        this.textOCR = dataText;
        this.showLoading = false;
        this.textOCR = this.textOCR.replace(/\(.\)/g,"\n");
        this.textOCR = this.textOCR.replace(/[\n]+/g,"\n");
        let array = this.textOCR.split(/\.( )*\n/);
        this.data = array.filter(function (el) {
          return el != null && el.length > 10;
        });
        console.log(this.data);
    }
  },
  

  data: function() {
      return {
        data: null,
        showLoading: false,
        textOCR: '',
      }
    }
}
</script>

<style>
#app {
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.loader {
  margin-top: 100px;
  text-align: center;
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #1B1B1B; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.image {
  margin-left: 32px;
  margin-right: 32px;
  border-radius: 2px;
  width: 80%;
  height: auto;
  -webkit-filter: drop-shadow(5px 5px 5px #efefef);
  filter: drop-shadow(5px 5px 5px #efefef);
}

.btn {
  margin-top: 100px;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.all{
  width: 100%;
}


</style>
