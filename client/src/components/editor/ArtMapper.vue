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
import {mapState, mapActions} from 'vuex'
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
    ...mapState('art', ['preview_state'])
  },
  methods: {
    ...mapActions('art', ['getArtData']),
    ...mapActions('point', ['getPoints'])
  },
  created () {
    this.getArtData(this)
    console.log(window.art_image)
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
