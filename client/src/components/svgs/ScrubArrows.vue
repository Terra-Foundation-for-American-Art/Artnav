<template>
  <div class="icon artmaps" v-html="ScrubArrowsIcon"></div>
</template>

<script>
import ScrubArrowsIcon from './scrub-arrows.svg'
export default {
  data () {
    return {
      ScrubArrowsIcon: ScrubArrowsIcon
    }
  }
}
</script>
