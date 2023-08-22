<template>
  <span v-show='loaded' class='main-menu-trigger' :class='{active: toggles.main_menu}' @click='toggleMainMenu'>
    <i v-show='!toggles.main_menu' class='info-menu'>i</i>
    <i v-show='toggles.main_menu' class="material-icons">&#xE5CD;</i>
  </span>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState('artmap', ['toggles', 'discover_mode', 'loaded'])
  },
  methods: {
    ...mapMutations('artmap', ['toggleMainMenu'])
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.main-menu-trigger{
  position: absolute;
  top:2rem;
  left: 2.6rem;
  display: block;
  width:2.7rem;
  height:2.7rem;
  border-radius:50%;
  background-color: white;
  text-align: center;
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 2;
  &.active{
    z-index:5;
  }
  i{
    @include font-size(1.3);
    position: relative;
    display: block;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.25s ease-in-out;
    &.info-menu{
      @include type_header_bold;
    }
  }
  &:hover{
    i{
      color:$colors_primary;
    }
  }
}
</style>
