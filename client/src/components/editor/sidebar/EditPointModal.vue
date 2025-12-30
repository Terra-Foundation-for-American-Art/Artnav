<template>

<div class="modal fade" id="editArtPoint" tabindex="-1" role="dialog" aria-labelledby="newArtmap" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">

      <div class='modal-body'>

        <div v-if='validation.editor_alert.show' class='point_editor_messages'>
          {{validation.editor_alert.message}}
        </div>

        <div class='art_point new_point'>
        <div class='point_captured'>
            <span class='point_thumbnail'>
              <img :src="editedPoint.point_image">
            </span>
        </div>
          <label>Title</label>
          <input type="text" placeholder='Give this point a name...' v-model='editedPoint.point_title'>

          <span class='slug_input_group'>
            <span class='slug_input_label'>Slug: {{editedPoint.point_slug}}</span>
          </span>

          <label>Short Description</label>
          <input type="text" placeholder='This description will show up in the side bar...' v-model='editedPoint.point_lede'>

          <div id='edit_desc_group'>
            <label>Description</label>
            <span class='location_group' id='edit_description_rt_pos'></span>
          </div>

        </div>

      </div>

      <div class='modal-footer'>
        <div class="form-group">

          <button type="submit" class="btn artmap-secondary" data-toggle="modal" data-target="#editArtPoint">
            <span class="glyphicon glyphicon-ok"></span> Cancel
          </button>

          <button
            class='save_point btn artmap-primary'
            @click='saveChanges'>
            <span v-if='!validation.progress'>Save</span>
            <MiniLoader v-else colorClass='light' additionalStyles=''/>
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
import MiniLoader from './../../loaders/MiniLoader.vue'
export default {
  data () {
    return {
      editingPoint: false,
      editedPoint: {
        id: null,
        point_x: null,
        point_y: null,
        point_title: null,
        point_image: null,
        point_slug: null,
        point_content: null,
        point_lede: null,
        artwork_context: null,
        zoom_value: null,
        scale_value: null
      },
      rt: {
        editor: null,
        captionEditor: null,
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
      }
    }
  },
  computed: {
    ...mapState('point', ['local_data', 'validation', 'modes']),
    ...mapState('art', ['viewer'])
  },
  watch: {
    'local_data.points.edit.title': function (value) {
      if (value) {
        this.local_data.points.edit.point_slug = value.replace(/[^A-Z0-9]+/ig, '_').toLowerCase().toLowerCase()
      } else {
        this.local_data.points.edit.point_slug = ''
      }
    },
    'editedPoint.point_title': function (value) {
      if (value) {
        this.editedPoint.point_slug = value.replace(/[^A-Z0-9]+/ig, '_').toLowerCase().toLowerCase()
      }
    }
  },
  methods: {
    ...mapMutations('point', ['toggleShowNewPoint', 'closeNewPoint', 'setPointEditorAlert', 'setNewPointContent', 'setValidation']),
    ...mapActions('point', ['savePointEdit']),
    resetPoint: function () {},
    attemptSavePoint () {
      if (this.modes.new) {
        var richTextData = JSON.stringify(this.rt.editor.getContents())
      }
    },
    saveChanges: function ($e) {
      var missingKey = null
      var alert

      var richTextData = JSON.stringify(this.rt.editor.getContents())
      this.editedPoint.point_content = richTextData

      for (const key in this.editedPoint) {
        // Skip point_lede as it's optional
        if (key === 'point_lede') {
          continue
        }
        if (this.editedPoint[key] === null || this.editedPoint[key] === '') {
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

       var payload = {
          vm: this,
          pointData: this.editedPoint
        }
        this.savePointEdit(payload)

        // EVENT SUBSCRIBED TO BY:
        this.emitter.emit('clearEdit')
        setTimeout(() => {
          // EVENT SUBSCRIBED TO BY:
          // BOTH POINT GRABBER COMPONENTS
          this.emitter.emit('sidebarAction')
          this.viewer.viewport.goHome(false)
        }, 400)
      } else {
        var message = this.validation.messages[missingKey]

        alert = {
          show: true,
          message: `Looks like ${message}`
        }

        this.setPointEditorAlert(alert)
      }
    },
    postSaveCleanup: function () {
      this.editedPoint = {
        id: null,
        point_x: null,
        point_y: null,
        point_title: null,
        point_slug: null,
        point_content: null,
        point_lede: null,
        artwork_context: null
      }
      this.emitter.emit('clearEdit')
    },
    initRichText: function () {
      // MAIN DESCRIPTION TEXT EDITOR:
      var existingRtEl = document.getElementById('edit_point_rich_text')
      
      var existingToolbar = $('#edit_desc_group').find('.ql-toolbar')[0]
      if (existingRtEl) existingRtEl.parentNode.removeChild(existingRtEl)
      if (existingToolbar) existingToolbar.parentNode.removeChild(existingToolbar)

      // add new element for rich text:
      var newEl = document.createElement('div')
      newEl.id = 'edit_point_rich_text'

      var ref = document.getElementById('edit_description_rt_pos')
      ref.parentNode.insertBefore(newEl, ref.nextSibling)

      this.rt.editor = new Quill(newEl, this.rt.options)
      
      if (this.local_data.points.edit.point_content) {
        this.rt.editor.setContents(JSON.parse(this.local_data.points.edit.point_content))
      }
    },
    assignPointDataToLocalInstance: function (newThumbnail) {
      this.editedPoint.id = this.local_data.points.edit.id
      this.editedPoint.point_x = this.local_data.points.edit.point_x
      this.editedPoint.point_y = this.local_data.points.edit.point_y
      this.editedPoint.point_title = this.local_data.points.edit.point_title
      this.editedPoint.point_slug = this.local_data.points.edit.point_slug
      this.editedPoint.point_content = this.local_data.points.edit.point_content
      this.editedPoint.point_lede = this.local_data.points.edit.point_lede
      this.editedPoint.artwork_context = this.local_data.points.edit.artwork_context
      this.editedPoint.zoom_value = this.local_data.points.edit.zoom_value
      this.editedPoint.scale_value = this.local_data.points.edit.scale_value
      this.editedPoint.point_image = this.local_data.points.edit.point_image
    }
  },
  mounted () {
    this.emitter.on('triggerEditPoint', () => {
      this.assignPointDataToLocalInstance()
      this.initRichText()
      $('#editArtPoint').modal('show')
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
  text-align: center;
  .point_thumbnail{
    position: relative;
    display: inline-block;
    width: 125px;
    height: 125px;
    overflow: hidden;
    vertical-align: middle;
    border-radius: 50%;
    border: 3px solid #e2e2e2;
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

.new_point{
  padding:1rem;
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
