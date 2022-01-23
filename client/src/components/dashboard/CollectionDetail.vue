<template>
<div class='collection_detail card_list_wrap'>
  <transition name="alert">
    <div v-show='alert.show' class="artmap_builder_alerts alert alert-success">{{ alert.message }}</div>
  </transition>
  <transition name='fade'>
    <MiniLoader v-show='loading_collection' :colorClass='"dark"' class='dashboard_loader' />
  </transition>
  <h1 class='collection_title' v-if='collection && !loading_collection'>
    {{collection.collection_title}}
    <button @click='handleUpdateCollection' class='btn artmap-secondary'>Update Details</button>
  </h1>
  <p v-if='collection && !loading_collection' class='collection_statement'>{{collection.curatorial_statement}}</p>
  <p v-if='collection && !loading_collection' class='external_link'>
    External Link: <a :href='collection.external_link' target='blank'>{{collection.external_link}}</a>
  </p>
  <div class='card_list_wrap collection-details'>
    <transition name='fade'>
      <MiniLoader v-show='loading_artwork' :colorClass='"dark"' class='dashboard_loader' />
    </transition>
    <div v-if='artwork_in_collection.length > 0'>
      <Card
        :loading='loading_artwork'
        v-for='item in artwork_in_collection'
        :key='item.id'
        :card='item'
        @updatedPublishState='handlePublishUpdate'
        @deleteArtwork='showDeleteDialog'/>
    </div>
  </div>
  <div class="modal fade" id="deleteArtworkDashboard" tabindex="-1" role="dialog" aria-labelledby="deleteArtworkDashboard" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body" v-if='item_for_delete'>
          <h1>Are you sure that you want to delete <span class='inline_highlight'>{{item_for_delete.artwork_title}}?</span></h1>
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
  <EditCollectionModal
    :passedCollection='collection_to_be_edited'
    @collectionUpdated='handleCollectionUpdate'
    @deleteCollection='handleDeleteCollection'/>
  <DeleteCollectionModal :collection='collection_to_be_deleted' @updateAfterDelete='getCollection' />
</div>
</template>
<script>

