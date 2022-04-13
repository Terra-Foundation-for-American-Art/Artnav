<template>
  <transition name='main-menu'>
    <div v-if='toggles.main_menu' class='artmap-menu'>
      <div class='artmap-menu-wrap'>
        <div class='art_meta_info' v-if='local_data.art && local_data.artist'>
          <h1>
            <span class='italic_title'>{{local_data.art.artwork_title}},</span> {{local_data.art.artwork_creation_date}}<br>
          </h1>
          <p class='catalog_caption'>
            {{local_data.art.medium}} {{local_data.art.dimensions}}<br>
            {{local_data.art.credit}}, {{local_data.art.accession_number}}
          </p>
          <p class='artist_name'>by {{local_data.artist.artist_name}}</p>
        </div>
        <div class='collection_list' v-if='local_data.collections.length'>
          <div class='row no-gutters'><p class='related-section-label'>Related:</p></div>
          <div class='row related_collection no-gutters' v-if='local_data.collections' v-for='(collection, i) in local_data.collections' :key='i'>
            <h2 class='col-sm-12'>{{collection.collection_title}}</h2>
            <p v-if='collection.curatorial_statement !== "None"' class='curatorial_statement col-sm-12' v-html='collection.curatorial_statement'></p>
            <p class='external_link col-sm-12' v-if='collection.external_link !== "None"'>
              <a :href='collection.external_link' target='blank'>Read More <span class="oi oi-chevron-right"></span></a>
            </p>
            <div
              v-if='collection.artworks.length'
              class='col-sm-3 related-artwork'
              v-for='(artwork, j) in collection.artworks'
              :key='j'
              @click='goToArtmap(artwork.slug)'>
              <div
                class='artwork_img'
                :style='"background-image:url("+artwork.url+");"'></div>
              <h1 class='collection_artwork_title'>{{artwork.name}}</h1>
              <p>by {{artwork.artist}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      open: false
    }
  },
  computed: {
    ...mapState('artmap', ['toggles', 'local_data'])
  },
  methods: {
    renderQHtml: function (contentData) {
      var parsedOps = JSON.parse(contentData)
      var cfg = {}

      var converter = new QuillDeltaToHtmlConverter(parsedOps.ops, cfg)
      return converter.convert()
    },
    goToArtmap: function (slug) {
      window.location.href = `/gallery/${slug}`
    }
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.artmap-menu{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  padding:1rem;
  z-index: 4;
  .artmap-menu-wrap{
    position: relative;
    top:0;
    left:0;
    width:100%;
    height:100%;
    padding:4rem;
    padding-left: 5rem;
    border-radius:1rem;
    background-color:$colors_artcanvas;
    color:white;
    padding-top: 7rem;
    overflow-y: scroll;
    margin: 0;
    .art_meta_info{
      padding:0;
      padding-right: 20%;
      h1{
        margin-top:0;
        color:$colors_primary_header;
        margin-bottom:0.25rem;
      }
      .creation_date, .artist_name{
        margin:0;
      }
      .creation_date{
        margin-top:0.25rem;
        color:$colors_grays_medium;
        margin-bottom:1rem;
      }
      .about_artwork{
        @include font-size(1.08)
        @include line-height(1.6)
        padding-right:18%;
      }
      .catalog_caption{
        @include font-size(0.8);
        @include line-height(1.2);
        margin-top: 0.8rem;
        color:#969696;
      }
    }
  }
  .collection_list{
    margin-top:1.5rem;
    border-top:1px solid rgba(255, 255, 255, 0.1);
    padding-top:1.6rem;
  }
  .related-section-label{
    @include font-size(0.8);
    color:$colors_grays_light;

  }
  .related_collection{
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom:0.5rem;
    margin-bottom:1.5rem;
    .curatorial_statement{
      padding-right:32%;
      margin-bottom: 1rem;
    }
    .external_link{
      a{
        .oi{
          @include font-size(0.6)
          margin-left:0.4rem;
        }
      }
    }
    h2{
      @include type_body_bold;
      @include font-size(1.2);
      margin-bottom:1rem;
    }
    .related-artwork{
      text-align: center;
      cursor: pointer;
      margin-top:1rem;
      .artwork_img{
        background-size:cover;
        background-repeat: no-repeat;
        width:7rem;
        height:7rem;
        border:2px solid transparent;
        border-radius:50%;
        margin:0 auto;
        cursor: pointer;
        transition:all 0.15s ease-in-out;
      }
      .collection_artwork_title{
        a{
          color:white;
          @include font-size(1.2)
          &:hover{
            text-decoration: none;
            color:#199bff;
          }
        }
      }
      h1{
        @include font-size(1.2)
        @include line-height(1.8)
        margin-bottom:0.3rem;
      }
      p{}
      &:hover{
        .artwork_img{
          border:2px solid $colors_primary;
        }
        .collection_artwork_title{
          color:#199bff;
        }
      }
    }
  }
}
.main-menu-enter-active, .main-menu-leave-active{
  transition: all .35s cubic-bezier(0.0, 0.0, 0.2, 1);
  opacity: 1;
  transform: translate3d(0, -0.3rem, 0) scale(1);
}
.main-menu-enter, .main-menu-leave-to{
  transition: all .35s cubic-bezier(0.0, 0.0, 0.2, 1);
  opacity:0;
  transform: translate3d(0, 5rem, 0) scale(0.95);
}
</style>
