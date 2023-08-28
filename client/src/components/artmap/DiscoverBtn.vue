<template>
  <button
    v-show='loaded'
    class='btn btn-primary btn-discover btn-lg'
    :class='{exit_ready: discover_mode}'
    @click='toggleDiscoverMode'>
      <span v-if='!discover_mode'>Hide Navigation</span>
      <span v-else>Show Navigation</span>
  </button>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState('artmap', ['discover_mode', 'loaded'])
  },
  methods: {
    ...mapMutations('artmap', ['toggleDiscoverMode'])
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.btn-discover{
  position: absolute;
  top: 2.2rem;
  left: 15.8rem;
  z-index: 2;
  border: 2px solid $colors_primary;
  background-color:$colors_primary;
  &:focus{
    box-shadow: none
  }
  &.exit_ready{
    background-color:transparent;
    border:none;
    color:white;
    box-shadow: none;
  }
  span {
    font-size: .8rem;
  }
}
</style>
