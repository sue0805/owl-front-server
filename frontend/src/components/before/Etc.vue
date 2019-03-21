<template>
    <div class="etcMain" v-if="ready">
        <div class="compHead">
            DAILY VOCA
        </div>
        <transition enter-active-class="hinge animated" leave-active-class="hinge animated">
            <div class="etc-wrap" v-if="click" @click="change">
                <h1>{{todayEng.eng}}</h1>
                <hr>
                <h3>{{todayEng.ko}}</h3>
            </div>
        </transition>

        <div class="etc-wrap" v-if="!click" @click="change">
            <h1>{{todayEng.eng}}</h1>
            <hr>
            <h3>{{todayEng.ko}}</h3>
        </div>
    </div>    
</template>

<script>
import eng from '../../data/English.json'
export default {
    created(){
        this.todayEng = eng[Math.floor(Math.random() * this.MAX_LENGTH)];
        this.ready = true;
    },
    data(){
        return{
            ready: false,
            todayEng: [],
            MAX_LENGTH: 592,
            click: false
        }
    },
    methods: {
        change(){
            this.click = !this.click;
            this.todayEng = eng[Math.floor(Math.random() * this.MAX_LENGTH)];
        }
    }
}
</script>