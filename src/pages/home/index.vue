<template>
  <div class="hello">
    <h3>{{ message }}</h3>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const message = ref<string>("Hello World!!!")
    return {
      message
    }
  }
})
</script>

<style lang="less">
h3 {
  margin: 40px 0 0;
  color: #42b983;
}
</style>