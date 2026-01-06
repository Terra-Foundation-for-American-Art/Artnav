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
  top: 20px;
  left: 26px;
  display: block;
  width: 46px;
  height: 46px;
  border-radius:50%;
  background-color: #efe7d7;
  font-family: "Ginka", "Helvetica", Arial, sans-serif;
  font-weight: 300;
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
      color:#222;
    }
  }
}
</style>
