<template>
<div class='card_list_wrap'>
  <transition name="alert">
    <div v-if='alert.show' class="artmap_builder_alerts alert alert-success">{{ alert.message }}</div>
  </transition>
  <transition name='fade'>
    <MiniLoader v-show='loading' :colorClass='"dark"' class='dashboard_loader' />
  </transition>
  <p v-if='all_artwork' class='dashboard_section_title'>Dashboard: All Artwork
    <span class='view_counts'>
      <span v-if='!isFiltering'>Showing: </span>
      <span v-else>Filtered to: </span>
      <span class='inline_highlight'>{{all_artwork.length}} artworks</span>
    </span>
  </p>
  <div v-if='all_artwork'>
    <Card
      :loading='loading'
      v-for='item in all_artwork'
      :key='item.id'
      :card='item'
      @updatedPublishState='handlePublishUpdate'
      @deleteArtwork='showDeleteDialog'/>
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
</div>
</template>
<script>

import {axiosInstance} from '@/api/endpoints'
import Card from './Card.vue'
import MiniLoader from './../loaders/MiniLoader.vue'
import {CATALOG_URL} from './../../api/endpoints'
// import { getObject } from './../../faux_catalog_api'
  export default {
    props: ['filterValue'],
    data () {
      return {
        isFiltering: false,
        loading: false,
        all_artwork: null,
        all_artwork_backup: null,
        item_for_delete: null,
        alert: {
          message: null,
          show: false
        }
      }
    },
    watch: {
      filterValue: function (value) {
        this.all_artwork = this.all_artwork_backup
        var filteredResults
        if (value) {
          filteredResults = _.filter(this.all_artwork, (item) => {
            return item.artwork_title.toLowerCase().indexOf(value.toLowerCase()) > -1
          })
          if (filteredResults.length > 0) {
            this.isFiltering = true
            this.all_artwork = filteredResults
          } else {
            this.isFiltering = false
            this.all_artwork = this.all_artwork_backup
          }
        } else {
          this.isFiltering = false
          this.all_artwork = this.all_artwork_backup
        }
      }
    },
    methods: {
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
          this.getAllArtwork()
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
        this.getAllArtwork()
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

        this.all_artwork.forEach((artItem) => {
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

        if (updatedArtwork.length) {
          var asyncCheckerArtwork = setInterval(() => {
            var count = 0
            var arraySize = updatedArtwork.length
            updatedArtwork.forEach(item => {
              if (item.iiif || item.api_error) { count++ }
              if (count === arraySize) {
                clearInterval(asyncCheckerArtwork)
                this.all_artwork = updatedArtwork
                this.all_artwork_backup = updatedArtwork
                this.loading = false
              }
            })
          }, 50)
        } else {
          this.loading = false
        }
      },
      getAllArtwork: function () {
        this.loading = true
        axiosInstance.get('all-artwork/')
        .then(resp => {
          this.all_artwork = resp.data
          this.getCatalogData()
        }, err => {
          console.log(err)
        })
      }
    },
    mounted () {
      this.getAllArtwork()
    },
    components: {
      Card,
      MiniLoader
    }
  }
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
</style>
