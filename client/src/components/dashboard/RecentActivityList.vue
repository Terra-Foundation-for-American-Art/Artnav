<template>
<div class='card_list_wrap'>
  <transition name="alert">
    <div v-if='alert.show' class="artmap_builder_alerts alert alert-success">{{ alert.message }}</div>
  </transition>
  <transition name='fade'>
    <MiniLoader v-show='loading' :colorClass='"dark"' class='dashboard_loader' />
  </transition>
  <p class='dashboard_section_title' v-if='recent_artwork && recent_collections'>
    Dashboard: Recent Activity
    <span class='view_counts'>
      <span v-if='!isFiltering'>Showing: </span>
      <span v-else>Filtered to: </span>
        <span class='inline_highlight'>{{recent_artwork.length}} artworks</span>
      and <span class='inline_highlight'>{{recent_collections.length}} collections</span>
    </span>
  </p>
  <div v-if='all_recent'>
    <Card
      :loading='loading'
      v-for='item in all_recent'
      :key='item.id'
      :card='item'
      @updatedPublishState='handlePublishUpdate'
      @deleteArtwork='showDeleteDialog'
      @showUpdateCollectionModal='handleUpdateCollection' />
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
    @collectionUpdated='handleCollectionUpdated'
    @deleteCollection='handleDeleteCollection'/>
  <DeleteCollectionModal :collection='collection_to_be_deleted' @updateAfterDelete='handleCollectionDeleted' />
</div>
</template>
<script>

