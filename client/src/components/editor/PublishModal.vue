<template>
  <div class="modal fade" id="publishModal" tabindex="-1" role="dialog" aria-labelledby="newArtmap" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">

        <div class='modal-body'>
          <div v-if='art_data.art && art_data.artist' class='publish-options-view'>
            <div class='row'>
              <div class='col-sm-12'>
                <h2 class='settings-section-title'>Settings</h2>
              </div>
            </div>
            
            <div class='row artwork-details'>
              
              <div class='col-sm-12'>
                <label>Artwork Details</label>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Title:</small>
                    <input class='form-control' type="text" id='art_title' placeholder='Title...' v-model='artwork_title'>
                </div>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Artwork Description:</small>
                    <input class='form-control' type="text" id='art_about' placeholder='Artwork Description...' v-model='about'>
                </div>
               <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Accession Number:</small>
                    <input class='form-control' type="text" id='art_accession' placeholder='Accession Number...' v-model='accession_number'>
                </div>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Date Created:</small>
                    <input class='form-control' type="text" id='art_date' placeholder='Date...' v-model='artwork_creation_date'>
                </div>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Medium:</small>
                    <input class='form-control' type="text" id='art_medium' placeholder='Medium...' v-model='artwork_medium'>
                </div>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Dimensions:</small>
                    <input class='form-control' type="text" id='art_dimensions' placeholder='Dimensions...' v-model='artwork_dimensions'>
                </div>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Credit:</small>
                    <input class='form-control' type="text" id='art_credit' placeholder='Credit...' v-model='artwork_credit'>
                </div>
                <div class='form-group autocomplete-group'>
                  <p style="display:none;">{{artist_name}}</p>
                  <small id="imageHelp" class="form-text text-muted">Artist:</small>
                  <div class='auto-complete-input'>
                    <input
                      type="text"
                      class='form-control'
                      placeholder='Search for an existing artist or add a new one'
                      @keydown='flags.autocomplete_selections.artist = false'
                      @click='flags.autocomplete_selections.artist = false'
                      v-model='local_input.artist_name'>
                    <span v-if='new_artist.artist_name' class='new-obj-indicator'>New Artist</span>
                    <ul
                      v-if='autocompletes.artists'
                      class='auto-complete-list'>
                      <li
                        v-for='(found_artist, i) in autocompletes.artists'
                        :key='i'
                        @click='autoCompleteSelectArtist("artist", found_artist, "artist_name")'>{{found_artist.artist_name}}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class='col-sm-12'>
                  <div class='form-group'>
                      <small id="imageHelp" class="form-text text-muted">Artwork URL:</small>
                      <div 
                        v-if='dialog' class='copyable-input' 
                        @click='openUrl(dialog.art_url_root + artwork_slug + "/")'>
                          <input 
                            class='form-control' 
                            id='artwork_url_input' 
                            :value='dialog.art_url_root + artwork_slug' 
                            disabled=true>
                           
                          <button 
                            class='btn btn-secondary btn-copy' 
                            type="button" 
                            @click.stop 
                            v-clipboard:copy="dialog.art_url_root + artwork_slug">Copy!</button> 
                      </div>
                  </div>
              </div>
              <div class='col-sm-12'>
                  <div class='form-group'>
                      <small id="imageHelp" class="form-text text-muted">Artwork DLCS IIIF UUID:</small>
                      <div 
                        v-if='dialog'
                        @click='openUrl(`https://portal.dlc.services/Image.aspx?space=2&image=${artwork_iiif_uuid}`)'>
                          <input 
                            class='form-control' 
                            id='art_iiif' 
                            :value='artwork_iiif_uuid' 
                            disabled=true>
                      </div>
                  </div>
              </div>
            </div>
            <div class='row artwork meta-data'>
              <div class='col-sm-12'>
                <label>Artmap Meta Tags</label>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Title used in Shared Posts on Facebook & Twitter:</small>
                    <input class='form-control' type="text" id='art_title' placeholder='Facebook share title...' v-model='og_title'>
                </div>
              </div>
              <div class='col-sm-12'>
                <div class='form-group'>
                    <small id="imageHelp" class="form-text text-muted">Description used in Shared Posts on Facebook & Twitter:</small>
                    <textarea class='form-control' type="text" id='art_title' placeholder='Facebook share description..' v-model='og_description'></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if='art_data.art' class='modal-footer'>
          <button class='toggle_editMode btn btn-primary artmap-primary' @click='save(false)'>Save</button>
          <button v-if='!art_data.art.published' class='toggle_editMode btn btn-success' @click='save(true)' :disabled='!validForm'>Save & Publish</button>
          <button v-else class='toggle_editMode btn btn-warning' @click='unpublish' :disabled='!validForm'>Unpublish</button>
          <button class='toggle_editMode btn btn-secondary' @click='cancelEntry'>Cancel</button>
          <button class='btn btn-delete-artwork' @click='deleteThisArtwork'>Delete</button>
        </div>
      </div>
      
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>
<script>

