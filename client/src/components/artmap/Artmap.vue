<template>
  <div id='artmap_container'>
    <span v-if='editor_url' class='end_preview_btn' @click='endPreview'><i class="material-icons">&#xE5CD;</i> End Preview</span>
    <transition name="art_loaded">
      <div v-if='local_data.points' v-show='loaded' id='artmapcanvas' :class='{menuOpen: this.toggles.main_menu}'>
        <Point
          v-for='point in local_data.points'
          :key='"map_item" + point.id'
          :id='point.id'
          :point='point'/>
      </div>
    </transition>
    <transition name="loader">
      <Loader v-if='!loaded' />
    </transition>
    <PointTray />
    <InfoTray />
    <MapCtrl />
    <MainMenuBtn />
    <DiscoverBtn />
    <TerraLogo v-if='loaded' />
    <MainMenu />
  </div>
</template>
<script>
import OpenSeadragon from 'openseadragon'
import {mapState, mapMutations, mapActions} from 'vuex'
// import {eventsArtmap} from './../../EventBuses'
import Loader from './../loaders/Loader.vue'
import Point from './Point.vue'
import PointTray from './PointTray.vue'
import InfoTray from './InfoTray.vue'
import MapCtrl from './MapCtrl.vue'
import MainMenu from './MainMenu.vue'
import MainMenuBtn from './MainMenuBtn.vue'
import DiscoverBtn from './DiscoverBtn.vue'
import TerraLogo from './../svgs/TerraLogo.vue'
export default {
  computed: {
    ...mapState('artmap', ['viewer', 'local_data', 'toggles', 'discover_mode', 'loaded'])
  },
  data () {
    return {
      editor_url: window.artmap_builder_url ? window.artmap_builder_url : null
    }
  },
  watch: {
    $route: function (value) {
      if (this.loaded){
        if (value.params.pointSlug) {
          this.getArtPointOr404(value.params.pointSlug)
        } else {
          this.viewer.viewport.goHome(false)
        }
      } 
    }
  },
  methods: {
    ...mapMutations('artmap', ['initCanvas', 'convertAndSetPoints', 'setCurrentPoint', 'setInfoTrayOpen', 'setInfoTrayClose', 'toggleMainMenu', 'toggleDiscoverMode', 'artmapHasLoaded']),
    ...mapActions('artmap', [
      'getPoints', 
      'getArtData', 
      'getArtistData', 
      'getCatalogData',
      'getIIIFAsset'
    ]),
    endPreview: function () {
      window.location.href = this.editor_url
    },
    getArtPointOr404: function (urlSlug) {
      var foundArtPoint = this.local_data.points.filter((point) => {
        return point.point_slug === String(urlSlug)
      })
      if (foundArtPoint.length > 0) {
        if (!this.discover_mode) {
          this.toggleDiscoverMode()
        }
        this.setCurrentPoint(foundArtPoint[0])
        this.goTo(foundArtPoint[0])
        console.log(foundArtPoint[0])
        this.setInfoTrayOpen()
      } else {
        // go to 404
        this.setInfoTrayClose()
      }
    },
    goHome: function () {
      console.log(this.viewer)
      this.viewer.viewport.goHome(false)
    },
    goTo: function (focalPoint) {
      var coords = {
        x: Number(focalPoint.point_x),
        y: Number(focalPoint.point_y)
      }
      var point = new OpenSeadragon.Point(coords.x, coords.y)
      var zoomVal = Number(focalPoint.zoom_value)
      this.viewer.viewport.zoomTo(zoomVal, false)
      this.viewer.viewport.panTo(point, false)
      console.log(point)
    },
    setOverlays: function () {
      this.viewer.clearOverlays()

      if (this.local_data.points.all) {
        this.local_data.points.all.forEach(point => {
          var elt = document.createElement('div')
          elt.id = String(point.id)
          elt.className = 'artmap_point'

          var newPoint = {
            element: elt,
            placement: 'CENTER',
            checkResize: false,
            location: new OpenSeadragon.Point(Number(point.point_x), Number(point.point_y))
          }

          this.viewer.addOverlay(newPoint)
        })
      }
    },
    createArtmap() {
      this.getArtData(this)
        .then((artResponse) => {
          this.getArtistData(artResponse.data.artist)
          this.getCatalogData(artResponse.data.accession_number)
            .then((catalogResponse) => {
              this.getIIIFAsset(catalogResponse.data.iiif_uuid)
                .then((resp) => {
                  this.getPoints()
                    .then((pointsResponse) => {
                      this.initCanvas(pointsResponse.data)
                    })
                    .catch(err => {
                      console.log(err)
                    })
                })
                .catch(err => { console.log(err) })
            }).catch(err => { console.log(err) })
        })
        .catch(err => {
          console.log(err)
        })
    },
    preloadArtCanvas() {
      // There's no promise or nice callback from Openseadragon
      // so we watch the zoom canvas until something is rendered to it.
      // Then, emit a loading state.
      const loadCheck = setInterval(() => {
          // Preload is based on first tiled view of artwork being fully loaded and rendered to <canvas>:
          if (this.viewer) {
            const firstLoadItem = this.viewer.world.getItemAt(0)
            if (firstLoadItem) {
              const firstLoad = firstLoadItem.getFullyLoaded()
              if (firstLoad) {
                this.artmapHasLoaded(this)
                if (this.$route.params.pointSlug) {
                  this.getArtPointOr404(this.$route.params.pointSlug)
                } else {
                  this.viewer.viewport.goHome(false)
                }
                clearInterval(loadCheck)
              }
            }
          }
      }, 500)
    }
  },
  created () {
    this.preloadArtCanvas()
    this.createArtmap(null)
  },
  components: {
    Loader: Loader,
    Point: Point,
    PointTray: PointTray,
    InfoTray: InfoTray,
    MapCtrl: MapCtrl,
    MainMenu: MainMenu,
    MainMenuBtn: MainMenuBtn,
    DiscoverBtn: DiscoverBtn,
    TerraLogo: TerraLogo
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
#artmap_container, #artmapcanvas{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:$colors_artcanvas;
  overflow: hidden;
  canvas{
    z-index:1;
    &#canvas-mask{
      position: absolute;
      top:0;
      left:0;
      z-index: 3;
    }
  }
}
#artmapcanvas{
  z-index:1;
}
.end_preview_btn{
  background-color: #1b1b1b;
  color: white;
  padding: 0.4rem 1.1rem;
  position: absolute;
  top: 1rem;
  right: 2rem;
  z-index: 1000;
  cursor: pointer;
  border-radius: 1rem;
  i{
      vertical-align: middle;
  }
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
</style>
