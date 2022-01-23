<template>
  <div>
    <UtilityNav />
      <transition name='fade' mode='in-out'>
        <div class='welcome_header' v-if='user' :class='{hidden: $route.name === "collection-detail"}'>
          <h1 class='welcome_user'>
            Welcome <span class='inline_highlight'>{{user.username}}.</span>
          </h1>
          <div class='filter_set'>
            <input
              id='dashboard_filter_input'
              v-model='filterValue'
              placeholder='Filter by title...'>
          </div>
        </div>
    </transition>
    <transition name="fade" mode="out-in">
      <router-view :filterValue='filterValue'></router-view>
    </transition>
  </div>
</template>
<script>
import {axiosInstance} from '@/api/endpoints'
import UtilityNav from './../nav/UtilityNav.vue'
export default {
  data () {
    return {
      user: null,
      filterValue: null,
      user_id: window.user_id
    }
  },
  watch: {
    $route: function () {
      this.filterValue = null
    }
  },
  methods: {
    getSystemStats: function () {},
    getUserInfo: function () {
      axiosInstance.get(`users/${window.user_id}/`)
      .then(resp => {
        this.user = resp.body
      }, err => {
        console.log(err)
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.getUserInfo()
    }, 0)
  },
  components: {
    UtilityNav
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.welcome_header{
  position: relative;
  z-index: 1;
  margin-bottom:0.8rem;
  transition: all 0.2s ease-in-out;
  &.hidden{
    opacity: 0;
    visibility: hidden;
    display: none;
  }
}
.welcome_user{
  position: relative;
  display: inline-block;
  width:49%;
  color:$colors_text_secondary;
  padding-left:1.2rem;
  @include respond-to('medium'){
    display: block;
    width:100%;
  }
}
.filter_set{
  position: relative;
  display: inline-block;
  width: 49%;
  height: 3rem;
  top: 1rem;
  input{
    &#dashboard_filter_input{
      position: absolute;
      top:0;
      right:0;
      width:60%;
      height:100%;
      border:none;
      border-radius: 0.4rem;
      background-color: white;
      padding:0.75rem;
      @include type_body_bold;
      @include font-size(1);
      transition: all 0.3s ease-in-out;
      &:focus{
        box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.06);
        width:100%;
        outline:none;
      }
    }
  }
  @include respond-to('medium'){
    display: block;
    width:100%;
    margin-bottom:2rem;
  }
}
.dashboard_section_title{
  padding-left:1.2rem;
  @include type_body_bold;
  color:$colors_text_secondary;
  margin-bottom:3rem;
  .view_counts{
    display: block;
    @include type_body;
  }
}
.dashboard_loader{
  position: absolute;
  left: 50%;
  top: 25rem;
  transform: scale(1.4);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
