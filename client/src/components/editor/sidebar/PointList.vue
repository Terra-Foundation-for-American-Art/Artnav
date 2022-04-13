<template>
  <draggable 
    v-if='local_data_points_all'
    :list='local_data_points_all'
    ghostClass="sortable-ghost"
    :delay="0"
    :disabled="false"
    :animation="350"
    @start="choosing" 
    @end="choiceMade"
    item-key="id">

    <template #item="{element, index}">

      <PointListItem
        :key='element.id'
        :point='element'
        :index='index'
        :class='{grabbing: grabState}'/>

    </template>
    
  </draggable>
</template>
<script>
import Draggable from 'vuedraggable'
import {mapActions} from 'vuex'
import PointListItem from './PointListItem.vue'
export default {
  data () {
    return {
      dragSortOptions: {
        delay: 0,
        disabled: false,
        animation: 350,
        ghostClass: 'sortable-ghost'
      },
      grabState: false
    }
  },
  computed: {
    'local_data_points_all': {
      get () {
        return this.$store.state.point.local_data.points.all
      },
      set (value) {
        var payload = {
          vm: this,
          points: value
        }
        this.updatePointListOrder(payload)
      }
    }
  },
  methods: {
    ...mapActions('point', ['updatePointListOrder']),
    choosing: function () {
      this.grabState = true
    },
    choiceMade: function () {
      this.grabState = false
    }
  },
  mounted () {
    this.emitter.on('turnOffDrag', () => {
      this.dragSortOptions.disabled = true
    })
    this.emitter.on('turnOnDrag', () => {
      this.dragSortOptions.disabled = false
    })
  },
  components: {
    PointListItem: PointListItem,
    Draggable: Draggable
  }
}
</script>
<style lang='scss'>
.sortable-ghost{
  visibility: hidden;
  opacity: 0;
}
</style>
