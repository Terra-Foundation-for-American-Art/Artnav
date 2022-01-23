<template>

  <div
    v-if='point'
    class='art_point'
    :style='"z-index:"+(local_data.points.all.length - index)+";"'
    :class='{selected: local_data.points.edit === point}'
    @click='locateEdit(false)'>

    <div class='point_ctrl'>

      <span class='point_menu_options' :class='{open: pointMenu}'>
        <nav>
          <ul>
            <li @click.stop @click='editThisPoint'><span class="oi oi-pencil"></span>Edit Details</li>
            <li @click.stop @click='callDeleteAlert()'><span class="oi oi-trash"></span>Delete</li>
          </ul>
        </nav>
      </span>

      <span class='point_title'>{{point.point_title}}</span>
      <i class="material-icons" @click.stop @click='pointMenu = !pointMenu'>&#xE5D4;</i>
    </div>

    <div class='full_point_detail' @click.stop>
      <span class='meta_attr_point_list'>Added on: {{formatDate(point.pub_date)}}</span>
      <span class='meta_attr_point_list'>Slug: {{point.point_slug}}</span>
      <span v-if='point.point_content' class='full_point_detail_body' v-html='renderQHtml(point.point_content)'></span>
    </div>

  </div>

</template>
<script>

import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import moment from 'moment'
import OpenSeadragon from 'openseadragon'
import {mapState, mapMutations, mapActions} from 'vuex'
// import {eventsPointEdits, eventsNewPoints} from './../../EventBuses'
import PencilIcon from './../../svgs/pencil.svg'

