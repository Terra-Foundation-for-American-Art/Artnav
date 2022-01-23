<template>
<div class='card_list_wrap'>
  <p class='dashboard_section_title'>Dashboard: All Artists</p>
  <div v-if='artists'>
    <ArtistCard
      v-for='item in artists'
      :key='item.id'
      :card='item' />
  </div>
</div>
</template>
<script>
import {axiosInstance} from '@/api/endpoints'
import ArtistCard from './ArtistCard.vue'
export default {
 data () {
  return {
    artists: null,
    work_counts: []
  }
 },
 methods: {
  getArtists: function () {
    axiosInstance.get('artists/')
    .then(resp => {
      this.artists = resp.data
      console.log(resp.data)
    }, err => {
      console.log(err)
    })
  }
 },
 mounted () {
  this.getArtists()
 },
 components: {
  ArtistCard
 }
}
</script>
