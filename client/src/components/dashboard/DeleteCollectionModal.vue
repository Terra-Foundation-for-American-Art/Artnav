<template>
<div class="modal fade" id="deleteCollectionDashboard" tabindex="-1" role="dialog" aria-labelledby="deleteCollectionDashboard" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body" v-if='collection'>
        <h1>Are you sure that you want to delete <span class='inline_highlight'>{{collection.collection_title}}</span>?</h1>
        <p>You won't be able to recover this collection after you've deleted it. The artwork in this collection will not be deleted.</p>
      </div>
      <div class='modal-footer'>
        <button class='toggle_editMode btn btn-danger' @click='deleteSelectedcollection'>Delete</button>
        <button class='toggle_editMode btn btn-secondary' @click='hideDeleteAlert'>Cancel</button>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</div>
</template>
<script>
  import {axiosInstance} from '@/api/endpoints'
  export default {
    props: ['collection'],
    methods: {
      deleteSelectedcollection: function () {
        axiosInstance.delete(`artcollections/${this.collection.id}/`, {
          headers: {
            'X-CSRFToken': window.csrf
          }
        }).then(resp => {
          $('#deleteCollectionDashboard').modal('hide')
          $('#editCollectionDashboard').modal('hide')
          this.$emit('updateAfterDelete', this.collection)
        }, err => {
          console.log(err)
        })
      },
      hideDeleteAlert: function () {
        $('#deleteCollectionDashboard').modal('hide')
      },
    }
  }
</script>
