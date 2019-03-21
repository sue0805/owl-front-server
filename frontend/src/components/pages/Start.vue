<template>
  <div class='start'>
    <div id="start-ui">
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
      <div class="start-text">OWL</div>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      setTimeout(() => {
        this.$EventBus.$emit('goBeforePage')
      }, 6000)
    },
    data() {
      return {
        loading: '',
      }
    }
  }

</script>
