<template>
  <nav id="artmapper-navigation">
    <ul class='main-nav-items'>
      <li class='backBtn' @click='goBack'><i class="material-icons">&#xE317;</i></li>
      <li v-if='art_data.art && art_data.artist' class='art_title_item'>
        <h1 v-if='art_data.art.artwork_title' class='artwork_title'>{{art_data.art.artwork_title}}</h1>
        <h1 v-else class='artwork_title'>...</h1>
        <h3 v-if='art_data.artist' class='artist_name'>{{art_data.artist.artist_name}}</h3>
      </li>
      <li v-else class='art_title_item'>
        <h1 class='artwork_title'><MiniLoader/></h1>
      </li>
    </ul>
    <ul class='utility-nav-items' v-if='art_data.art'>
      <li v-if='art_data.art.published' class='published_state'><span class="badge badge-published">Published</span></li>
      <li v-else='art_data.art.published' class='published_state'><span class="badge badge-unpublished">Unpublished</span></li>
      <li @click='preview'><Preview /></li>
      <li @click='settings'><i class="fa fa-sliders" aria-hidden="true"></i></li>
    </ul>
  </nav>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import Preview from './../svgs/Preview.vue'
import Publish from './../svgs/Publish.vue'
import MiniLoader from './../loaders/MiniLoader.vue'
export default {
  data () {
    return {
      preview_url: window.preview_url ? window.preview_url : null
    }
  },
  computed: {
    ...mapState('art', ['art_data'])
  },
  methods: {
    ...mapMutations('art', ['setArtmapPreviewState']),
    goBack: function () {
      window.location.href = '/'
    },
    preview: function () {
      window.location.href = this.preview_url
    },
    settings: function () {
      $('#publishModal').modal('show')
    }
  },
  components: {
    Preview: Preview,
    Publish: Publish,
    MiniLoader: MiniLoader
  }
}
</script>
<style lang='scss' scoped>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
#artmapper-navigation{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  background-color:$colors_primary;
  z-index: 9999;
  padding:0rem 2rem;
  .backBtn{
    position: relative;
    width:2.25rem;
    height:2.25rem;
    border-radius:50%;
    background-color:rgba(0, 0, 0, 0.15);
    color:white;
    @include font-size(1.3)
    text-align: center;
    margin-right:1.5rem;
    cursor: pointer;
    transition:all 0.2s ease-in-out;
    i{
      position: relative;
      top:50%;
      transform:translateY(-50%);
    }
    &:hover{
      background-color:rgba(0, 0, 0, 0.4);
    }
  }
  .artwork_title{
    max-width: 27rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  h1, h3{
    display: inline-block;
    vertical-align: middle;
    color: white;
  }
  h1{
    @include font-size(1.35);
  }
  h3{
    margin: 0;
    position: relative;
    top: 0.1rem;
    @include type_header_medium;
    border-left:1px solid rgba(255, 255, 255, 0.4);
    padding-left:1.1rem;
    margin-left:1rem;
  }
  ul{
    margin:0;
    padding:0;
    display: inline-block;
    li{
      list-style-type: none;
      display: inline-block;
    }
    &.utility-nav-items{
      position: absolute;
      height: 100%;
      // width: 5rem;
      padding-right: 2rem;
      right:0;
      li{
        height:100%;
        margin-right:1rem;
        cursor: pointer;
        .badge{
          position: relative;
          display: inline-block;
          top:50%;
          transform: translateY(-50%);
        }
        .icon{
          width: 1.6rem;
          height: 1.05rem;
          position: relative;
          top:50%;
          transform: translateY(-50%);
        }
        .fa-sliders{
          color: white;
          @include font-size(1.1);
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
        .publish{
          width: 1.02rem;
        }
        &:last-child{
          margin-right:0;
        }
      }
    }
  }
}
</style>
