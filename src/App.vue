<template>
  <div id="app">
    <center>
        <div class="switch-holder"><label class="switch"><input @click="onToggle" type="checkbox" id="togBtn"><div class="slider round"></div></label></div>
        <div v-if="isImage==true">
            <div>
              <p>Upload an image to Firebase:</p>
              <input type="file" @change="previewImage" accept="image/*" >
            </div>
            <div>
              <p>Progress: {{uploadValue.toFixed()+"%"}}
              <progress id="progress" :value="uploadValue" max="100" ></progress> </p>
            </div>
            <div v-if="imageData!=null">
              <img class="image" id="text-img" alt="Vue logo" :src="picture">
              <br>
              <button @click="onUpload">Upload</button>
            </div>
        </div>

        <textarea dir="rtl" v-model="textarea" v-if="isImage==false" class="textarea" id="textarea" name="textarea" rows="20" cols="100"></textarea>
        
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
import {config} from './helpers/firebaseConfig'
import firebase from 'firebase'
const worker = createWorker({
  logger: m => console.log(m),
});


export default {
  name: 'app',
  components:{
         legal
    },
  created(){
      firebase.initializeApp(config);
  },
  methods: {
    recognize: async (context) => {
      const img = context.imageData;
      console.log("image" + context.imageData);
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
        this.sleep(1000).then(() => {if(this.isImage == true){
          this.recognize(this);
        } else {
          this.texterize();
        }});
    },
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    texterize(){
        this.hide(this.textarea)
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
    },
    previewImage(event) {
      this.uploadValue=0;
      this.picture=null;
      this.imageData = event.target.files[0];
    },
    onUpload(){
      this.picture=null;
      const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error=>{console.log(error.message)},
      ()=>{this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.picture =url;
        });
      }
      );
    },
    onToggle(){
      console.log('togle')
      if(this.isImage){
        this.isImage = false;
      } else {
        this.isImage = true;
      }
    }
  },
  

  data: function() {
      return {
        data: null,
        showLoading: false,
        textOCR: '',
        imageData: null,
        picture: null,
        uploadValue: 0,
        isImage: true,
        textarea: null,
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

.textarea {

  margin-top: 100px;
  background-color: #FAFAFA;

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



//togle


.switch-holder {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 34px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 120px;
  height: 34px;
}

.switch input {display:none;}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #77aaff;
  -webkit-transition: .4s;
  transition: .4s;
   border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2ab934;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(85px);
}

/*------ ADDED CSS ---------*/
.slider:after
{
 content:'Image';
 color: white;
 display: block;
 position: absolute;
 transform: translate(-50%,-50%);
 top: 50%;
 left: 50%;
 font-size: 10px;
 font-family: Verdana, sans-serif;
}

input:checked + .slider:after
{  
  content:'Text';
}


</style>