import {axiosInstance} from '@/api/endpoints'
import Card from './Card.vue'
import EditCollectionModal from './EditCollectionModal.vue'
import DeleteCollectionModal from './DeleteCollectionModal.vue'
import MiniLoader from './../loaders/MiniLoader.vue'
// import { getObject } from './../../faux_catalog_api'
import {CATALOG_URL} from './../../api/endpoints'
export default {
  props: ['loading'],
 data () {
  return {
    loading_collection: false,
    loading_artwork: false,
    collection: null,
    collection_to_be_deleted: null,
    collection_to_be_edited: null,
    artwork_in_collection: [],
    item_for_delete: null,
    alert: {
      message: null,
      show: false
    }
  }
 },
 watch: {
  $route: function (value) {
    if (value.params.collectionId) {
      this.getCollection()
    }
  }
 },
 methods: {
  handleCollectionUpdate: function (collectionResponseData) {
    this.setSuccessMessage({
      message: `${collectionResponseData.collection_title} was successfully updated.`,
      show: true
    })
    this.getCollection()
  },
  handleDeleteCollection: function (collectionCard) {
    this.collection_to_be_deleted = this.collection
    $('#deleteCollectionDashboard').modal('show')
  },
  handleUpdateCollection: function (collectionCard) {
    this.collection_to_be_edited = this.collection
    $('#editCollectionDashboard').modal('show')
  },
  showDeleteDialog: function (artworkItem) {
    this.item_for_delete = artworkItem
    $('#deleteArtworkDashboard').modal('show')
  },
  deleteSelectedArt: function () {
    axiosInstance.delete(`art/${this.item_for_delete.id}/`, {
      headers: {
        'X-CSRFToken': window.csrf
      }
    }).then(resp => {
      $('#deleteArtworkDashboard').modal('hide')
      this.setSuccessMessage({
        message: `${this.item_for_delete.artwork_title} was successfully deleted.`,
        show: true
      })
      this.getArtworkInCollection()
    }, err => {
      console.log(err)
    })
  },
  hideDeleteAlert: function () {
    $('#deleteArtworkDashboard').modal('hide')
  },
  handlePublishUpdate: function (cardResponseData) {
    this.setSuccessMessage({
      message: `${cardResponseData.artwork_title} was successfully ${cardResponseData.published ? "published" : "unpublished"}.`,
      show: true
    })
    this.getArtworkInCollection()
  },
  setSuccessMessage: function (successObj) {
    this.alert = successObj
    setTimeout(() => {
      this.alert = {
        message: null,
        show: false
      }
    }, 2500)
  },
  getCatalogData: function () {
    var updatedArtwork = []

    this.artwork_in_collection.forEach((artItem) => {
      updatedArtwork.push(artItem)
    })

    updatedArtwork.forEach((updatedArtItem, i) => {
      axiosInstance.get(`${CATALOG_URL}${updatedArtItem.accession_number}/`)
      .then(resp => {
        axiosInstance.get(`https://dlc.services/iiif-img/3/2/${resp.data.iiif_uuid}/info.json`)
        .then(iiif_resp => {
          updatedArtItem['iiif'] = iiif_resp.data
          updatedArtItem['thumbnail'] = `https://dlc.services/thumbs/3/2/${resp.data.iiif_uuid}/full/${iiif_resp.data.sizes[1].width},${iiif_resp.data.sizes[1].height}/0/default.jpg`
        }, err => {
          console.log(err)
          updatedArtItem['api_error'] = err.data.message
        })

      }, err => {
        console.log(err)
        updatedArtItem['api_error'] = err.data.message
      })
    })

    var asyncCheckerArtwork = setInterval(() => {
      var count = 0
      var arraySize = updatedArtwork.length
      updatedArtwork.forEach(item => {
        if (item.iiif || item.api_error) { count++ }
        if (count === arraySize) {
          clearInterval(asyncCheckerArtwork)
          this.artwork_in_collection = updatedArtwork
          // this.all_artwork_backup = updatedArtwork
          this.loading_artwork = false
        }
      })
    }, 50)
  },
  getArtworkInCollection: function () {
    this.artwork_in_collection = []
    this.loading_artwork = true
    if (this.collection.artworks.length > 0) {
      var count = 0
      var arraySize = this.collection.artworks.length
      this.collection.artworks.forEach(artwork => {
        axiosInstance.get(`all-artwork/${artwork.id}/`)
        .then(resp => {
          this.artwork_in_collection.push(resp.data)
          count++
        }, err => {
          console.log(err)
        })
      })
      var asyncChecker = setInterval(() => {
        if (count === arraySize) {
          clearInterval(asyncChecker)
          this.getCatalogData()
        }
      }, 50)
    } else {
      this.loading_artwork = false
    }
  },
  getCollection: function () {
    this.loading_collection = true
    axiosInstance.get(`all-collections/${this.$route.params.collectionId}/`)
    .then(resp => {
      this.collection = resp.data
      this.getArtworkInCollection()
      this.loading_collection = false
    }, err => {
      console.log(err)
      if (err.status === 404) {
        this.$router.push('/')
      }
    })
  }
 },
 mounted () {
  this.getCollection()
 },
 components: {
  Card,
  EditCollectionModal,
  DeleteCollectionModal,
  MiniLoader
 }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.card_list_wrap{
  z-index: 1;
  .artmap_builder_alerts.alert-success{
    position: absolute;
    top: 8.65rem;
    left: 0;
    width: 100%;
    height: 3rem;
  }
}
.collection_title{
  padding: 0 1.5rem;
  margin-top:1.1rem;
  color:$colors_text_secondary;
  button{
    float: right;
  }
}
.collection_statement, .external_link{
  padding: 0 1.5rem;
  width:70%;
}
.collection_statement{
  @include font-size(1);
  @include line-height(1.5);
}
.card_list_wrap.collection-details{
  margin-top:3rem;
}
.alert-enter-active, .alert-leave-active{
  transition: all .5s;
  opacity: 1;
  transform: translateY(0%);
}
.alert-enter, .alert-leave-to{
  opacity: 0;
  transform: translateY(-101%);
}
</style>