export default{
  props: ['point', 'index'],
  data () {
    return {
      expanded: false,
      pointMenu: false,
      showEditPoint: false,
      editingPoint: false,
      editedPoint: {
        id: null,
        point_x: null,
        point_y: null,
        point_title: null,
        point_slug: null,
        point_content: null,
        artwork_context: null
      },
      rt: {
        editor: null,
        options: {
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'image', 'video']
            ]
          },
          placeholder: 'Compose an epic...',
          theme: 'snow'
        }
      }
    }
  },
  computed: {
    ...mapState('art', ['viewer']),
    ...mapState('point', ['modes', 'captures', 'local_data'])
  },
  watch: {
    'editedPoint.point_title': function (value) {
      if (value) {
        this.editedPoint.point_slug = value.replace(/[^A-Z0-9]+/ig, '_').toLowerCase().toLowerCase()
      } else {
        this.editedPoint.point_slug = ''
      }
    }
  },
  methods: {
    ...mapMutations('point', ['setPointToBeDeleted', 'setValidation', 'setPointEditorAlert', 'showEditPointModal', 'closeEditPointModal', 'setEditingPoint', 'setEditCaptureThumb', 'setEditCandidate']),
    ...mapActions('point', ['savePointEdit']),
    // turnOffDrag: function ($e) {
    //   eventsPointEdits.$emit('turnOffDrag')
    // },
    // turnOnDrag: function () {
    //   eventsPointEdits.$emit('turnOnDrag')
    // },
    expandPoint: function () {
      if (!this.showEditPoint) {
        this.expanded ? this.expanded = false : this.expanded = true
      }
    },
    editThisPoint: function () {
      this.locateEdit(true)
      // $('#editArtPoint').modal('show')
      this.emitter.emit('triggerEditPoint')

      // EVENT is subscribed to by:
      // EditPointImageGrabber.vue
      // eventsPointEdits.$emit('recaptureFromThumb')
      console.log('click')
    },
    locateEdit: function (immediately) {
      // this.viewer.zoomPerClick = 1
      this.setEditCaptureThumb(false)
      this.setEditingPoint(true)
      this.setEditCandidate(this.point)

      var coords = {
        x: Number(this.point.point_x),
        y: Number(this.point.point_y)
      }
      var point = new OpenSeadragon.Point(coords.x, coords.y)

      var zoomVal = Number(this.point.zoom_value)

      this.viewer.viewport.zoomTo(zoomVal, immediately)
      this.viewer.viewport.panTo(point, immediately)

      setTimeout(() => {
        this.emitter.emit('locateEdit')
        this.emitter.emit('closeNewPointGrabber')
        this.setEditCaptureThumb(true)
        console.log(this.captures.edit)
      }, 1200)

      // var pointEl = document.getElementById(`${this.point.id}`)
      // $('.osdOverlayWrap').removeClass('focused')
      // var pencilBtn = document.createElement('span')
      // pencilBtn.className = 'snapshot_btn'
      // $(`#${this.point.id}`).html(pencilBtn)
      // $(`#${this.point.id} .snapshot_btn`).html(PencilIcon)
      // $(`#${this.point.id}`).addClass('focused')
      // $('.osdOverlayWrap .snapshot_btn').on('click', (event) => {
      //   eventsPointEdits.$emit('editPointGrabber', this.point)
      //   this.setEditCaptureThumb(true)
      // })
    },
    editBtnEvents: function () {

    },
    formatDate: function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    // renderRichText: function (contentData) {
    //   var parsed = JSON.parse(contentData)
    //   return qRender(parsed.ops)
    // },
    renderQHtml: function (contentData) {
      var parsedOps = JSON.parse(contentData)
      var cfg = {}

      var converter = new QuillDeltaToHtmlConverter(parsedOps.ops, cfg)
      return converter.convert()
    },
    
    callDeleteAlert: function () {
      this.setPointToBeDeleted(this.point)
      $('#deletePoint').modal('show')
    },
    // assignPointDataToLocalInstance: function () {
    //   this.editedPoint.id = this.point.id
    //   this.editedPoint.point_x = this.point.point_x
    //   this.editedPoint.point_y = this.point.point_y
    //   this.editedPoint.point_title = this.point.point_title
    //   this.editedPoint.point_slug = this.point.point_slug
    //   this.editedPoint.point_content = this.point.point_content
    //   this.editedPoint.artwork_context = this.point.artwork_context
    // },
    // toggleShowEditPoint: function () {
    //   if (this.showEditPoint) {
    //     this.showEditPoint = false
    //     this.turnOnDrag()
    //   } else {
    //     this.showEditPoint = true
    //     this.turnOffDrag()
    //     this.expanded = false
    //     eventsPointEdits.$emit('triggerEditPoint', this.point.id)
    //     this.assignPointDataToLocalInstance()
    //     this.initRichTextEditor()
    //   }
    // },
    // clearTemporaryEditPin: function () {
    //   var overlayToRemove = document.getElementById('editing-pin')
    //   if (overlayToRemove) this.viewer.removeOverlay(overlayToRemove)
    // },
    // hideOriginalPin: function () {
    //   var existingPoint = document.getElementById(this.point.id)
    //   if (existingPoint) {
    //     existingPoint.style.display = 'none'
    //   }
    // },
    // showOriginalPin: function () {
    //   var existingPoint = document.getElementById(this.point.id)
    //   if (existingPoint) {
    //     existingPoint.style.display = 'block'
    //   }
    // },
    // moveExistingPin: function (rawX, rawY) {
    //   // localize this canvas overlay instance manipulation to each individual iteration of
    //   // the pointlistitem component to they can each manage their own state:
    //   // this.clearTemporaryPin()
    //   this.hideOriginalPin()
    //   this.clearTemporaryEditPin()
    //   this.viewer.zoomPerClick = 1

    //   var elt = document.createElement('span')
    //   elt.id = 'editing-pin'
    //   elt.className = "osdOverlayWrap"

    //   var newPoint = {
    //     element: elt,
    //     placement: 'CENTER',
    //     checkResize: false,
    //     location: new OpenSeadragon.Point(rawX, rawY)
    //   }

    //   this.viewer.addOverlay(newPoint)
    //   var stringCoords = {
    //     x: String(rawX.toFixed(5)),
    //     y: String(rawY.toFixed(5))
    //   }
    //   this.editedPoint.point_x = stringCoords.x
    //   this.editedPoint.point_y = stringCoords.y
    // },
    // postSaveCleanup: function () {
    //   // after
    //   this.showEditPoint = false
    //   this.viewer.zoomPerClick = 2
    //   this.editedPoint = {
    //     id: null,
    //     point_x: null,
    //     point_y: null,
    //     point_title: null,
    //     point_slug: null,
    //     point_content: null,
    //     artwork_context: null
    //   }
    //   this.turnOnDrag()
    // },
    // cancelChanges: function () {
    //   // because only one pin can be editable at a time
    //   // it can be true that if an edit is canceled
    //   // we can let the viewer resume it's
    //   // click-based zooming:
    //   this.clearTemporaryEditPin()
    //   this.showOriginalPin()
    //   this.turnOnDrag()
    //   this.showEditPoint = false
    //   this.viewer.zoomPerClick = 2
    //   this.editedPoint = {
    //     id: null,
    //     point_x: null,
    //     point_y: null,
    //     point_title: null,
    //     point_slug: null,
    //     point_content: null,
    //     artwork_context: null
    //   }
    // },
    // resetChangesWithoutZoomChange: function () {
    //   this.clearTemporaryEditPin()
    //   this.showOriginalPin()
    //   this.showEditPoint = false
    //   this.editedPoint = {
    //     id: null,
    //     point_x: null,
    //     point_y: null,
    //     point_title: null,
    //     point_slug: null,
    //     point_content: null,
    //     artwork_context: null
    //   }
    // },
    // saveChanges: function () {
    //   var missingKey = null
    //   var alert
    //   var richTextData = JSON.stringify(this.rt.editor.getContents())
    //   this.editedPoint.point_content = richTextData

    //   for (const key in this.editedPoint) {
    //     if (this.editedPoint[key] === null || this.editedPoint[key] === '' || this.editedPoint[key] === JSON.stringify({'ops': [{'insert': '\n'}]})) {
    //       console.log(this.editedPoint)
    //       this.setValidation(false)
    //       missingKey = key
    //       break
    //     } else {
    //       this.setValidation(true)
    //     }
    //   }

    //   if (this.validForSubmission) {
    //     this.setPointEditorAlert({show: false, message: null})

    //     var payload = {
    //       vm: this,
    //       pointData: this.editedPoint
    //     }
    //     this.savePointEdit(payload)

    //     console.log('valid!')
    //   } else {
    //     console.log('not valid!')
    //     var message = this.validationMessages[missingKey]

    //     alert = {
    //       show: true,
    //       message: `Looks like ${message}`
    //     }

    //     this.setPointEditorAlert(alert)
    //   }
    // },
    initRichTextEditor: function () {

      //cleanup any existing rich text elements:
      var existingRtEl = document.getElementById('point_text_edit-'+this.point.id)
      var existingToolbar = document.getElementsByClassName('ql-toolbar')[0]
      if (existingRtEl) existingRtEl.parentNode.removeChild(existingRtEl)
      if (existingToolbar) existingToolbar.parentNode.removeChild(existingToolbar)

      // add new element for rich text:
      var newEl = document.createElement('div')
      newEl.id = 'point_text_edit-'+this.point.id

      var ref = document.getElementById('slug_group-'+this.point.id)
      ref.parentNode.insertBefore(newEl, ref.nextSibling)

      this.rt.editor = new Quill(newEl, this.rt.options)
      this.rt.editor.setContents(JSON.parse(this.point.point_content))
    }
  },
  mounted () {
    // eventsNewPoints.$on('showAddNewPoint',  () => {
    //   this.resetChangesWithoutZoomChange()
    //   this.turnOnDrag()
    // })
    // eventsPointEdits.$on('triggerEditPoint', (pointId) => {
    //   if (this.point.id !== pointId) {
    //     this.resetChangesWithoutZoomChange()
    //   }
    // })
    // eventsPointEdits.$on('ArtCanvasClick', (clickData) => {
    //   if (this.showEditPoint) {
    //     this.moveExistingPin(clickData.point.x, clickData.point.y)
    //   }
    // })
  }
}
</script>
<style lang='scss'>
@import './../../../style/sass/abstracts/_mixins.scss';
@import './../../../style/sass/abstracts/_variables.scss';

