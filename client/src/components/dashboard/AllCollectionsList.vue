<template>
<div class='card_list_wrap'>
  <transition name="alert">
    <div v-if='alert.show' class="artmap_builder_alerts alert alert-success">{{ alert.message }}</div>
  </transition>
  <transition name='fade'>
    <MiniLoader v-show='loading' :colorClass='"dark"' class='dashboard_loader' />
  </transition>
  <p v-if='all_collections' class='dashboard_section_title'>Dashboard: All Artwork
    <span class='view_counts'>
      <span v-if='!isFiltering'>Showing: </span>
      <span v-else>Filtered to: </span>
      <span class='inline_highlight'>{{all_collections.length}} collections</span>
    </span>
  </p>
  <div v-if='all_collections && !loading'>
    <Card
      :loading='loading'
      v-for='item in all_collections'
      :key='item.id'
      :card='item'
      @showUpdateCollectionModal='handleUpdateCollection' />
  </div>

  <EditCollectionModal
    :passedCollection='collection_to_be_edited'
    @collectionUpdated='handleCollectionUpdated'
    @deleteCollection='handleDeleteCollection'/>

  <DeleteCollectionModal :collection='collection_to_be_deleted' @updateAfterDelete='handleCollectionDeleted' />
</div>
</template>
<script>

import {axiosInstance} from '@/api/endpoints'
import Card from './Card.vue'
import EditCollectionModal from './EditCollectionModal.vue'
import DeleteCollectionModal from './DeleteCollectionModal.vue'
import MiniLoader from './../loaders/MiniLoader.vue'
import {CATALOG_URL} from './../../api/endpoints'
  export default {
    props: ['filterValue'],
    data () {
      return {
        isFiltering: false,
        loading: false,
        all_collections: null,
        all_collections_backup: null,
        collection_to_be_edited: null,
        collection_to_be_deleted: null,
        alert: {
          message: null,
          show: false
        }
      }
    },
    watch: {
      filterValue: function (value) {
        this.all_collections = this.all_collections_backup
        var filteredResults
        if (value) {
          filteredResults = _.filter(this.all_collections, (item) => {
            return item.collection_title.toLowerCase().indexOf(value.toLowerCase()) > -1
          })
          if (filteredResults.length > 0) {
            this.isFiltering = true
            this.all_collections = filteredResults
          } else {
            this.isFiltering = false
            this.all_collections = this.all_collections_backup
          }
        } else {
          this.isFiltering = false
          this.all_collections = this.all_collections_backup
        }
      }
    },
    methods: {
      handleCollectionUpdated: function () {
        this.getAllCollections()
        this.setSuccessMessage({
          message: `${this.collection_to_be_edited.collection_title} was successfully updated.`,
          show: true
        })
      },
      handleCollectionDeleted: function () {
        this.getAllCollections()
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
        var updatedCollections = []

        this.all_collections.forEach((collectionItem) => {
          updatedCollections.push(collectionItem)
        })

        var foundArtworksSize = 0

        updatedCollections.forEach((updatedCollectionItem, i) => {
          updatedCollectionItem.artworks.forEach(collectionArtworkItem => {
            foundArtworksSize += 1
            axiosInstance.get(`${CATALOG_URL}${collectionArtworkItem.accession_number}/`)
            .then(resp => {
              axiosInstance.get(`https://dlc.services/iiif-img/3/2/${resp.data.iiif_uuid}/info.json`)
              .then(iiif_resp => {
                collectionArtworkItem['iiif'] = iiif_resp.data
                collectionArtworkItem['thumbnail'] = `https://dlc.services/thumbs/3/2/${resp.data.iiif_uuid}/full/${iiif_resp.data.sizes[3].width},${iiif_resp.data.sizes[3].height}/0/default.jpg`
              }, err => {
                console.log(err)
                collectionArtworkItem['api_error'] = err.data.message
              })

            }, err => {
              console.log(err)
              collectionArtworkItem['api_error'] = err.data.message
            })
          })
        })

        if (updatedCollections.length) {
          var asyncCheckerCollections = setInterval(() => {
            var count = 0
            var hasArtworkCount = 0
            updatedCollections.forEach(item => {
              if (item.artworks.length) {
                hasArtworkCount += 1
                item.artworks.forEach(artItem => {
                  if (artItem.iiif || artItem.api_error) { count++ }
                  if (count === foundArtworksSize) {
                    clearInterval(asyncCheckerCollections)
                    this.all_collections = updatedCollections
                    this.all_collections_backup = updatedCollections
                    this.loading = false
                  }
                })
              }
            })
            if (hasArtworkCount === 0) { this.loading = false }
          }, 50)
        } else {
          this.loading = false
        }
      },
      getAllCollections: function () {
        this.loading = true
        axiosInstance.get('all-collections/')
        .then(resp => {
          this.all_collections = resp.data
          this.getCatalogData()
        }, err => {
          console.log(err)
        })
      }
    },
    mounted () {
      this.getAllCollections()
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
