<template>
  <div class="modal fade" id="deletePoint" tabindex="-1" role="dialog" aria-labelledby="newArtmap" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 v-if='local_data.points.delete'>Are you sure that you want to delete <span class='inline_highlight'>{{local_data.points.delete.point_title}}?</span></h2>
        </div>
        <div class='modal-body'>
          <button class='toggle_editMode btn btn-primary artmap-primary' @click='deleteSelectedPoint'>Delete</button>
          <button class='toggle_editMode btn btn-primary artmap-primary' @click='hideDeleteAlert'>Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
// import {eventsPointEdits} from './../EventBuses'
export default {
  computed: {
    ...mapState('point', ['local_data']),
    ...mapState('art', ['viewer'])
  },
  methods: {
    ...mapActions('point', ['deletePoint']),
    deleteSelectedPoint: function () {
      var payload = {
        vm: this,
        id: this.local_data.points.delete.id
      }
      this.deletePoint(payload)
      this.emitter.emit('clearEdit')
    },
    hideDeleteAlert: function () {
      $('#deletePoint').modal('hide')
    }
  }
}
</script>
<style lang='scss'></style>
