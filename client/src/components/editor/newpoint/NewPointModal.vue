<template>
<div class="modal fade" id="newArtPoint" tabindex="-1" role="dialog" aria-labelledby="newArtmap" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class='modal-body'>
        <div class='point_captured'>
          <span v-if='captures.new' class='point_thumbnail'>
            <img :src="captures.new.image.src">
          </span>
        </div>
        <div v-if='validation.editor_alert.show' class='point_editor_messages'>
          {{validation.editor_alert.message}}
        </div>
        <div class='new_point_form'>
          <label>Title</label>
          <input type="text" placeholder='Give this point a name...' v-model='local_data.points.new.point_title'>

          <span class='slug_input_group'>
            <span class='slug_input_label'>Slug: {{local_data.points.new.point_slug}}</span>
          </span>

          <label>Short Description</label>
          <input type="text" placeholder='This description will show up in the side bar...' v-model='local_data.points.new.point_lede'>

<!--           <div id='new_caption_group'>
            <label>Caption</label>
            <span class='location_group' id='caption_rt_pos'></span>
          </div> -->

          <div id='new_description_group'>
            <label>Description</label>
            <span class='location_group' id='description_rt_pos'></span>
          </div>

        </div>
      </div>
      <div class='modal-footer'>
        <div class="form-group">
          <button type="submit" class="btn artmap-secondary" data-toggle="modal" data-target="#newArtPoint">
            <span class="glyphicon glyphicon-ok"></span> Cancel
          </button>
          <button
            class='save_point btn artmap-primary'
            @click='attemptSavePoint'>
            <span v-if='!validation.progress'>Save</span>
            <MiniLoader v-else='validation.progress' colorClass='light' additionalStyles=''/>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import Quill from 'quill'
