<template>
  <vue-draggable-resizable
    :class='{on: captures.edit}'
    :draggable='draggableSwitch'
    class='drag_element'
    @dragging='clearCaptureLens'
    :w="30"
    :h="30"
    :x='x'
    :y='y'
    :resizable='true'
    :parent="true">
    <canvas
      id='snapshot_edit'
      :width='scale_value'
      :height='scale_value'></canvas>

    <span :class='{off: editing}' class='snapshot_btn edit_this_point' @click='setLocalEditMode(true)'>
      <PencilIcon />
    </span>
    <div
      class='scale_controls edit_point'
      :class='{active: editing}'
      @mouseover='draggableSwitch = false'
      @mouseleave='draggableSwitch = true'>

      <div class='snapshot_take'>
        <span class='snapshot_btn yes' @click='capture'><CheckIcon /></span>
        <span class='snapshot_btn no' @click='cancelEdit'><XIcon /></span>
      </div>
      <!-- <transition name="scale-slider"> -->
      <!-- <Slider
        v-show='captures.edit'
        :min='scale_min'
        :max='scale_max'
        :step='10'
        :show-stops='true'
        v-model='scale_value'/> -->

      <div class='range_slider' v-show='captures.edit'>
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
  // import {eventsArtCanvas, eventsPointEdits, eventsSidebar} from './../../EventBuses'
  import OpenSeadragon from 'openseadragon'
  import RangeSlider from './RangeSlider.vue'
  import CheckIcon from './../../svgs/Check.vue'
  import XIcon from './../../svgs/X.vue'
  import PencilIcon from './../../svgs/Pencil.vue'
  export default {
    data () {
      return {
        snap_canvas: null,
        img: null,
        editing: false,
        scale: 1,
        width: null,
        height: null,
        x: 0,
        y: 0,
        source_coords: null,
        scale_value: 130,
        scale_max: 240,
        scale_min: 60,
        draggableSwitch: false,
        canvas_width: 100,
        canvas_height: 100,
        device_pixel_ratio: 1
      }
    },
    computed: {
      ...mapState('art', ['canvas', 'viewer']),
      ...mapState('point', ['captures', 'local_data'])
    },
    methods: {
      ...mapMutations('point', ['setCapturedThumb' ,'closeNewPoint', 'setEditPointCoords', 'showNewPoint', 'setEditCaptureThumb']),
      clearCapture: function () {
        this.editing = false
        this.setEditCaptureThumb(false)
        this.clearCaptureLens()
      },
      clearCaptureLens: function () {
        var local_ctx = this.snap_canvas.getContext('2d')
        local_ctx.clearRect(0, 0, this.snap_canvas.width, this.snap_canvas.height)
      },
      cancelEdit: function () {
        this.editing = false
        this.scale_value = this.local_data.points.edit.scale_value
        this.setLocalEditMode(false)
        this.setInitialGrabberPosition()
      },
      setLocalEditMode: function (editing) {
        if (editing) {
          this.editing = true
          this.draggableSwitch = true
        } else {
          this.editing = false
          this.draggableSwitch = false
        }
      },
      capture: function () {
        var vm = this
        // this.snap_canvas = $('#snapshot_edit')[0]
        this.snap_canvas = document.getElementById('snapshot_edit');
        var local_ctx = this.snap_canvas.getContext('2d')
        var res_ratio = Number(window.devicePixelRatio)
        var wrapX = this.$el.offsetLeft
        var wrapY = this.$el.offsetTop
        // var padX = this.snap_canvas.offsetLeft
        // var padY = (this.scale_max - this.scale_value) / 2
        // var thisX = wrapX + padX
        // var thisY = wrapY + padY
        var thisX = wrapX - (this.scale_value/2)
        var thisY = wrapY - (this.scale_value/2)
        // var thisX = wrapX
        // var thisY = wrapY

        var image = new Image()

        // CLEAR CANVAS:
        local_ctx.clearRect(0, 0, this.snap_canvas.width, this.snap_canvas.height)

        image.onload = function() {
          local_ctx.drawImage(image, thisX * res_ratio, thisY * res_ratio, vm.scale_value * res_ratio, vm.scale_value * res_ratio, 0, 0, vm.scale_value, vm.scale_value)
          var thumbImage = new Image()
          thumbImage.onload = function () {
            vm.emitter.emit('triggerEditPoint', thumbImage)
          }
          thumbImage.src = vm.snap_canvas.toDataURL()
          var payload = {
            size: vm.scale_value,
            image: thumbImage
          }
          vm.setEditCaptureThumb(payload)
        }
        image.src = this.canvas[0].toDataURL()
        this.setPointLocation(thisX, thisY)
      },
      setPointLocation: function (x, y) {

        this.clearTemporaryPin()
        var paddedX = x + (this.scale_value / 2)
        var paddedY = y + (this.scale_value / 2)
        var pixel = new OpenSeadragon.Point(paddedX, paddedY)
        var viewportPoint = this.viewer.viewport.pointFromPixel(pixel)
        var currentZoom = Number(this.viewer.viewport.getZoom(true))
        var roundedZoomNumber = Math.round(currentZoom)
        var payload = {
          x: String(viewportPoint.x.toFixed(5)),
          y: String(viewportPoint.y.toFixed(5)),
          zoom_value: roundedZoomNumber
        }
        this.setEditPointCoords(payload)
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
      setEditPointPosition: function () {
        var storedX = Number(this.local_data.points.edit.point_x)
        var storedY = Number(this.local_data.points.edit.point_y)
        var pixel = new OpenSeadragon.Point(storedX, storedY)
        var viewportPixel = this.viewer.viewport.pixelFromPoint(pixel)
        var padX = this.snap_canvas.offsetLeft
        var padY = this.snap_canvas.offsetTop
        // var newX = viewportPixel.x - padX
        // var newY = viewportPixel.y - padY
        var newX = viewportPixel.x
        var newY = viewportPixel.y

        this.x = newX
        this.y = newY

        console.log('x:' + newX)
      },
      setInitialGrabberPosition: function () {
        var containerEL = document.getElementById("art_container")
        if (containerEL) {
          var parentW = containerEL.offsetWidth
          var parentH = containerEL.offsetHeight
          var elW = this.$el.offsetWidth
          var elH = this.$el.offsetHeight

          this.x = (parentW / 2) - (elW / 2)
          this.y = (parentH / 2) - (elH / 2)
        }
      }
    },
    components: {
      VueDraggableResizable,
      RangeSlider,
      CheckIcon,
      XIcon,
      PencilIcon,
    },
    mounted () {
      // this.snap_canvas = $('#snapshot_edit')[0]
      this.snap_canvas = document.getElementById('snapshot_edit');
      console.log(this.snap_canvas)
      this.setInitialGrabberPosition()
      // IF USER SELECTS EDIT OPTION FROM POINT LIST ITEM
      // WE NEED TO RECAPTURE THE BASE64 IMAGE VALUE SO THAT
      // WE CAN RESUBMIT TO API IN THE CORRECT FORMAT:
      this.emitter.on('recaptureFromThumb', () => {
        this.capture()
      })
      this.emitter.on('locateEdit', () => {
        this.setEditPointPosition()
        this.clearCapture()
        this.scale_value = this.local_data.points.edit.scale_value
      })
      // this.emitter.on('resetImageGrabber', () => {
      // //   this.setInitialGrabberPosition()
      // //   this.clearCapture()
      // })
      this.emitter.on('clearEdit', () => {
        this.clearCapture()
      })
      window.addEventListener('resize', () => {
        this.setInitialGrabberPosition()
      })
      this.emitter.on('sidebarAction', () => {
        this.setInitialGrabberPosition()
      })
    }
  }
</script>
<style lang='scss'>
.snapshot_btn.edit_this_point{
  display: block;
  width:2rem;
  height:2rem;
  border-radius:2rem;
  background-color:white;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  z-index: 3;
  .icon{
    position: relative;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-40%);
    width: 0.86rem;
  }
  &.off{
    visibility: hidden;
    opacity: 0;
  }
}
.scale_controls{
  &.edit_point{
    opacity: 0;
    visibility: hidden;
    &.active{
      opacity: 1;
      visibility: visible;
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
#snapshot_edit{
  // margin: 0 auto;
  // display: block;
  // position: relative;
  // top: 50%;
  // transform: translateY(-50%);
  // z-index: 2;
  // border: 1px dashed #353535;
  // background-color: rgba(255, 255, 255, 0.5);
  // border-radius: 50%;
  margin: 0 auto;
  display: block;
  position: relative;
  // top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 2;
  border: 1px dashed #353535;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}
// .scale-slider-enter-active, .scale-slider-leave-active{
//   transition: all .5s ease-in-out 0.2s;
//   opacity: 1;
//   transform: translateY(0px) translateX(-50%);
// }
// .scale-slider-enter, .scale-slider-leave-to{
//   transition: all .5s ease-in-out 0s;
//   opacity:0;
//   transform: translateY(-10px) translateX(-50%);
// }

@media
(-webkit-min-device-pixel-ratio: 2),
(min-resolution: 192dpi) {
  .pixel-ratio-holder:before {
   content: "2";
  }
}
</style>

