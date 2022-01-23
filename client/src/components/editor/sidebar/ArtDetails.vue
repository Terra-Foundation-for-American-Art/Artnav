<template>

  <div class='art_meta'>

    <div v-if='art_data.art && art_data.artist'>
      <h1 class='art_title '>{{art_data.art.artwork_title}}</h1>
      <p class='meta_attr'>@{{art_data.art.artwork_slug}}</p>
      <p class='meta_attr'>by {{art_data.artist.artist_name}}</p>
    </div>

    <p v-if='art_data.collections'>
      included in
      <span v-for='collection in art_data.collections'>
        {{collection.collection_title}}
      </span>
    </p>

  </div>

</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('art', ['art_data'])
  }
}
</script>
<style lang='scss'>
@import './../../../style/sass/abstracts/_mixins.scss';
@import './../../../style/sass/abstracts/_variables.scss';
.art_meta{
  border-bottom:$border_meta;
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
}
</style>
