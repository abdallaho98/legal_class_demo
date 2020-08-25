<template>
    <div class="legal-item">
    <h2 class="text">{{legal}}</h2>
    </div>
</template>

<script>
export default {
    name:'item',
    props: ['legal'],
    
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
</style>