import {axiosInstance} from '@/api/endpoints'
import Quill from 'quill'
import {mapState, mapMutations, mapActions} from 'vuex'
import {validateExists} from './../../utilities/validationMethods.js'
import _ from 'lodash'
export default {
  data () {
    return {
      index: 1,
      dialog: {
          art_url_root: null,
          copy_message: 'copy the url'
      },
      copyData: 'this is the thing to copy',
      options: {
        artists: null,
        collections: null
      },
      autocompletes: {
        artists: null,
        collections: null
      },
      flags: {
        autocomplete_selections: {
          artist: false,
          collection: false
        }
      },
      new_artist: {
        artist_name: null
      },
      local_input: {
        artist_name: null,
        collection_title: null,
        curatorial_statement: null,
        external_link: null
      },
      new_collection: {
        collection_title: null,
        artworks: []
      },
      selected_collection: null,
      existing_collections: null,
      local_data: {
        id: null,
        artwork_title: null,
        about: null,
        accession_number: null,
        artwork_creation_date: null,
        artist: null,
        description: null,
        credit: null,
        iiif_uuid: null,
        dimensions: null,
        medium: null,
        image_ref: null,
        artwork_slug: null,
        creation_date: null,
        updated_at: null,
        curator: null,
        published: null,
        pub_date: null,
        og_title: null,
        og_description: null
      },
      valid: {
        artwork_title: false,
        artwork_creation_date: false,
        artist_name: false
      },
      validForm: false,
      rt: {
        editor: null,
        options: {
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'link']
            ]
          },
          placeholder: 'Compose an epic...',
          theme: 'snow'
        }
      }
    }
  },
  computed: {
    ...mapState('art', ['art_data', 'art_data_revertable']),
    'artwork_title': {
      get () { return this.$store.state.art.art_data.art.artwork_title },
      set (value) {
        this.$store.state.art.art_data.art.artwork_title = value
        this.$store.state.art.art_data.art.artwork_slug = value.replace(/[^A-Z0-9]+/ig, '-').toLowerCase().toLowerCase()
      }
    },
    'about': {
      get () { return this.$store.state.art.art_data.art.about },
      set (value) {this.$store.state.art.art_data.art.about = value}
    },
    'artwork_credit': {
      get () { return this.$store.state.art.art_data.art.credit },
      set (value) {this.$store.state.art.art_data.art.credit = value}
    },
    'artwork_medium': {
      get () { return this.$store.state.art.art_data.art.medium },
      set (value) {this.$store.state.art.art_data.art.medium = value}
    },
    'artwork_dimensions': {
      get () { return this.$store.state.art.art_data.art.dimensions },
      set (value) {this.$store.state.art.art_data.art.dimensions = value}
    },
    'artwork_iiif_uuid': {
      get () { return this.$store.state.art.art_data.art.iiif_uuid },
      set (value) {this.$store.state.art.art_data.art.iiif_uuid = value}
    },
    'accession_number': {
      get () { return this.$store.state.art.art_data.art.accession_number },
      set (value) { this.$store.state.art.art_data.art.accession_number = value }
    },
    'artwork_creation_date': {
      get () { return this.$store.state.art.art_data.art.artwork_creation_date },
      set (value) { this.$store.state.art.art_data.art.artwork_creation_date = value }
    },
    'artwork_slug': {
      get () {
        return this.$store.state.art.art_data.art.artwork_title.replace(/[^A-Z0-9]+/ig, '-').toLowerCase().toLowerCase()
      },
      set (value) { this.$store.state.art.art_data.art.artwork_slug = value }
    },
    'artist_name': {
      get () {
        this.local_input.artist_name = this.$store.state.art.art_data.artist.artist_name
      },
      set (value) { this.local_input.artist_name = value }
    },
    'image_ref': {
      get () { return this.$store.state.art.art_data.art.image_ref },
      set (value) { this.$store.state.art.art_data.art.image_ref = value }
    },
    'og_title': {
      get () { return this.$store.state.art.art_data.art.og_title },
      set (value) { this.$store.state.art.art_data.art.og_title = value }
    },
    'og_description': {
      get () { return this.$store.state.art.art_data.art.og_description },
      set (value) { this.$store.state.art.art_data.art.og_description = value }
    }
  },
  watch: {
    'art_data.art.artwork_title': function (value) {
      validateExists('artwork_title', value, this)
      this.submissionCheck()
    },
    'art_data.art.about': function (value) {
      validateExists('about', value, this)
      this.submissionCheck()
    },
    'art_data.art.artwork_creation_date': function (value) {
      validateExists('artwork_creation_date', value, this)
      this.submissionCheck()
    },
    'local_input.artist_name': function (value) {
      var artistResults
      if (!this.flags.autocomplete_selections.artist) {
        if (value) {
          artistResults = _.filter(this.options.artists, (artist) => {
            return artist.artist_name.toLowerCase().indexOf(value.toLowerCase()) > -1
          })
          if (artistResults.length > 0) {
            this.autocompletes.artists = artistResults
            // HANDLE PRE-POPULATED INPUT:
            if (this.autocompletes.artists.length === 1 && this.autocompletes.artists[0].artist_name === value) {
              this.autocompletes.artists = null
              this.new_artist.artist_name = null
            }
          } else {
            this.autocompletes.artists = null
            // CREATE NEW ARTIST OBJECT FOR API SUBMISSION:
            this.new_artist.artist_name = value
          }
        } else {
          this.autocompletes.artists = null
          this.new_artist.artist_name = null
        }
      } else {
        // IF AUTOCOMPLETE SELECTION HAS BEEN MADE
        // EMPTY OUT AUTO COMPLETES LIST AND NEW ARTIST OBJECT
        this.autocompletes.artists = null
        this.new_artist.artist_name = null
      }
      validateExists('artist_name', value, this)
      this.submissionCheck()
    },
    'local_input.collection_title': function (value) {
      var collectionResults

      if (!this.flags.autocomplete_selections.collection) {
        if (value) {
          collectionResults = _.filter(this.options.collections, (collection) => {
            return collection.collection_title.toLowerCase().indexOf(value.toLowerCase()) > -1
          })
          if (collectionResults.length > 0) {
            this.autocompletes.collections = collectionResults
          } else {
            this.autocompletes.collections = null
            // CREATE NEW ARTIST OBJECT FOR API SUBMISSION:
            this.new_collection.collection_title = value
          }
        } else {
          this.autocompletes.collections = null
          this.new_collection.collection_title = null
        }
      } else {
        // IF AUTOCOMPLETE SELECTION HAS BEEN MADE
        // EMPTY OUT AUTO COMPLETES LIST AND NEW ARTIST OBJECT
        this.autocompletes.collections = null
        this.new_collection.collection_title = null
      }
    }
    // 'art_data.art.about': function (value) {
    //   setTimeout(() => { this.initRichText(value) }, 500)
    // }
  },
  methods: {
    ...mapMutations('art', ['revert', 'setArtData', 'setArtDescription', 'callSuccessAlert', 'setArtsArtistId', 'setArtsPublishState', 'setDeleteCandidate']),
    ...mapActions('art', ['getArtistData']),
    openUrl: function (url) {
      window.open(url)
    },
    save: function (shouldPublish) {
      // CHECK IF A NEW ARTIST OR NEW COLLECTION NEEDS TO BE CREATED
      // BEFORE SAVING FULL SUBMISSION:
      var vm = this
      if (!this.new_artist.artist_name && !this.new_collection.collection_title) {
        // post submission here:
        this.updateArtwork(false, '', shouldPublish)
      } else if (this.new_artist.artist_name && this.new_collection.collection_title) {
        this.saveNewArtistFirst((resp) => {
          vm.art_data.art.artist = resp.data.id
          vm.saveNewCollectionFirst((collectionResp) => {
            // post submission here:
            this.updateArtwork(true, collectionResp.data.id, shouldPublish)
          })
        })
      } else if (this.new_artist.artist_name) {
        this.saveNewArtistFirst((resp) => {
          vm.setArtsArtistId(resp.data.id)
          this.updateArtwork(false, '', shouldPublish)
        })
      } else if (this.new_collection.collection_title) {
        this.saveNewCollectionFirst((collectionResp) => {
          vm.updateArtwork(true, collectionResp.data.id, shouldPublish)
        })
      }
    },
    submissionCheck: function () {
      
      var count_valid_fields = 0
      var size_fields = Object.keys(this.valid).length

      for (var key in this.valid) {
        if (this.valid[key]) {
          count_valid_fields++
        }
      }
      if (count_valid_fields === size_fields) {
        this.validForm = true
      } else {
        this.validForm = false
      }
    },
    handleCollectionInputKeyDown: function () {
      this.flags.autocomplete_selections.collection = false
      this.selected_collection = null
    },
    autoCompleteSelectCollection: function (selectedObj, localField) {
      this.flags.autocomplete_selections.collection = true
      this.selected_collection = selectedObj.id
      this.local_input[localField] = selectedObj[localField]
    },
    autoCompleteSelectArtist: function (submissionField, selectedObj, localField) {
      this.flags.autocomplete_selections.artist = true
      this.art_data.art[submissionField] = selectedObj.id
      this.local_input[localField] = selectedObj[localField]
    },
    handlerL: function () {
        this.showTips = false
    },
    handleSelection (selectedIndex) {
        this.index = selectedIndex
    },
    saveNewArtistFirst: function (cb) {
      axiosInstance.post('artists/', this.new_artist, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        cb(resp)
      }, err => {
        console.log(err)
      })
    },
    saveNewCollectionFirst: function (cb) {
      // SET THE REST OF THE REQUIRED COLLECTION MODEL HERE:
      // set curator property as user id
      this.new_collection['curator'] = Number(window.user_id)
      this.new_collection['curator_id'] = Number(window.user_id)
      this.new_collection['collection_slug'] = this.new_collection.collection_title.replace(/[^A-Z0-9]+/ig, '-').toLowerCase().toLowerCase()
      this.new_collection['curatorial_statement'] = this.local_input.curatorial_statement
      this.new_collection['external_link'] = this.local_input.external_link
      axiosInstance.post('artcollections/', this.new_collection, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        cb(resp)
      }, err => {
        console.log(err)
      })
    },
    addArtToCollection: function (collectionId, updatedArtwork) {
      var vm = this
      var collection
      axiosInstance.get(`artcollections/${collectionId}/`, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        collection = resp.data
        collection.artworks.push(updatedArtwork.id)

        axiosInstance.put(`artcollections/${collectionId}/`, collection, {
          headers: {
            'X-CSRFToken': window.csrf
          }
        })
        .then(resp => {
          vm.handleUpdateSuccess(updatedArtwork)
        }, err => {
          console.log(err)
        })
      }, err => {
        console.log(err)
      })
    },
    unpublish () {
      var vm = this
      this.setArtsPublishState(false)
      axiosInstance.put(`art/${window.art_id}/`, this.art_data.art, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then((resp) => {
        this.handleUpdateSuccess(resp.data)
      }, err => {
        console.log(err)
      })
    },
    updateArtwork: function (collectionCreated, collectionId, shouldPublish) {
      var vm = this
      console.log(this.art_data.art)
      if (shouldPublish) {
        this.setArtsPublishState(shouldPublish)
      }
      axiosInstance.put(`art/${window.art_id}/`, this.art_data.art, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then((resp) => {
        if (collectionCreated) {
          this.addArtToCollection(collectionId, resp.data)
        } else if (this.selected_collection) {
          this.addArtToCollection(vm.selected_collection, resp.data)
        } else {
          this.handleUpdateSuccess(resp.data)
        }
      }, err => {
        console.log(err)
      })
    },
    handleUpdateSuccess: function (updatedArtwork) {
      this.setArtData(updatedArtwork)
      var newArtPath = `/art/${updatedArtwork.artwork_slug}`

      history.replaceState({}, null, newArtPath)
      var successPayload = { m: `${updatedArtwork.artwork_title} was successfully updated.`, hideDelay: 3500 }

      this.callSuccessAlert(successPayload)

      this.getArtistData(updatedArtwork.artist)
      this.getThisArtworksCollections()

      $('#publishModal').modal('hide')
    },
    deleteThisArtwork: function () {
      $('#deleteArtwork').modal('show')
    },
    
    cancelEntry: function () {
      $('#publishModal').modal('hide')
      this.revert()
    },
    getArtists () {
      axiosInstance.get('artists/')
      .then(resp => {
        this.options.artists = resp.data
      }, err => {
        console.log(err)
      })
    },
    getCollections: function () {
      axiosInstance.get('artcollections/')
      .then(resp => {
        this.options.collections = resp.data
      }, err => {
        console.log(err)
      })
    },
    getThisArtworksCollections: function () {
      axiosInstance.get(`artcollections/?artwork=${window.art_id}`)
      .then(resp => {
        this.existing_collections = resp.data
        this.local_input.collection_title = null
        this.new_collection.collection_title = null
        this.selected_collection = null
      }, err => {
        console.log(err)
      })
    },
    removeFromCollection: function (collectionId) {
      var vm = this
      axiosInstance.get(`artcollections/${collectionId}/`)
      .then(resp => {
        var collectionData = resp.data
        var collectionArtworksBefore = resp.data.artworks
        var collectionArtworksAfter = collectionArtworksBefore.filter(artId => {
          return artId !== window.art_id
        })
        collectionData.artworks = collectionArtworksAfter

        axiosInstance.put(`artcollections/${collectionId}/`, collectionData, {
          headers: {
            'X-CSRFToken': window.csrf
          }
        }).then(resp => {
          vm.getThisArtworksCollections()
        }, err => {
          console.log(err)
        })

      }, err => {
        console.log(err)
      })
    }
  },
  updated () {
    this.submissionCheck()
  },
  mounted () {
    this.dialog.art_url_root = String(axiosInstance.defaults.baseURL).split('api')[0] + 'gallery/'
    this.getArtists()
    this.getCollections()
    this.getThisArtworksCollections()
  }
}
</script>
<style lang='scss' scoped>
@import './../../style/sass/abstracts/_mixins.scss';
@import './../../style/sass/abstracts/_variables.scss';
.modal-body{
  padding: 3rem;
  label{
    small{
      @include type_body;
      display: inline-block;
      @include font-size(0.7);
      margin-left:0.3rem;
    }
  }
  .settings-section-title{
    @include type_body_bold;
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 0.5rem;
    margin-top: 1rem;
    @include font-size(1);
    color:$colors_form_field_section;
  }
}
.modal-footer{
  display: block;
  padding: 2rem 3rem;
  .btn-delete-artwork{
    float:right;
  }
}
.copyable-input{
    position: relative;
    cursor: pointer;
    button{
        position: absolute;
        top: 50%;
        right: 0.7rem;
        margin: 0;
        transform: translateY(-50%);
    }
}
.dialog-controls{
    text-align: right;
    button{
        margin-left:1rem;
    }
}
.form-group{
  position: relative;
  z-index: 1;
}
.autocomplete-group{
  position: relative;
  z-index: 3;
  .auto-complete-list{
    z-index: 1;
  }
  &.collections-field{
    z-index:2;
  }
}
.existing_collections{
  margin:0;
  padding:0;
  margin-top:1rem;
  li{
    display: inline-block;
    padding: 0.25rem 0.8rem;
    background-color:rgba(0,0,0, 0.1);
    margin-right:0.35rem;
    margin-bottom: 0.5rem;
    border-radius: 2rem;
    span{
      color:rgb(147, 147, 147);
      vertical-align: middle;
      @include font-size(0.8)
    }
    .oi{
      margin-left:0.5rem;
      @include font-size(0.7);
      cursor: pointer;
    }
    &:last-child{
      margin-right:0;
    }
  }
}
</style>