import _ from 'lodash'
import {axiosInstance} from '@/api/endpoints'
import Card from './Card.vue'
import EditCollectionModal from './EditCollectionModal.vue'
import DeleteCollectionModal from './DeleteCollectionModal.vue'
import MiniLoader from './../loaders/MiniLoader.vue'
// import { getObject } from './../../faux_catalog_api'
import {CATALOG_URL} from './../../api/endpoints'

  export default {
    props: ['filterValue'],
    data () {
      return {
        isFiltering: false,
        loading: false,
        collection_to_be_edited: null,
        collection_to_be_deleted: null,
        all_recent: null,
        all_recent_backup: null,
        recent_artwork: null,
        recent_artwork_backup: null,
        recent_collections: null,
        item_for_delete: null,
        alert: {
          message: null,
          show: false
        }
      }
    },
    watch: {
      filterValue: function (value) {
        this.recent_artwork = this.recent_artwork_backup
        this.recent_collections = this.recent_collections_backup
        var filteredArtworkResults
        var filteredCollectionsResults
        if (value) {
          this.isFiltering = true
          filteredArtworkResults = _.filter(this.recent_artwork, (artwork) => {
              return artwork.artwork_title.toLowerCase().indexOf(value.toLowerCase()) > -1
          })
          filteredCollectionsResults = _.filter(this.recent_collections, (collection) => {
              return collection.collection_title.toLowerCase().indexOf(value.toLowerCase()) > -1
          })
          this.recent_artwork = filteredArtworkResults
          this.recent_collections = filteredCollectionsResults
          this.mergeAllRecentIntoList(false)
        } else {
          this.isFiltering = false
          this.recent_artwork = this.recent_artwork_backup
          this.recent_collections = this.recent_collections_backup
          this.all_recent = this.all_recent_backup
        }
      }
    },
    methods: {
      handleCollectionUpdated: function () {
        this.getRecentArtwork()
        this.setSuccessMessage({
          message: `${this.collection_to_be_edited.collection_title} was successfully updated.`,
          show: true
        })
      },
      handleCollectionDeleted: function () {
        this.getRecentArtwork()
        this.setSuccessMessage({
          message: `${this.collection_to_be_deleted.collection_title} was successfully deleted.`,
          show: true
        })
      },
      handleDeleteCollection: function (collectionCard) {
        this.collection_to_be_deleted = collectionCard
        $('#deleteCollectionDashboard').modal('show')
      },
      handleUpdateCollection: function (collectionCard) {
        this.collection_to_be_edited = collectionCard
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
          this.getRecentArtwork()
        }, err => {
          console.log(err)
        })
      },
      hideDeleteAlert: function () {
        $('#deleteArtworkDashboard').modal('hide')
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
      handlePublishUpdate: function (cardResponseData) {
        this.getRecentArtwork()
        this.setSuccessMessage({
          message: `${cardResponseData.artwork_title} was successfully ${cardResponseData.published ? "published" : "unpublished"}.`,
          show: true
        })
      },
      getCatalogData: function () {
        var updatedRecentArtwork = []
        var updatedRecentCollections = []

        this.recent_artwork.forEach((artItem) => {
          updatedRecentArtwork.push(artItem)
        })
        this.recent_collections.forEach((collectionItem) => {
          updatedRecentCollections.push(collectionItem)
        })

        updatedRecentArtwork.forEach((updatedArtItem, i) => {

          axiosInstance.get(`${CATALOG_URL}${updatedArtItem.accession_number}/`)
          .then(resp => {
            // console.log(resp.body)

            axiosInstance.get(`https://dlc.services/iiif-img/3/2/${resp.data.iiif_uuid}/info.json`)
            .then(iiif_resp => {
              updatedArtItem['iiif'] = iiif_resp.data
              updatedArtItem['thumbnail'] = `https://dlc.services/thumbs/3/2/${resp.data.iiif_uuid}/full/${iiif_resp.data.sizes[1].width},${iiif_resp.data.sizes[1].height}/0/default.jpg`
            }, err => {
              console.log(err)
              updatedArtItem['api_error'] = err.body.message
            })

          }, err => {
            console.log(err)
            updatedArtItem['api_error'] = err.body.message
          })
        })

        var foundArtworksSize = 0

        updatedRecentCollections.forEach((updatedCollectionItem, i) => {
          updatedCollectionItem.artworks.forEach(collectionArtworkItem => {
            foundArtworksSize += 1
            axiosInstance.get(`${CATALOG_URL}${collectionArtworkItem.accession_number}/`)
            .then(resp => {
              // console.log(resp.body)
              // console.log(resp)

              axiosInstance.get(`https://dlc.services/iiif-img/3/2/${resp.data.iiif_uuid}/info.json`)
              .then(iiif_resp => {
                collectionArtworkItem['iiif'] = iiif_resp.data
                collectionArtworkItem['thumbnail'] = `https://dlc.services/thumbs/3/2/${resp.data.iiif_uuid}/full/${iiif_resp.data.sizes[3].width},${iiif_resp.data.sizes[3].height}/0/default.jpg`
              }, err => {
                console.log(err)
                collectionArtworkItem['api_error'] = err.body.message
              })

            }, err => {
              console.log(err)
              collectionArtworkItem['api_error'] = err.body.message
            })
          })
        })


        var allRecentCount = 0
        var allRecentSize = 0

        if (updatedRecentCollections.length) {
          allRecentSize += 1
          var asyncCheckerCollections = setInterval(() => {
            var count = 0
            var hasArtworkCount = 0
            updatedRecentCollections.forEach(item => {
              if (item.artworks.length) {
                hasArtworkCount += 1
                item.artworks.forEach(artItem => {
                  // increment the loading checker count if artworks have received the image asset
                  // or if there was an api error preventing them from doing it so that
                  // the rest of the view will load
                  if (artItem.iiif || artItem.api_error) { count++ }
                  // console.log(count)
                  // console.log(foundArtworksSize)
                  if (count === foundArtworksSize) {
                    clearInterval(asyncCheckerCollections)
                    this.recent_collections = updatedRecentCollections
                    allRecentCount += 1
                  }
                })
              }
            })
            if (hasArtworkCount === 0) { allRecentCount += 1 }
          }, 50)
        }

        if (updatedRecentArtwork.length) {
          allRecentSize += 1
          var asyncCheckerArtwork = setInterval(() => {
            var count = 0
            var arraySize = updatedRecentArtwork.length
            updatedRecentArtwork.forEach(item => {
              // increment the loading checker count if artworks have received the image asset
              // or if there was an api error preventing them from doing it so that
              // the rest of the view will load
              if (item.iiif || item.api_error) { count++ }
              if (count === arraySize) {
                clearInterval(asyncCheckerArtwork)
                this.recent_artwork = updatedRecentArtwork
                allRecentCount += 1
              }
            })
          }, 50)
        }

        var asyncCheckerAll = setInterval(() => {
          // console.log(allRecentCount)
          if (allRecentCount === allRecentSize) {
            clearInterval(asyncCheckerAll)
            this.mergeAllRecentIntoList(true)
          }
        })
      },
      getRecentArtwork: function () {
        this.loading = true
        axiosInstance.get('recent-artwork/')
        .then(resp => {
          this.recent_artwork = resp.data
          this.recent_artwork_backup = resp.data
          this.getRecentCollections()
        }, err => {
          console.log(err)
        })
      },
      getRecentCollections: function () {
        axiosInstance.get('recent-collections/')
        .then(resp => {
          console.log(resp)
          this.recent_collections = resp.data
          this.recent_collections_backup = resp.data
          // this.mergeAllRecentIntoList(true)
          // get catalog data
          console.log(this.recent_collections)
          console.log(this.recent_collections_backup)
          this.getCatalogData()
        }, err => {
          console.log(err)
        })
      },
      mergeAllRecentIntoList: function (createBackup) {
        var mergedList = []
        this.recent_artwork.forEach(artItem => {
          mergedList.push(artItem)
        })
        this.recent_collections.forEach(collectionItem => {
          mergedList.push(collectionItem)
        })
        mergedList.sort(function (a, b) {
            var keyA = new Date(a.updated_at)
            var keyB = new Date(b.updated_at)
            // Compare the 2 dates
            if (keyA > keyB) return -1
            if (keyA < keyB) return 1

            return 0
        })
        this.all_recent = mergedList
        if (createBackup) {
          this.all_recent_backup = mergedList
        }
        setTimeout(() => {
          this.loading = false
          console.log(this.all_recent)
        }, 300)
      }
    },
    mounted () {
      this.getRecentArtwork()
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
