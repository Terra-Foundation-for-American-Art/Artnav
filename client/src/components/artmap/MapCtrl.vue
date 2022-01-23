<template>
  <div class='map-ctrls' v-show='discover_mode'>
    <span @click='viewer.viewport.goHome(false)' class='reset-btn' id='reset'><i class="material-icons">&#xE55C;</i></span>
    <span class='zooms'>
      <span @click='zoom(true)' class='zoom-btn' id='zoom-in'><i class="material-icons">&#xE145;</i></span>
      <span @click='zoom(false)' class='zoom-btn' id='zoom-out'><i class="material-icons">&#xE15B;</i></span>
    </span>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState('artmap', ['viewer', 'discover_mode', 'osd'])
  },
  methods: {
    zoom: function (inOrOut) {
      var level = Math.round(this.viewer.viewport.getZoom(true))
      if (inOrOut) {
        if (level < this.osd.maxZoomLevel) { level += 1 }
        this.viewer.viewport.zoomTo(level, false)
      } else {
        if (level >= 3) {
          level -= 1
          this.viewer.viewport.zoomTo(level, false)
        } else if (level >= 2) {
          this.viewer.viewport.goHome(false)
        }
      }
    }
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.map-ctrls{
  position: absolute;
  top:50%;
  right:2rem;
  transform: translateY(-50%);
  z-index: 2;
  text-align: center;
  .zoom-btn, .reset-btn{
    position: relative;
    display: block;
    padding: 0.4rem;
    background-color:white;
    height: 1.8rem;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
    i{
      font-size: 1.1rem;
    }
    span{
      display: block;
    }
    &:hover{
      background-color:#e4e4e4;
    }
    &:active{
      i{
        color:$colors_primary;
      }
    }
  }
  .zooms{
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.3);
  }
  .reset-btn{
    top:-4px;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.3);
  }
}
</style>
