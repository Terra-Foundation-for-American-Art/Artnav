<template>
<span class='card-menu' :class='{open: open}'>
  <span class='card-trigger' @click='open=true'>
    <span class='core-dot'></span>
  </span>
  <nav>
    <ul>
      <li><a :href='"/art/" + card.artwork_slug' title="">Edit Artwork</a></li>
      <li>
        <a v-if='card.published' :href='"/gallery/" + card.artwork_slug' title="">View Published</a>
        <a v-else :href='"/art/" + card.artwork_slug + "/preview"' title="">View Preview</a>
      </li>
      <li v-if='card.published' @click='updatePublishing(false)'>
        Unpublish Artmap
      </li>
      <li v-else @click='updatePublishing(true)'>Publish Artmap</li>
      <li @click='triggerDeleteConfirm'>Delete</li>
    </ul>
  </nav>
  <span class='card_menu_bkgrd' @click='open=false'></span>
</span>
</template>
<script>
import {axiosInstance} from '@/api/endpoints'
export default {
  props: ['card'],
  data () {
    return {
      open: false
    }
  },
  methods: {
    updatePublishing: function (shouldPublish) {
      var artworkToBeUpdated = Object.assign({}, this.card)
      artworkToBeUpdated.published = shouldPublish
      artworkToBeUpdated.artist = this.card.artist.id
      axiosInstance.put(`art/${artworkToBeUpdated.id}/`, artworkToBeUpdated, {
        headers: {
          'X-CSRFToken': window.csrf
        }
      }).then(resp => {
        this.$emit('updatedPublishState', resp.data)
        this.open = false
      }, err => {
        console.log(err)
      })
    },
    triggerDeleteConfirm: function () {
      this.$emit('deleteArtwork')
      this.open = false
    }
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.card-menu{
  position: absolute;
  right: 1rem;
  top: 0.65rem;
  z-index: 2;
  .card-trigger{
    display: block;
    position: absolute;
    right: -0.2rem;
    top: 0;
    padding-bottom: 0.6rem;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s ease-in-out;
    .core-dot{
      display: inline-block;
      background-color:$colors_grays_dark;
      height:5px;
      width:5px;
      border-radius:50%;
      transform: scale(0.6);
      position: relative;
      &:before, &:after{
        content:'';
        display: block;
        position: relative;
        background-color:$colors_grays_dark;
        height:5px;
        width:5px;
        border-radius:50%;
        top: 5px;
        margin-top: 3px;
      }
    }
    &:hover{
      opacity:1;
    }
  }
  nav{
    position: absolute;
    top: -0.3rem;
    right: 1rem;
    width: auto;
    min-width: 10rem;
    padding:1rem;
    background-color:$colors_grays_dark;
    box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.18);
    opacity: 0;
    visibility: hidden;
    transform:translate3d(15px,0px,0px);
    transition: all 0.2s ease-in-out;
    z-index: 56;
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
        @include font-size(0.8);
        transition:all 0.2s ease-in-out;
        cursor: pointer;
        &:hover{
          text-decoration: none;
          color:$colors_primary;
        }
        a{
          color:white;
          @include font-size(0.8);
          transition:all 0.2s ease-in-out;
          &:hover{
            text-decoration: none;
            color:$colors_primary;
          }
        }
      }
    }
  }
  .card_menu_bkgrd{
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    z-index: 55;
  }
  &.open{
    .card-trigger{
      opacity: 1;
    }
    nav{
      transform:translate3d(0px,0px,0px);
      opacity: 1;
      visibility: visible;
    }
    .card_menu_bkgrd{
      display: block;
    }
  }
}
</style>
