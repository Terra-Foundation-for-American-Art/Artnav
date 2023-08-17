<template>
<div class='utility-nav'>
  <ul>
    <li @click='triggerCreateModal'>
      <CreateIcon />
        Create
    </li>
    <li>
      <router-link to='/' :class='{active: $route.name==="recent"}'>
        <span class="oi oi-timer"></span>
        Recently
      </router-link>
    </li>
    <li>
      <router-link to='/art' :class='{active: $route.name==="art"}'>
          <ArtmapsIcon />
          Artmaps
      </router-link>
    </li>
    <!-- <li>
      <router-link  to='/collections' :class='{active: $route.name==="collections" || $route.name === "collection-detail"}'>
          <CollectionsIcon />
          Collections
      </router-link>
    </li> -->
    <li>
      <router-link  to='/artists' :class='{active: $route.name==="artists"}'>
          <ArtistsIcon />
          Artists
      </router-link>
    </li>
  </ul>
</div>

</template>
<script>

import CreateIcon from './../svgs/Create.vue'
import ArtmapsIcon from './../svgs/ArtmapsIcon.vue'
import CollectionsIcon from './../svgs/CollectionsIcon.vue'
import ArtistsIcon from './../svgs/ArtistsIcon.vue'
export default {
  methods: {
    triggerCreateModal: function () {
      $('#newArtmap').modal('show')
    }
  },
  components: {
    CreateIcon: CreateIcon,
    ArtmapsIcon: ArtmapsIcon,
    CollectionsIcon: CollectionsIcon,
    ArtistsIcon: ArtistsIcon
  }
}
</script>
<style lang='scss' scoped>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.utility-nav{
  position: absolute;
  left: 0;
  width: 100%;
  height: 5rem;
  top: 3.65rem;
  background-color: $colors_grays_dark;
  padding: 1rem;
  z-index: 2;
  .icon{
    display: inline-block;
    width:1.35rem;
    height:1.35rem;
    vertical-align: middle;
    margin-right:0.6rem;
    position: relative;
    &.create{
      top: -0.2rem;
    }
  }
  ul{
    display: flex;
    justify-content:center;
    align-items: center;
    li{
      padding: 0.8rem;
      margin:0 0.5rem;
      border-radius: 0.7rem;
      background-color: rgba(255, 255, 255, 0);
      transition:all 0.2s ease-in-out;
      @include type_header_medium;
      color:$colors_background_primary;
      cursor: pointer;
      list-style-type: none;
      // display: inline-block;
      a{
        color:white;
        &:hover{
          text-decoration: none;
        }
      }
      &:last-child{
        border-right: 0px;
        margin-right:0;
      }
      &:hover, &.active{
        background-color:rgba(255, 255, 255, 0.1);
      }
    }
  }
  @include respond-to('medium'){
    .icon, .oi{
      display: none;
    }
  }
}
</style>
