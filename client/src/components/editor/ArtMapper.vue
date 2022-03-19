<template>
  <div id='artmapper-layer'>
    <Navigation />
    <div id="artmapbuild">
      <SideBar />
      <ArtCanvas />
      <DeleteModal />
      <PublishModal />
      <DeleteArtworkModal />
    </div>
  </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import SideBar from './sidebar/Sidebar.vue'
import ArtCanvas from './ArtCanvas.vue'
import DeleteModal from './DeleteModal.vue'
import DeleteArtworkModal from './DeleteArtworkModal.vue'
import PublishModal from './PublishModal.vue'
import Navigation from './Navigation.vue'
export default {
  data () {
    return {
      state: null
    }
  },
  name: 'artmapper',
  computed: {
    ...mapState('art', ['preview_state', 'viewer'])
  },
  methods: {
    ...mapActions('art', ['getArtData', 'getArtistData', 'getIIIFAsset']),
    ...mapMutations('art', ['initCanvas', 'artmapHasLoaded']),
    ...mapActions('point', ['getPoints']),
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
                // if (this.$route.params.pointSlug) {
                //   this.getArtPointOr404(this.$route.params.pointSlug)
                // } else {
                //   this.viewer.viewport.goHome(false)
                // }
                clearInterval(loadCheck)
              }
            }
          }
      }, 500)
    },
    createArtmap() {
      this.getArtData(this)
        .then((artResponse) => {
            this.getArtistData(artResponse.data.artist)
            this.getIIIFAsset(artResponse.data.iiif_uuid)
              .then((resp) => {
                this.getPoints()
                  .then((pointsResponse) => {
                    this.initCanvas()
                  })
                  .catch(err => {
                    console.log(err)
                  })
              })
              .catch(err => { console.log(err) })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.preloadArtCanvas()
    this.createArtmap(null)
  },
  components: {
    ArtCanvas: ArtCanvas,
    SideBar: SideBar,
    DeleteModal: DeleteModal,
    DeleteArtworkModal: DeleteArtworkModal,
    Navigation: Navigation,
    PublishModal: PublishModal
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
#artmapper {
  .art_controls, .art_meta, .art_points, .newpoint_form{
    position: relative;
    width:100%;
  }
  background-color:red;
  p{
    font-size:$font_size_body;
  }
}
#artmapper-layer{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 2;
}
</style>
