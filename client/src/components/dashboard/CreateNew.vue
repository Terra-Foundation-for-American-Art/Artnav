<template>
<div class="modal-dialog" role="document">
  <div class="modal-content new_artwork">
    <div class='modal-body' :class='{loading:isSaving || isSuccess}'>
        <div class='form-group'>
          <label for="art_title">Artwork Title</label>
          <small id="imageHelp" class="form-text text-muted">Required</small>
          <input class='form-control' type="text" id='art_title' placeholder='Title...' v-model='submission.artwork_title'>
        </div>
        <div class='form-group'>
          <label for="art_title">Date of Creation</label>
          <small id="imageHelp" class="form-text text-muted">Required</small>
          <input class='form-control' type="text" id='art_date' placeholder='Date...' v-model='submission.artwork_creation_date'>
        </div>
        <div class='form-group artist-form-field'>
          <label for="art_artist">Artist Name</label>
          <small id="imageHelp" class="form-text text-muted">Required</small>
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
                :key='`found-artist-${i}`'
                @click='autoCompleteSelectArtist("artist", found_artist, "artist_name")'>{{found_artist.artist_name}}</li>
            </ul>
          </div>
        </div>
        <div class='form-group collection-form-field'>
          <label for="art_collection">Assign to Collection</label>
          <small id="imageHelp" class="form-text text-muted">Optional</small>
          <div class='auto-complete-input'>
            <input
              type="text"
              class='form-control'
              placeholder='Search for an existing collection or add a new one'
              @keydown='handleCollectionInputKeyDown'
              @click='flags.autocomplete_selections.collection = false'
              v-model='local_input.collection_title'>
              <span v-if='new_collection.collection_title' class='new-obj-indicator'>New Collection</span>
            <ul
              v-if='autocompletes.collections'
              class='auto-complete-list'>
              <li
                v-for='(found_collection, j) in autocompletes.collections'
                :key='`found-collection-${j}`'
                @click='autoCompleteSelectCollection(found_collection, "collection_title")'>{{found_collection.collection_title}}</li>
            </ul>
          </div>
        </div>

        <div class='form-group'>
          <label for="catalog_id">Accession Number</label>
          <input class='form-control' type="text" id='accession_number' placeholder='Accession Number...' v-model='submission.accession_number'>
        </div>
        <div class='form-group'>
          <label for="catalog_id">IIIF Image ID</label>
          <small id="imageHelp" class="form-text text-muted">Required</small>
          <input class='form-control' type="text" id='iiif_id' placeholder='IIIF ID...' v-model='submission.iiif_uuid'>
        </div>
    </div>
    <div class='modal-foot'>
      <div class="form-group">
        <button class="btn artmap-secondary" data-toggle="modal" data-target="#newArtmap" :disabled='isSaving'>
          Cancel
        </button>
        <button class="btn artmap-primary" @click='save' :disabled='!validForm'>
          <span v-show='isInitial'>Create</span>
          <span v-show='isSaving || isSuccess'><MiniLoader /></span>
        </button>
      </div>
    </div>
  </div>
  <div class='loading-view' v-show='isSaving || isSuccess'>
    <div class='loading-view-wrap'>
      <div class='loader-wrap'>
        <h1>Uploading Artwork</h1>
        <p>Larger file sizes can take up to 5 minutes.</p>
        <div class='progress-elements'>
          <span class='loading_percent'><i v-show='isSuccess' class="material-icons">&#xE5CA;</i><span v-show='!isSuccess'>{{loaded_percent}}%</span></span>
          <svg :width="(circle_loader.radius*2)+(circle_loader.stroke_width*2)" :height="(circle_loader.radius*2)+(circle_loader.stroke_width*2)">
            <circle
              id='loading-track'
              :stroke-width="circle_loader.stroke_width"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="0"
              :cx="circle_loader.radius+circle_loader.stroke_width"
              :cy="circle_loader.radius+circle_loader.stroke_width"
              :r="circle_loader.radius"
              transform=""
              class="outer"></circle>
            <circle
              :stroke-width="circle_loader.stroke_width"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circularLoadedPercent"
              :cx="circle_loader.radius+circle_loader.stroke_width"
              :cy="circle_loader.radius+circle_loader.stroke_width"
              :r="circle_loader.radius"
              transform=""
              class="outer"></circle>
          </svg>
        </div>
        <p class='redirect-notice' :class='{show_notice: isSuccess}'>Redirecting...</p>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {axiosInstance} from '@/api/endpoints'
