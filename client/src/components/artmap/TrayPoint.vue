<template>
  <div class='tray_item' :class='{active: local_data.current_point === point}' :id='point.id' @click='goTo'>
    <div class='row'>
      <div class='col-sm-3'>
        <div v-if='point.point_image' class='point_thumb' :style='"background-image:url("+point.point_image+");"'></div>
      </div>
      <div class='col-sm-9 tray_point_text'>
        <h2>{{point.point_title}}</h2>
        <p>{{point.point_lede}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import OpenSeadragon from 'openseadragon'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import {mapState} from 'vuex'
export default {
  props: ['point'],
  computed: {
    ...mapState('artmap', ['viewer', 'canvas', 'canvas_mask', 'local_data'])
  },
  methods: {
    goTo: function () {
      this.$router.push({ path: `/${this.point.point_slug}` })
    },
    renderQHtml: function (contentData) {
      var parsedOps = JSON.parse(contentData)
      var cfg = {}

      var converter = new QuillDeltaToHtmlConverter(parsedOps.ops, cfg)
      return converter.convert()
    },
    clearCanvas: function () {
      var localCtx = this.canvas_mask[0].getContext('2d')
      localCtx.clearRect(0, 0, this.canvas_mask[0].width, this.canvas_mask[0].height)
    },
    locatePoint: function () {
      var point = new OpenSeadragon.Point(this.point.x, this.point.y)
      this.viewer.viewport.panTo(point, false)
    },
    returnToOriginalPosition: function () {
      if (this.local_data.current_point) {
        var point = new OpenSeadragon.Point(this.local_data.current_point.x, this.local_data.current_point.y)
        var zoomVal = Number(this.local_data.current_point.zoom_value)
        this.viewer.viewport.zoomTo(zoomVal, false)
        this.viewer.viewport.panTo(point, false)
      } else {
        this.viewer.viewport.goHome(false)
      }
    },
    locateMouse: function (e) {
      this.clearCanvas()
      if (!this.$route.params.artmap) {
        var point = new OpenSeadragon.Point(this.point.x, this.point.y)
        var windowCoord = this.viewer.viewport.viewportToWindowCoordinates(point)
        var ctx = this.canvas_mask[0].getContext('2d')
        ctx.beginPath()
        ctx.moveTo(e.pageX, e.pageY)
        ctx.lineTo(windowCoord.x, windowCoord.y)
        ctx.stroke()
        ctx.strokeStyle = '#FFFFFF'
        ctx.arc(windowCoord.x, windowCoord.y, 2, 0, 2 * Math.PI)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
      }
    }
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.tray_item{
  position: relative;
  width:100%;
  padding: 0rem 1rem;
  border-radius: 0.4rem;
  background-color:rgba(255, 255, 255, 0);
  margin-bottom: 0.5rem;
  transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: pointer;
  h2{
    @include type_header_bold;
    color:$colors_primary_header;
  }
  p{
    color:#fff;
    margin-bottom:0;
    @include font-size(0.8);
  }
  .point_thumb{
    position: relative;
    padding: 2rem;
    border-radius:50%;
    border:2px solid treansparent;
    background-size: cover;
    background-repeat: no-repeat;
    top:50%;
    transform: translateY(-50%) scale(0.9);
    transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
    transform-origin:center;
  }
  .tray_point_text{
    padding: 1rem 2rem;
  }
  &:hover, &.active{
    background-color:rgba(255, 255, 255, 0.03);
    .point_thumb{
      transform: translateY(-50%) scale(0.95);
      border:2px solid $colors_primary;
    }
  }
  &:active{
    .point_thumb{
      transform: translateY(-50%) scale(1);
    }
  }
}
</style>
