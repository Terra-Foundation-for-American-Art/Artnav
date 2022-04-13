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
    },
    locateEdit: function (immediately) {
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
      }, 1200)
    },
    editBtnEvents: function () {

    },
    formatDate: function (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
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
