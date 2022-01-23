<template>
  <span
    class='artmap_point'
    :class='[{active: local_data.current_point === point}, {ready: discover_mode}]'
    :id='point.id'
    @click='handlePointClick(point.point_slug)'>
    <!-- <i class="material-icons expand_plus">&#xE145;</i> -->
    <svg class='point_el' width="34" height="34">
      <circle cx="16" cy="16" r="15" transform="" class="outer"></circle>
    </svg>
  </span>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  props: ['point'],
  computed: {
    ...mapState('artmap', ['viewer', 'local_data', 'discover_mode'])
  },
  methods: {
    ...mapMutations('artmap', ['setInfoTrayClose', 'setInfoTrayOpen']),
    handlePointClick: function (url) {
      if (this.local_data.current_point === this.point) {
        this.setInfoTrayClose()
        this.$router.push({ path: `/` })
      } else {
        this.$router.push(url)
      }
    }
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.artmap_point{
  position: relative;
  width:2rem;
  height:2rem;
  z-index: 3;
  cursor: pointer;
  opacity: 0;
  transition:opacity 0.2s ease-in-out;
  i{
    display: block;
    margin: 0 auto;
    position: relative;
    top: 50%;
    text-align: center;
    transform: translateY(-50%) rotateZ(0deg) scale(0.9);
    color:white;
    transition: all 0.2s ease-in-out;
  }
  .point_el{
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0.9) translateX(-50%) translateY(-50%);
    transition: all 0.2s ease-in-out;
  }
  .outer{
    fill: rgba(255, 255, 255, 0.2);
    stroke: rgba(255, 255, 255, 0.65);
    stroke-width: 1px;
    stroke-dasharray: 534;
    transition: stroke-dashoffset 1s;
    // -webkit-animation-play-state: running;
    /* firefox bug fix - won't rotate at 90deg angles */
    // -moz-transform: rotate(-89deg) translateX(-190px);
    animation: show100 2s;
  }
  .inner{
    fill: #fff;
    stroke: transparent;
    stroke-width: 1px;
  }
  @keyframes show100 {
    from {
      stroke-dashoffset: 537;
    }

    to {
      stroke-dashoffset: 0;
    }
  }
  &.ready{
    opacity:1;
  }
  &.active{
    opacity: 0;
  }
}
</style>