import {mapState, mapMutations, mapActions} from 'vuex'
// import {eventsPointEdits} from './../../EventBuses'
import MiniLoader from './../../loaders/MiniLoader.vue'
export default {
  data () {
    return {
      rt: {
        editor: null,
        // captionEditor: null,
        options: {
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['clean', 'bold', 'italic', 'underline', 'link', 'image', 'video']
            ]
          },
          placeholder: 'Compose an epic...',
          theme: 'snow'
        }
        // captionOptions: {
        //   modules: {
        //     toolbar: [
        //       [{ header: [1, 2, 3, false] }],
        //       ['bold', 'italic', 'underline', 'image', 'video']
        //     ]
        //   },
        //   placeholder: 'Compose an epic caption...',
        //   theme: 'snow'
        // }
      }
    }
  },
  computed: {
    ...mapState('point', ['modes', 'local_data', 'validation', 'captures']),
    ...mapState('art', ['viewer'])
  },
  watch: {
    'local_data.points.new.point_title': function (value) {
      if (value) {
        this.local_data.points.new.point_slug = value.replace(/[^A-Z0-9]+/ig, '_').toLowerCase().toLowerCase()
      } else {
        this.local_data.points.new.point_slug = ''
      }
    },
    'modes.new': function (value) {
      if (value) {
        this.initRichText()
      }
    }
  },
  methods: {
    ...mapMutations('point', ['toggleShowNewPoint', 'closeNewPoint', 'setPointEditorAlert', 'setNewPointContent', 'setValidation']),
    ...mapActions('point', ['saveNewPoint']),
    attemptSavePoint () {
      var richTextData = JSON.stringify(this.rt.editor.getContents())
      // var richTextCaptionData = JSON.stringify(this.rt.captionEditor.getContents())
      var payload = {
        artwork: window.art_id,
        content: richTextData
        // caption: richTextCaptionData
      }
      this.setNewPointContent(payload)
      this.setNewPoint()
    },
    setNewPoint: function ($e) {
      var missingKey = null
      var alert

      for (const key in this.local_data.points.new) {
        if (this.local_data.points.new[key] === null || this.local_data.points.new[key] === '') {
          // || this.this.local_data.points.new[key] === JSON.stringify({'ops': [{'insert': '\n'}]})
          this.setValidation(false)
          missingKey = key
          break
        } else {
          this.setValidation(true)
        }
      }

      if (this.validation.submission) {
        alert = {
          show: false,
          message: null
        }
        this.setPointEditorAlert(alert)
        this.saveNewPoint(this)
      } else {
        var message = this.validation.messages[missingKey]
        alert = {
          show: true,
          message: `Looks like ${message}`
        }
        this.setPointEditorAlert(alert)
      }
    },
    initRichText: function () {
      
      // var existingRtCaptionEl = document.getElementById('new_point_caption_rich_text')
      // // var existingCaptionToolbar = document.getElementsByClassName('ql-toolbar')[0]
      // var existingCaptionToolbar = $('#new_caption_group').find('.ql-toolbar')[0]
      // if (existingRtCaptionEl) existingRtCaptionEl.parentNode.removeChild(existingRtCaptionEl)
      // if (existingCaptionToolbar) existingCaptionToolbar.parentNode.removeChild(existingCaptionToolbar)

      // // add new element for caption rich text:
      // var newCaptionEl = document.createElement('div')

      // newCaptionEl.id = 'new_point_caption_rich_text'

      // var captionRef = document.getElementById('caption_rt_pos')
      // captionRef.parentNode.insertBefore(newCaptionEl, captionRef.nextSibling)

      // this.rt.captionEditor = new Quill(newCaptionEl, this.rt.captionOptions)

      // MAIN DESCRIPTION EDITOR:
      var existingRtEl = document.getElementById('new_point_rich_text')
      // var existingToolbar = document.getElementsByClassName('ql-toolbar')[1]
      var existingToolbar = $('#new_description_group').find('.ql-toolbar')[0]
      if (existingRtEl) existingRtEl.parentNode.removeChild(existingRtEl)
      if (existingToolbar) existingToolbar.parentNode.removeChild(existingToolbar)

      // add new element for rich text:
      var newEl = document.createElement('div')

      newEl.id = 'new_point_rich_text'

      var ref = document.getElementById('description_rt_pos')
      ref.parentNode.insertBefore(newEl, ref.nextSibling)

      this.rt.editor = new Quill(newEl, this.rt.options)
    }
  },
  mounted () {
    this.emitter.on('triggerEditPoint', () => {
      this.closeNewPoint({vm: this})
    })
  },
  components: {
    MiniLoader: MiniLoader
  }
}
</script>
<style lang='scss'>
@import './../../../style/sass/abstracts/_mixins.scss';
@import './../../../style/sass/abstracts/_variables.scss';
.new_point_wrap{
  position: absolute;
  z-index: 5;
}
.point_captured{
  position: relative;
  .point_thumbnail{
    position: relative;
    display: inline-block;
    width:80px;
    height:80px;
    overflow: hidden;
    vertical-align: middle;
    border-radius:50%;
    border: 3px solid white;
    margin-right: 0.8rem;
    img{
      width:100%;
      height:auto;
    }
  }
  .thumbnail_reset{
    display: inline-block;
    vertical-align: middle;
  }
}

.new_point_form{
    position: relative;
    margin-bottom: 0.45rem;
    padding:1rem;
    background-color: transparent;
  .slug_input_group{
    .slug_input_label{
      @include font-size(0.7);
    }
    input.slug_input{
      position: relative;
      display: block;
      border:none;
      padding:0;
      display: inline-block;
      left: 0;
      margin-left:0.45rem;
      margin-bottom:1.6rem;
      width:calc(100% - 5rem);
      @include font-size(0.7);
    }
  }
  input{
    width:100%;
    padding:0.5rem;
    margin-bottom:0.6rem;
  }
  .location_group{
    display: block;
    margin-bottom:2rem;
    .oi-map-marker{
      &.set{
        color: $colors_primary;
      }
    }
  }
}
</style>
