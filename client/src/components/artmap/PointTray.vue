<template>
  <div v-show='local_data.points && local_data.points.length > 0 && !discover_mode' class='point_tray_wrap' :class='{open: open}'>
    <div id='point_tray'>
      <div class='point-tray-intro' v-if='local_data.artist && local_data.art'>
        <h1>{{local_data.art.artwork_title}}</h1>
        <p class='artist-name'>By {{local_data.artist.artist_name}}</p>
        <p class='creation-date'>Created in {{local_data.art.artwork_creation_date}}</p>
      </div>
      <TrayPoint
      v-if='local_data.points'
      v-for='point in local_data.points'
      :key='"tray_item_" + point.id'
      :point='point'/>
    </div>
    <span class='sidebar_reveal' :class='{open: open}' @click='open = !open'>Explore the Artwork <DoubleArrow class='point_tray_reveal_btn' /></span>
    <div id='viewfinder-wrap'>
      <div id='artmap-viewfinder'></div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import TrayPoint from './TrayPoint.vue'
import DoubleArrow from './../svgs/DoubleArrow.vue'
export default {
  data () {
    return {
      open: false
    }
  },
  computed: {
    ...mapState('artmap', ['local_data', 'discover_mode'])
  },
  components: {
    TrayPoint: TrayPoint,
    DoubleArrow: DoubleArrow
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.point_tray_wrap{
  position: absolute;
  top:0;
  left:0;
  width: 400px;
  height:100%;
  padding:1.5rem;
  transform: translate3d(-400px, 0rem, 0rem);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.6, 1);
  z-index: 3;
  &.open{
    transform: translate3d(0rem, 0rem, 0rem);
  }
  .sidebar_reveal{
    display: block;
    position: absolute;
    right: 82px;
    top: 50%;
    transform: translateX(14.5rem) translateY(-50%) rotate(90deg);
    background-color: #5f1718;
    border-width: 2px 2px 0 2px;
    border-style: solid;
    border-color: #5f1718;
    padding: 16px 22px 12px 22px;
    border-radius: 30px 30px 0 0;
    cursor: pointer;
    transition: all .2s ease-in-out;
    color: #fffcf6;
    font-weight: 300;
    font-size: 20px;
    line-height: 1.2;
    .icon{
      width: 6px;
      height: auto;
      display: inline-block;
      transform: rotate(-90deg) translateX(-1px);
      margin-left: 8px;
      transition: all .2s ease-in-out;
      color: #fffcf6;
    }
    #double-arrow-icon .cls-1{
      stroke:#fffcf6;
    }
    &:hover{
      color:#fffcf6;
      .icon{
        color:#fffcf6;
      }
    }
    &.open{
      color:#fffcf6;
      .icon{
        color:#fffcf6;
        transform: rotate(90deg) translateX(-1px);
      }
    }
  }
  #viewfinder-wrap{
    position: absolute;
    bottom: 1rem;
    right: -9rem;
    z-index: 5;
    width:7rem;
    height:7rem;
    overflow: hidden;
    #artmap-viewfinder{
      width: 100%;
      height: 100%;
    }
    #artmap-viewfinder-displayregion {
      border-width: 1px !important;
      border-color: #ffffff !important;
      background-color: rgba(255, 255, 255, 0.25) !important;
      z-index: 9999999 !important;
      cursor: pointer;
    }
    .openseadragon-canvas{
      z-index: 0;
    }
    #artmap-viewfinder-displayregioncontainer{
      z-index: 2;
      height: 120px;
    }
  }
}
#point_tray{
  background-color: #5f1718;
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 2;
  overflow-y:scroll;
  overflow-x:hidden;
  padding: 1rem;
  .point-tray-intro{
    position: relative;
    padding: 20px;
    h1{
      font-family: Fragment, Helvetica, Arial, sans-serif;
      font-size: 30px;
      font-weight: 300;
      color: #fffcf6;
      margin-bottom:0.5rem;
    }
    p{
      margin-bottom:0.3rem;
    }
    .artist-name{
      color: #fffcf6;
      font-family: Ginka, Helvetica, Arial, sans-serif;
      font-size: 18px;
    }
    .creation-date{
      color: #fffcf6;
      font-family: Ginka, Helvetica, Arial, sans-serif;
      font-size: 18px;
    }
  }
}
</style>
