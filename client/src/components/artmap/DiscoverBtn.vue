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
  top: 20px;
  left: 487px;
  z-index: 2;
  width: 240px;
  border: none;
  border-radius: 15px;
  padding: 13px 38px;
  background-color: #efe7d7;
  color: #222;
  font-family: Ginka, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: .05em;
  text-transform: uppercase;
  &:focus{
    box-shadow: none
  }
  &:hover{
    color: #222;
    background-color: #fffcf6;
  }
  &.exit_ready{
    background-color:transparent;
    border:none;
    color: #fffcf6;
    box-shadow: none;
  }
  span {
    font-size: 16px;
  }
}
</style>
