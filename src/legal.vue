<template>
    <div class="legal-item">
        <h2 class="text">{{legal}}</h2>
        <center>
            <div>
                <div class="horiz"><vc-donut :size="120" :sections="sections0" :thickness="30"><h2>droit</h2><h1 ref="droit">HH</h1></vc-donut></div>
                <div class="horiz"><vc-donut :size="120" :sections="sections1" :thickness="30"><h2>permission</h2><h1 ref="perm"></h1></vc-donut></div>
                <div class="horiz"><vc-donut :size="120" :sections="sections2" :thickness="30"><h2>obligation</h2><h1 ref="oblg"></h1></vc-donut></div>
                <div class="horiz"><vc-donut :size="120" :sections="sections3" :thickness="30"><h2>prohibition</h2><h1 ref="proh"></h1></vc-donut></div>
                <div class="horiz"><vc-donut :size="120" :sections="sections4" :thickness="30"><h2>autre</h2><h1 ref="autr"></h1></vc-donut></div>
            </div>
        </center>
    </div>
</template>

<script>

import Donut from 'vue-css-donut-chart';
import axios from 'axios';

export default {
    name:'item',
    props: ['legal'],
    components: [
        Donut
    ],
    data () {
      return {
        sections0: [
          { label: 'Blue section', value: 25, color: '#4d73bf' }
        ] ,
        sections1: [
          { label: 'Blue section', value: 25, color: '#df8342' }
        ] ,
        sections2: [
          { label: 'Blue section', value: 25, color: '#f6c343' }
        ] ,
        sections3: [
          { label: 'Blue section', value: 25, color: '#a6a6a6' }
        ] ,
        sections4: [
          { label: 'Blue section', value: 25, color: '#6a9cd1' }
        ] ,
        url : "http://127.0.0.1:5000/",
      }
    },
    mounted() {
        axios.post(`${this.url}/classify`,{
                text : this.legal ,
            }).then((response) => {
                this.sections0[0].value = response.data.classes[0] * 100;
                this.$refs["droit"].innerText = Math.round(this.sections0[0].value*100)/100 + "%";
                this.sections1[0].value = response.data.classes[1] * 100;
                this.$refs["perm"].innerText = Math.round(this.sections1[0].value*100)/100 + "%";
                this.sections2[0].value = response.data.classes[2] * 100;
                this.$refs["oblg"].innerText = Math.round(this.sections2[0].value*100)/100 + "%";
                this.sections3[0].value = response.data.classes[3] * 100;
                this.$refs["proh"].innerText = Math.round(this.sections3[0].value*100)/100 + "%";
                this.sections4[0].value = response.data.classes[4] * 100;
                this.$refs["autr"].innerText = Math.round(this.sections4[0].value*100)/100 + "%";
            })
    },
}
</script>

<style>

    .legal-item{
        z-index: 5;
        border: 24px;
        margin-top: 100px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        border-radius: 5px; /* 5px rounded corners */ 
        padding: 8px 32px 8px 32px;
        line-height: 10px;
        width: 80%;
        text-align: right;
        display: inline-block;
    }

    .text{
        line-height: 32px;
    }

    .horiz{
        display: inline;
        display: inline-block;
        margin: 32px;
    }

</style>