<template>
  <div class='loading'>
    <div class="loading-bro">
      <h1>Loading</h1>
      <svg class="loadsvg" x="0px" y="0px" viewBox="0 0 150 150">
        <circle class="loading-inner" cx="75" cy="75" r="60" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
    created(){
        setTimeout(()=>{this.$EventBus.$emit('goAfterPage')}, 100)
    },
  }
</script>