import MiniLoader from './../loaders/MiniLoader.vue'
import {validateExists} from './../../utilities/validationMethods.js'
import _ from 'lodash'
export default {
  data () {
    return {
      csrf: window.csrf,
      userId: window.user_id,
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
      loaded_percent: 0,
      create_step: 1,
      circle_loader: {
        radius: 50,
        dash_offset: 0,
        stroke_width: 2
      },
      form_data: new FormData(),
      local_input: {
        artist_name: null,
        collection_title: null
      },
      new_artist: {
        artist_name: null
      },
      new_collection: {
        collection_title: null,
        artworks: []
      },
      selected_collection: null,
      submission: {
        artwork_title: null,
        artwork_creation_date: null,
        artwork_slug: null,
        artist: null,
        curator: window.user_id,
        curator_id: window.user_id,
        accession_number: null,
        iiif_uuid: null
      },
      currentStatus: 0,
      s: {
        STATUS_INITIAL: 0,
        STATUS_SAVING: 1,
        STATUS_SUCCESS: 2,
        STATUS_FAILED: 3
      },
      valid: {
        artwork_title: false,
        artwork_creation_date: false,
        artist_name: false,
        accession_number: false,
        iiif_uuid: false
      },
      validForm: false
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === this.s.STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === this.s.STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === this.s.STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === this.s.STATUS_FAILED
    },
    circumference () {
      return 2 * Math.PI * this.circle_loader.radius
    },
    circularLoadedPercent () {
      var val = this.loaded_percent
      var c = Math.PI * (this.circle_loader.radius * 2)

      if (val < 0) { val = 0 }
      if (val > 100) { val = 100 }

      var pct = ((100 - val) / 100) * c

      return pct
    }
  },
  watch: {
    'submission.artwork_title': function (value) {
      var slug = value.replace(/[^A-Z0-9]+/ig, '-').toLowerCase().toLowerCase()
      this.submission.artwork_slug = slug
      validateExists('artwork_title', value, this)
      this.submissionCheck()
    },
    'submission.artwork_creation_date': function (value) {
      validateExists('artwork_creation_date', value, this)
      this.submissionCheck()
    },
    'submission.accession_number': function (value) {
      validateExists('accession_number', value, this)
      this.submissionCheck()
    },
    'submission.iiif_uuid': function (value) {
      validateExists('iiif_uuid', value, this)
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
  },
  methods: {
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
    autoCompleteSelectArtist: function (submissionField, selectedObj, localField) {
      this.flags.autocomplete_selections.artist = true
      this.submission[submissionField] = selectedObj.id
      this.local_input[localField] = selectedObj[localField]
    },
    autoCompleteSelectCollection: function (selectedObj, localField) {
      this.flags.autocomplete_selections.collection = true
      this.selected_collection = selectedObj.id
      this.local_input[localField] = selectedObj[localField]
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
    save: function () {
      // CHECK IF A NEW ARTIST OR NEW COLLECTION NEEDS TO BE CREATED
      // BEFORE SAVING FULL SUBMISSION:
      this.currentStatus = this.s.STATUS_SAVING
      var vm = this
      if (!this.new_artist.artist_name && !this.new_collection.collection_title) {
        // post submission here:
        this.saveSubmission()
      } else if (this.new_artist.artist_name && this.new_collection.collection_title) {
        this.saveNewArtistFirst((resp) => {
          vm.submission.artist = resp.data.id
          vm.saveNewCollectionFirst((collectionResp) => {
            // post submission here:
            vm.saveSubmission(true, collectionResp.data.id)
          })
        })
      } else if (this.new_artist.artist_name) {
        this.saveNewArtistFirst((resp) => {
          vm.submission.artist = resp.data.id
          vm.saveSubmission()
        })
      } else if (this.new_collection.collection_title) {
        this.saveNewCollectionFirst((collectionResp) => {
          vm.saveSubmission(true, collectionResp.data.id)
        })
      }
    },
    addArtToCollection: function (collectionId, artId, artSlug) {
      var vm = this
      var collection
      axiosInstance.get(`artcollections/${collectionId}/`, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        collection = resp.data
        collection.artworks.push(artId)
        axiosInstance.put(`artcollections/${collectionId}/`, collection, {
          headers: {
            'X-CSRFToken': window.csrf
          }
        })
        .then(resp => {
          vm.currentStatus = this.s.STATUS_SUCCESS
          setTimeout(() => {
            window.location = `/art/${artSlug}/`
          }, 500)
        }, err => {
          console.log(err)
        })
      }, err => {
        console.log(err)
      })
    },
    saveSubmission: function (collectionCreated, collectionId) {
      var vm = this
      axiosInstance.post('art/', this.submission, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        if (collectionCreated) {
          this.addArtToCollection(collectionId, resp.data.id, resp.data.artwork_slug)
        } else if (this.selected_collection) {
          this.addArtToCollection(vm.selected_collection, resp.data.id, resp.data.artwork_slug)
        } else {
          this.currentStatus = vm.s.STATUS_SUCCESS
          setTimeout(() => {
            window.location = `/art/${resp.data.artwork_slug}/`
          }, 500)
        }
      }, err => {
        console.log(err)
      })
    },
    getArtists: function () {
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
    saveNewArtmap: function () {
      axiosInstance.post('art', this.submission, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      })
      .then(resp => {
        window.location = `/art/${resp.data.artwork_slug}/`
      }, err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.getArtists()
    this.getCollections()
    setTimeout(() => {
      this.submission.curator = window.user_id
      this.submission.curator_id = window.user_id
    } ,0)
  },
  components: {
    MiniLoader: MiniLoader
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.upload-mask-container{
  .upload-mask{
    p{
      .artmap-secondary{
        float: right;
      }
    }
  }
}
#art_image_upload{
  opacity: 0;
  visibility: hidden;
  position: absolute;
}

.loading-view{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color: rgba(239, 239, 239, 0.7);
  .loading-view-wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    p{}
    .loader-wrap{
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      text-align: center;
      .redirect-notice{
        margin-top:1rem;
        opacity:0;
        visibility: hidden;
        transition: all 0.15s ease-in-out;
        &.show_notice{
          opacity:1;
          visibility: visible;
        }
      }
      .progress-elements{
        position: relative;
        margin-top: 2rem;
        .loading_percent{
          position: absolute;
          top:50%;
          display: block;
          transform:translateY(-50%);
          width: 100%;
          text-align: center;
          i{
            @include font-size(1.75);
            color: $colors_primary;
          }
        }
        svg{
          circle{
            stroke: $colors_primary;
            fill: transparent;
            transition: stroke-dashoffset 1s linear;
            position: relative;
            z-index: 2;
            &#loading-track{
              position: relative;
              z-index:1;
              stroke:$colors_grays_light;
            }
          }
        }
      }
    }
  }
}
.modal-content.new_artwork{
  border:0px;
  padding:0;
}
.modal-body{
  padding: 1.75rem 3rem;
  opacity: 1;
  visibility: visible;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  &.loading{
    opacity: 0;
    visibility: hidden;
  }
}
#mediaFormEl{
  label{
    margin-bottom:0;
  }
  small{
    margin-bottom: 0.7rem;
    margin-top: 0.5rem;
  }
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
      span#loading-progress-bar{
        position: absolute;
        top:0;
        left:0;
        width:0%;
        height:100%;
        z-index: 1;
        background-color:rgba(255, 255, 255, 0.15);
      }
      span#loading_percent{
        position: relative;
        z-index: 2;
      }
      span#success-state{
        @include font-size(1.2);
      }
    }
  }
}
.artist-form-field{
  position: relative;
  z-index:2;
}
.collection-form-field{
  position: relative;
  z-index:1;
}
.auto-complete-input{
  position: relative;
  .new-obj-indicator{
    display: block;
    position: absolute;
    top: 0.4rem;
    right: 1rem;
    font-size: 0.75rem;
    background-color: #deefff;
    padding: 0.1rem 0.6rem;
    border-radius: 0.3rem;
  }
}
.auto-complete-list{
  position: absolute;
  top: 2.1rem;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: white;
  border:$border_input;
  max-height: 10rem;
  overflow-y: scroll;
  box-shadow: 0px 4px 7px 0px rgba(0, 0, 0, 0.2);
  li{
    list-style-type: none;
    padding: 0.75rem;
    border-bottom: 1px solid $input_border_color;
    background-color:transparent;
    @include font-size(0.9);
    transition:all 0.2 ease-in-out;
    cursor: pointer;
    &:hover{
      background-color:#edf3f9;
      color: #0f72d2;
    }
    &:last-child{
      border-bottom:0px;
    }
  }
}
</style>



