<template>

  <div id='art_mapper_sidebar' :class='{open: open}'>

    <div class='sidebar_wrap'>
        <div class='sidebar_header'>
            <p>Your Points</p>
        </div>
      <div class='art_points'>

        <PointList/>

      </div>
    </div>

    <span class='sidebar_reveal' @click='toggleTheSidebar'>Show Artmap Points <span class='arrow'></span></span>
    <!-- <div class='click-bg'></div> -->

  </div>

</template>
<script>
// import NewPointCtrl from './NewPointCtrl.vue'
// import {eventsSidebar, eventsPointEdits} from './../../EventBuses'
import {mapState, mapMutations} from 'vuex'
import PointList from './PointList.vue'
import ArtDetails from './ArtDetails.vue'
import Navigation from './Navigation.vue'
export default {
  computed: {
    ...mapState('sidebar', ['open']),
    ...mapState('art', ['viewer'])
  },
  methods: {
    ...mapMutations('sidebar', ['toggleSidebar', 'setSidebarOpen']),
    toggleTheSidebar: function () {
      this.toggleSidebar()

      // EVENT SUBSCRIBED TO BY:
      // EditPointImageGrab.vue
      this.emitter.emit('clearEdit')
      setTimeout(() => {
        // EVENT SUBSCRIBED TO BY:
        // BOTH POINT GRABBER COMPONENTS
        this.emitter.emit('sidebarAction')
        this.viewer.viewport.goHome(false)
      }, 400)
    }
  },
  components: {
    PointList: PointList,
    ArtDetails: ArtDetails,
    Navigation: Navigation
  },
  mounted () {
    this.emitter.on('openSidebar', () => {
      this.setSidebarOpen()
    })
  }
}
</script>
<style lang='scss' scoped>
@import './../../../style/sass/abstracts/_mixins.scss';
@import './../../../style/sass/abstracts/_variables.scss';
#art_mapper_sidebar{
  position: absolute;
  top:0;
  left:0;
  width:20rem;
  height:100%;
  background-color: #efefef;
  z-index: 1001;
  transform: translate3d(-20rem, 0rem, 0rem);
  transition:all 0.3s ease-in-out;
  &.open{
    transform: translate3d(0rem, 0rem, 0rem);
  }
  .sidebar_wrap{
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    overflow-y:scroll;
    overflow-x:hidden;
    padding:1.5rem;
    .sidebar_header{
      position: relative;
      width:100%;
      margin-bottom:1.5rem;
      p{
        @include font-size(1);
        color: #949494;
      }
    }
  }
}
.sidebar_reveal{
  display: block;
  position: absolute;
  right:0;
  top:50%;
  transform: translateX(6rem) translateY(-50%) rotateZ(90deg);
  background-color: #fff;
  padding:0.7rem;
  cursor: pointer;
}
.art_points{
  margin-top:1rem;
  position: relative;
  .new_point_ctrl{
    margin-bottom:1.5rem;
  }

  ul{
    margin-top:1rem;
    margin:0;
    padding:0;
  }
}
.click-bg{
  position: fixed;
  background-color: red;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 1;
}
</style>
