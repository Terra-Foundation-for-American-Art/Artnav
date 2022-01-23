<template>
<div class="modal fade" id="editCollectionDashboard" tabindex="-1" role="dialog" aria-labelledby="editCollectionDashboard" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content update_collection">
      <div class='modal-body'>
        <div class='form-group'>
          <label for="art_title">Collection Title</label>
          <small id="imageHelp" class="form-text text-muted">Required</small>
          <input class='form-control' type="text" id='collection_title' placeholder='Collection Title...' v-model='collection.collection_title'>
        </div>
        <div class='form-group'>
          <label for="art_title">Collection Description</label>
          <small id="imageHelp" class="form-text text-muted">Optional</small>
          <textarea class='form-control' placeholder='Provide an optional description for this new collection...' v-model='collection.curatorial_statement'></textarea>
        </div>
        <div class='form-group'>
          <label for="art_title">External Link</label>
          <small id="imageHelp" class="form-text text-muted">Optional</small>
          <input class='form-control' type="text" id='external_link' placeholder='Include an optional external link for this collection...' v-model='collection.external_link'>
        </div>
      </div>
      <div class='modal-foot'>
        <div class="form-group">
          <button class="btn artmap-secondary" data-toggle="modal" data-target="#editCollectionDashboard" :disabled='isSaving'>
            Cancel
          </button>
          <button class="btn artmap-primary" @click='save'>
            <span v-show='!isSaving'>Update</span>
            <span v-show='isSaving'><MiniLoader /></span>
          </button>
          <button class='btn btn-delete-collection' @click='deleteThisCollection'>Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {axiosInstance} from '@/api/endpoints'
import MiniLoader from './../loaders/MiniLoader.vue'
export default {
  props: ['passedCollection'],
  data () {
    return {
      csrf: window.csrf,
      isSaving: false,
      collection: {
        collection_title: null,
        collection_slug: null,
        curatorial_statement: null,
        external_link: null,
        artworks: null,
        pub_date: null,
        curator: null,
        id: null
      }
    }
  },
  watch: {
    passedCollection: function () {
      this.getCollection()
    },
    'collection.collection_title': function (value) {
      this.collection.collection_slug = value.replace(/[^A-Z0-9]+/ig, '-').toLowerCase().toLowerCase()
    }
  },
  methods: {
    save: function () {
      this.isSaving = true
      axiosInstance.put(`artcollections/${this.collection.id}/`, this.collection, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      }).then(resp => {
        this.isSaving = false
        $('#editCollectionDashboard').modal('hide')
        this.$emit('collectionUpdated', resp.data)
      }, err => {
        console.log(err)
      })
    },
    deleteThisCollection: function () {
      this.$emit('deleteCollection', this.collection)
    },
    getCollection: function () {
      if (this.passedCollection) {
        axiosInstance.get(`artcollections/${this.passedCollection.id}/`)
        .then(resp => {
          for (var key in resp.data) {
            this.collection[key] = resp.data[key]
          }
        }, err => {
          console.log(err)
        })
      }
    }
  },
  mounted () {
    this.getCollection()
  },
  components: {
    MiniLoader: MiniLoader
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.modal-content.update_collection{
  border:0px;
  padding:0;
}
.modal-body{
  padding: 1.75rem 3rem;
  opacity: 1;
  visibility: visible;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}
.modal-foot{
  background-color:$colors_background_primary;
  border-top:1px solid $colors_grays_light;
  padding: 1.75rem 3rem;
  padding: 1rem 3rem;
  .form-group{
    text-align: right;
    button{
      margin-left:1rem;
      position: relative;
      transform: translateY(20%);
      height: 2.33rem;
    }
  }
}
.collection-form-field{
  position: relative;
  z-index:1;
}
</style>



