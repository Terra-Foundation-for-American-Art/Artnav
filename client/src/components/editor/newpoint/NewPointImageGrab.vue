<template>
  <vue-draggable-resizable
    :class='{on: modes.new}'
    :draggable='draggableSwitch'
    @dragging='clearCaptureLens'
    @dragstop='updateTempPosition'
    class='drag_element'
    :w="30"
    :h="30"
    :x='x'
    :y='y'
    :resizable='true'
    :parent="true">
    <canvas
      id='snapshot'
      :width='scale_value'
      :height='scale_value'></canvas>
    <div
      class='scale_controls'
      @mouseover='draggableSwitch = false'
      @mouseleave='draggableSwitch = true'>
      <div v-show='modes.new' class='snapshot_take'>
        <span class='snapshot_btn yes' @click='capture'><CheckIcon /></span>
        <span class='snapshot_btn no' @click='handleCloseNewPoint'><XIcon /></span>
      </div>
      <!-- <transition name="scale-slider"> -->
      <!-- <Slider
        v-show='modes.new'
        :min='scale_min'
        :max='scale_max'
        :step='10'
        :show-stops='true'
        v-model='scale_value'/> -->
      <!-- <input 
        v-show='modes.new'
        type="range" 
        :min="scale_min" 
        :max="scale_max" 
        v-model='scale_value'> -->
        
      <div class='range_slider' v-show='modes.new'>
        <range-slider 
          :scale_min='scale_min'
          :scale_max='scale_max'
          :scale_value='scale_value'
          @rangeChange='(value) => { scale_value = value }'
        />
      </div>
      <!-- </transition> -->
    </div>
  </vue-draggable-resizable>
</template>
<script>

  import {mapState, mapMutations} from 'vuex'
  import VueDraggableResizable from './DraggableWrap.vue'
  import RangeSlider from './RangeSlider.vue'
  // import {eventsNewPoints, eventsSidebar} from './../../EventBuses'
  import OpenSeadragon from 'openseadragon'
  import CheckIcon from './../../svgs/Check.vue'
  import XIcon from './../../svgs/X.vue'
  export default {
    data () {
      return {
        snap_canvas: null,
        x: 0,
        y: 0,
        scale_value: 130,
        scale_max: 240,
        scale_min: 60,
        draggableSwitch: true,
        device_pixel_ratio: 1
      }
    },
    computed: {
      ...mapState('art', ['canvas', 'viewer']),
      ...mapState('point', ['modes', 'local_data'])
    },
    methods: {
      ...mapMutations('point', ['setCapturedThumb' ,'closeNewPoint', 'setNewPointCoords']),
      clearCaptureLens: function () {
        var local_ctx = this.snap_canvas.getContext('2d')
        local_ctx.clearRect(0, 0, this.snap_canvas.width, this.snap_canvas.height)
      },
      capture: function () {
        var vm = this
        var local_ctx = this.snap_canvas.getContext('2d')
        var res_ratio = Number(window.devicePixelRatio)
        var wrapX = this.$el.offsetLeft
        var wrapY = this.$el.offsetTop
        var padX = this.snap_canvas.offsetLeft
        var padY = (this.scale_max - this.scale_value) / 2
        // var thisX = wrapX + padX
        // var thisY = wrapY + padY
        // var thisX = wrapX
        // var thisY = wrapY

        var newX = wrapX - (this.scale_value/2)
        var newY = wrapY - (this.scale_value/2)
        // var newX = wrapX
        // var newY = wrapY

        console.log('new x:' + newX)
        console.log('new y:' + newY)

        var image = new Image()

        // CLEAR CANVAS:
        this.clearCaptureLens()

        image.onload = function() {
          local_ctx.drawImage(image, newX * res_ratio, newY * res_ratio, vm.scale_value * res_ratio, vm.scale_value * res_ratio, 0, 0, vm.scale_value, vm.scale_value)

          var thumbImage = new Image()

          thumbImage.onload = function () {
            $('#newArtPoint').modal('show')
          }
          thumbImage.src = vm.snap_canvas.toDataURL("image/jpg")
          var payload = {
            scale_value: vm.scale_value,
            image: thumbImage
          }
          vm.setCapturedThumb(payload)
        }

        image.src = this.canvas[0].toDataURL("image/jpg")
        this.setPointLocation(newX, newY)
      },
      setPointLocation: function (x, y) {
        this.clearTemporaryPin()
        var paddedX = x + (this.scale_value / 2)
        var paddedY = y + (this.scale_value / 2)
        var pixel = new OpenSeadragon.Point(paddedX, paddedY)
        var viewportPoint = this.viewer.viewport.pointFromPixel(pixel)
        var currentZoom = Number(this.viewer.viewport.getZoom(true))
        var roundedZoomNumber = Math.round(100 * currentZoom) / 100
        var payload = {
          x: String(viewportPoint.x.toFixed(5)),
          y: String(viewportPoint.y.toFixed(5)),
          zoom_value: roundedZoomNumber
        }
        this.setNewPointCoords(payload)
        var elt = document.createElement('span')
        elt.id = 'new-pin'
        elt.className = "osdOverlayWrap"
        var newlyDroppedPoint = {
          element: elt,
          placement: 'CENTER',
          checkResize: false,
          location: viewportPoint
        }
        this.viewer.addOverlay(newlyDroppedPoint)
      },
      clearTemporaryPin: function () {
        var overlayToRemove = document.getElementById('new-pin')
        if (overlayToRemove) this.viewer.removeOverlay(overlayToRemove)
      },
      setInitialGrabberPosition: function () {
        var parentW = document.getElementById("art_container").offsetWidth
        var parentH = document.getElementById("art_container").offsetHeight
        var elW = this.$el.offsetWidth
        var elH = this.$el.offsetHeight

        this.x = (parentW / 2) - (elW / 2)
        this.y = (parentH / 2) - (elH / 2)
      },
      updateTempPosition: function () {
        var wrapX = this.$el.offsetLeft
        var wrapY = this.$el.offsetTop
        var padX = this.snap_canvas.offsetLeft
        var padY = (this.scale_max - this.scale_value) / 2
        var thisX = wrapX + padX
        var thisY = wrapY + padY
        this.setPointLocation(thisX, thisY)
      },
      getTempPosition: function () {
        var storedX = Number(this.local_data.points.new.point_x)
        var storedY = Number(this.local_data.points.new.point_y)
        var pixel = new OpenSeadragon.Point(storedX, storedY)
        var viewportPixel = this.viewer.viewport.pixelFromPoint(pixel)
        var padX = this.snap_canvas.offsetLeft + (this.scale_value/2)
        var padY = this.snap_canvas.offsetTop
        var newX = viewportPixel.x - padX
        var newY = viewportPixel.y - padY

        this.x = newX
        this.y = newY
      },
      handleCloseNewPoint () {
        this.closeNewPoint({vm:this})
      }
    },
    components: {
      VueDraggableResizable,
      RangeSlider,
      // Slider: Slider,
      CheckIcon,
      XIcon,
    },
    mounted () {
      const vm = this;
      // this.snap_canvas = $('#snapshot')[0]
      this.snap_canvas = document.getElementById('snapshot');
      this.setInitialGrabberPosition()
      this.emitter.on('openImageGrabber', () => {
        this.clearCaptureLens()
        this.setInitialGrabberPosition()
      })
      this.emitter.on('sidebarAction', () => {
        if (this.local_data.points.new.point_x && this.local_data.points.new.point_y) {
        }
      })
      
      this.emitter.on('closeNewPointGrabber', () => {
        console.log('close grabber')
        console.log(vm)
        this.closeNewPoint({vm})
      })
    }
  }