.art_point{
  position: relative;
  transform: scale(1) translate3d(0, 0, 0);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  list-style-type: none;
  background-color:rgb(255, 255, 255);
  width:100%;
  // box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.1);
  margin-bottom:0.45rem;
  span.oi{
    color: #d4d4d4;
    margin-right: 0.6rem;
  }
  &.grabbing{
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }
  .point_ctrl{
    position: relative;
    padding:1rem;
    .point_title{
      display: inline-block;
      width: 55%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    i{
      position: absolute;
      @include font-size(1.3)
      right: 0.4rem;
      top: 50%;
      transform: translateY(-50%);
    }
    .point_menu_options{
      position: absolute;
      right: 1rem;
      top: 0.65rem;
      z-index: 2;
      nav{
        position: absolute;
        top: -0.3rem;
        right: 1rem;
        width: auto;
        min-width: 8rem;
        padding:1rem;
        // z-index: 2;
        background-color:$colors_grays_dark;
        box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.18);
        opacity: 0;
        visibility: hidden;
        transform:translate3d(15px,0px,0px);
        transition: all 0.2s ease-in-out;
        &:before{
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 5px solid $colors_grays_dark;
          position: absolute;
          top: 1rem;
          right: -4px;
        }
        ul{
          margin: 0;
          padding:0;
          li{
            list-style-type: none;
            color:white;
            @include font-size(0.75)
            margin-bottom: 0.35rem;
            transition: all 0.2s ease-in-out;
            .oi{
              color:white;
              @include font-size(0.7);
              transition: all 0.2s ease-in-out;
            }
            &:last-child{
              margin-bottom: 0rem;
            }
            &:hover{
              color:$colors_primary;
              .oi{
                color:$colors_primary;
              }
            }
          }
        }
      }
      &.open{
        nav{
          transform:translate3d(0px,0px,0px);
          opacity: 1;
          visibility: visible;
        }
      }
      // .click-bg{
      //   position: fixed;
      //   background-color: red;
      //   top:0;
      //   left:0;
      //   width:100%;
      //   height:100%;
      //   z-index: 1;
      // }
    }
  }
  .point_ctrl_right_side{
    float:right;
  }
  .full_point_detail{
    display: none;
    padding:1rem;
    border-top:$border_meta;
    background-color:$colors_background_point_detail;
    .full_point_detail_body{
      display: block;
      margin-top:1rem;
      padding:0.45rem;
    }
    img, iframe{
      width: 100%;
      height:auto;
    }
  }
  &.open{
    .full_point_detail{
      display: block;
      &.hideForEditing{
        display: none;
      }
    }
  }
  .edit_point{
    padding:1rem;
    margin-bottom:0;
    border-top:$border_meta;
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
  }
  .edit_ctrl_group{
    position: relative;
    width:100%;
    padding:1rem;
    border-top:$border_meta;
  }
  &:before{
    content: '';
    display: block;
    position: absolute;
    top:0;
    left:0;
    width: 0.55rem;
    height: 100%;
    transform: translateX(-0.5rem) scaleX(0);
    background-color:$colors_primary;
    opacity: 0;
    visibility: hidden;
    transform-origin: right;
    transition: transform 0.1s ease-in-out;
  }
  &.selected{
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.18);
    transform: scale(1.009) translate3d(0, 0, 0);
    &:before{
      transform: translateX(-0.5rem) scaleX(1);
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
