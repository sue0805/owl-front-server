<template>
    <div>
                <!-- 모달   -->
        <div id="modal" v-if="showModal" v-on:click="closePortfolio"></div>

        <div>
            <transition enter-active-class="animated zoomIn faster" leave-active-class="animated zoomOut faster">
                <Owl :code="code" v-if="showOwl"/>
            </transition>
        </div>
    </div>
</template>

<script>
import Owl from '../etc/Owl'

export default {
    created(){
        this.$EventBus.$on('showPortfolio', this.showPortfolioAction);
        this.$EventBus.$on('closePortfolio', this.closePortfolio);
    },
    data(){
      return{
          showModal: false,
          showOwl: false,
          code: 0
      }
    },
    methods: {
        showPortfolioAction(num){
            this.showModal = true
            this.showOwl = true
            this.code = num
        },
        closePortfolio(){
            this.showModal = false
            this.showOwl = false
        }
    },
    components:{
        'Owl' : Owl
    }
}
</script>

<style>
#modal{
  position: fixed;
  display: block;
  width:100%;
  height:100vh;
  top:0;
  left:0;
  background-color: rgba(0,0,0,0.7);
}
</style>
