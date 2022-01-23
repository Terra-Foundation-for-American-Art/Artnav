<template>
  <div class="icon publish" v-html="PublishIcon"></div>
</template>

<script>
import PublishIcon from './publish.svg'
export default {
  data () {
    return {
      PublishIcon: PublishIcon
    }
  }
}
</script>
