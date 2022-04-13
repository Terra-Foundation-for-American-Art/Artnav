<template>
  <div id='art_container'>
    <NewPointButton />
    <NewPointImageGrab />
    <EditPointImageGrab />
    <NewPointModal />
    <EditPointModal />
    <transition name="alert">
      <div v-if='validation.messages_alert.show' class="artmap_builder_alerts alert alert-success">{{ validation.messages_alert.message }}</div>
    </transition>
    <transition name="alert">
      <div v-if='art_validation.messages_alert.show' class="artmap_builder_alerts alert alert-success">{{ art_validation.messages_alert.message }}</div>
    </transition>
    <transition name="art_loaded">
      <div v-show='loaded' id='artcanvas'></div>
    </transition>
    <transition name="loader">
      <Loader v-if='!loaded' />
    </transition>
  </div>
</template>
<script>
import OpenSeadragon from 'openseadragon'
import './../vendor/viewerinputhook.min.js'
import { mapState, mapMutations, mapActions } from 'vuex'
import Loader from './../loaders/Loader.vue'
import NewPointButton from './newpoint/NewPointButton.vue'
import NewPointImageGrab from './newpoint/NewPointImageGrab.vue'
import EditPointImageGrab from './newpoint/EditPointImageGrab.vue'
import NewPointModal from './newpoint/NewPointModal.vue'
import EditPointModal from './sidebar/EditPointModal.vue'
export default {
  computed: {
    ...mapState('art', ['viewer', 'loaded', 'imgShell', 'art_validation']),
    ...mapState('point', ['local_data', 'modes', 'validation']),
    ...mapState('sidebar', ['open'])
  },
  watch: {
    'local_data.points.all': function () {
      this.resetOverlays()
    },
    'modes.new': function (value) {
      value ? this.viewer.zoomPerClick = 1 : this.viewer.zoomPerClick = 2
    }
  },
  methods: {
    ...mapMutations('art', ['initCanvas']),
    ...mapMutations('point', ['setNewPointCoords', 'setEditingPoint', 'setEditCaptureThumb']),
    ...mapActions('point', ['getPoints']),
    ...mapActions('art', ['preloadArtCanvas']),
    resetZoom: function () {
      this.viewer.viewport.goHome(false)
    },
    resetOverlays: function () {
      this.viewer.clearOverlays()

      if (this.local_data.points.all) {
        this.local_data.points.all.forEach(point => {
          var elt = document.createElement('span')
          elt.id = String(point.id)
          elt.className = 'osdOverlayWrap'
          var newPoint = {
            element: elt,
            placement: 'CENTER',
            checkResize: false,
            location: new OpenSeadragon.Point(Number(point.point_x), Number(point.point_y))
          }
          this.viewer.addOverlay(newPoint)
        })
      }
      this.emitter.emit('overlayResetOcurred')
    },
    revertToNormalViewerMode: function (event) {
      this.setEditingPoint(false)
      this.setEditCaptureThumb(false)
      this.emitter.emit('clearEdit')
      // upgrade this to be if point is a certain distance on dragend from where it was,
      // have it dissappear and restore mouse events as handled above
    },
    handleEditModeInteraction: function (event) {},
    initCanvasClicks: function () {
      this.viewer.addViewerInputHook({hooks: [
        {tracker: 'viewer', handler: 'dragHandler', hookHandler: this.revertToNormalViewerMode},
        {tracker: 'viewer', handler: 'clickHandler', hookHandler: this.handleEditModeInteraction}
      ]})
    },
    clearTemporaryPin: function () {
      var overlayToRemove = document.getElementById('new-pin')
      if (overlayToRemove) this.viewer.removeOverlay(overlayToRemove)
    }
  },
  mounted () {
    this.emitter.on('cancelAnyNewPoint', () => {
      this.resetOverlays()
    })
    this.emitter.on('artworkHasLoaded', () => {
      this.getPoints(this)
      setTimeout(() => {
        this.viewer.preserveImageSizeOnResize = true
      }, 1000)
    })
  },
  components: {
    Loader: Loader,
    NewPointButton: NewPointButton,
    NewPointImageGrab: NewPointImageGrab,
    NewPointModal: NewPointModal,
    EditPointModal: EditPointModal,
    EditPointImageGrab: EditPointImageGrab
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/_mixins.scss';
@import './../../style/sass/abstracts/_variables.scss';
#art_container{
  position: absolute;
  top:0;
  left:0rem;
  width:100%;
  height:100%;
  background-color:$colors_artcanvas;
  overflow: hidden;
  transition:all 0.3s ease-in-out;
  &.side_open{
    left:20rem;
    width:calc(100% - 20rem);
  }
  #imgShell{
    position: relative;
    width:100%;
    height:auto;
  }
  .artmap_builder_alerts{
    position: absolute;
    top:0;
    left:0;
    left: 0;
    width: 100%;
    z-index: 1002;
  }
  #artcanvas{
    position: absolute;
    top:0;
    left:0rem;
    width:100%;
    height:100%;
    z-index: 2;
    .osdOverlayWrap{
      visibility: hidden;
      opacity: 0;
      width:4.5rem;
      height:4.5rem;
      .snapshot_btn{
        display: block;
        width:2rem;
        height:2rem;
        border-radius:2rem;
        background-color:white;
        position: relative;
        text-align: center;
        #pencil-icon{
          position: relative;
          margin: 0 auto;
          display: block;
          width:1rem;
          height:1rem;
        }
      }
    }
  }
}
.reset_zoom{
  background-color:$colors_primary;
  color:white;
  padding: 0.6rem;
  height: 2.2rem;
  text-align: center;
  z-index: 3;
  position: absolute;
  bottom:0;
  left:0;
}
.art_loaded-enter-active, .art_loaded-leave-active{
  transition: all .5s;
  opacity: 1;
  transform: scale(1);
}
.art_loaded-enter, .art_loaded-leave-to{
  opacity:0;
  transform: scale(0.8);
}
.loader-enter-active, .loader-leave-active{
  transition: all .5s;
  opacity: 1;
}
.loader-enter, .loader-leave-to{
  opacity: 0;
}
.alert-enter-active, .alert-leave-active{
  transition: all .5s;
  opacity: 1;
  transform: translateY(0%);
}
.alert-enter, .alert-leave-to{
  opacity: 0;
  transform: translateY(-101%);
}
</style>
