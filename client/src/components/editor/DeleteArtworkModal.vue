<template>
  <div class="modal fade" id="deleteArtwork" tabindex="-1" role="dialog" aria-labelledby="newArtmap" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body" v-if='art_data.art'>
          <h1>Are you sure that you want to delete <span class='inline_highlight'>{{art_data.art.artwork_title}}?</span></h1>
          <p>You won't be able to recover this artwork after you've deleted it.</p>
        </div>
        <div class='modal-footer'>
          <button class='toggle_editMode btn btn-danger' @click='deleteSelectedArt'>Delete</button>
          <button class='toggle_editMode btn btn-secondary' @click='hideDeleteAlert'>Cancel</button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  computed: {
    ...mapState('art', ['art_data'])
  },
  methods: {
    ...mapActions('art', ['deleteArt']),
    deleteSelectedArt: function () {
      var payload = {
        vm: this,
        id: this.art_data.art.id
      }
      this.deleteArt(payload)
    },
    hideDeleteAlert: function () {
      $('#deleteArtwork').modal('hide')
    }
  }
}
</script>
