<template>
  <div class='new_point_ctrl'>
    <button
      class='toggle_editMode btn btn-primary artmap-primary create_new_point'
      @click='initGrabber'><PlusIcon /></button>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import PlusIcon from './../../svgs/PlusIcon.vue'
export default {
  computed: {
    ...mapState('art', ['viewer'])
  },
  methods: {
    ...mapMutations('point', ['showNewPoint']),
    ...mapMutations('sidebar', ['setSidebarClose']),
    initGrabber: function (rawX, rawY) {
      this.showNewPoint({vm: this})
      this.emitter.emit('clearEdit')
      this.emitter.emit('openImageGrabber')
      this.setSidebarClose()
    }
  },
  components: {
    PlusIcon: PlusIcon
  }
}
</script>
<style lang='scss' scoped>
@import './../../../style/sass/abstracts/_mixins.scss';
@import './../../../style/sass/abstracts/_variables.scss';
.new_point_ctrl{
  position: absolute;
  top:50%;
  right:1.5rem;
  transform: translateY(-50%);
  z-index: 55;
  button.create_new_point{
    width:2.7rem;
    height:2.7rem;
    border-radius:50%;
    background-color:white;
    text-align: center;
    border-color:white;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.13);
    .icon{
      transform: translateY(-5%);
      width: 0.9rem;
      height: 0.9rem;
      margin:0 auto;
      @include font-size(0.8);
      color: $colors_grays_dark;
    }
  }
}
</style>