</script>
<style lang='scss'>
div.vdr.drag_element{
  opacity: 0;
  visibility: hidden;
  &.on{
    opacity: 1;
    visibility: visible;
    .snapshot_take{
      transform: translateY(-50%) scale(1.0);
    }
  }
}
.scale_controls{
  position: fixed;
  top: calc(50% + 2rem);
  transform: translateY(-50%);
  // bottom: 0;
  right: 1.8rem;
  width: 2rem;
  height: 10rem;
  .snapshot_take{
    position: absolute;
    top: 50%;
    transform: translateY(-50%) scale(1.1);
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.2s ease-in-out 0.2s;
    .snapshot_btn{
      display: inline-block;
      width:2rem;
      height:2rem;
      border-radius:2rem;
      background-color:white;
      position: relative;
      // top:50%;
      // transform: translateY(-50%);
      text-align: center;
      .icon{
        position: relative;
        margin: 0 auto;
        top: 50%;
        transform: translateY(-50%);
        &.x-icon{
          width: 10px;
          height: 10px;
        }
        &.check{
          width: 13px;
          height: 10px;
        }
      }
      &.yes{
        float:right;
      }
      &.no{
        bottom: 0;
        position: absolute;
      }
    }
  }
}
.range_slider{
  position: fixed;
  width: 200px;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
}

#snapshot{
  margin: 0 auto;
  display: block;
  position: relative;
  // top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 2;
  border: 1px dashed #353535;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  // &:before{
  //   content: '';
  //   display: block;
  //   position: absolute;
  //   background-color:#000;
  //   height:4px;
  //   width:4px;
  //   border-radius:50%;
  //   left:50%;
  //   top:50%;
  //   transform: translateY(-50%) translateX(-50%);
  // }
}
.scale-slider-enter-active, .scale-slider-leave-active{
  transition: all .5s ease-in-out 0.2s;
  opacity: 1;
  transform: translateY(0px) translateX(-50%);
}
.scale-slider-enter, .scale-slider-leave-to{
  transition: all .5s ease-in-out 0s;
  opacity:0;
  transform: translateY(-10px) translateX(-50%);
}

@media
(-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
  .pixel-ratio-holder:before {
   content: "2";
  }
}
</style>

