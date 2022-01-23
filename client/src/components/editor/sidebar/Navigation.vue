<template>
  <nav class='short_nav'>
    <ul>
      <li><a :href="homeUrl"><span class="oi oi-home" title="icon home" aria-hidden="true"></span></a></li>
      <li>
        <div class="dropdown">
          <a class='nav-link dropdown-toggle' href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="oi oi-person" title="icon person" aria-hidden="true"></span></a>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class='dropdown-item' :href="profileUrl">Profile</a>
            <a class='dropdown-item' :href="logoutUrl">Logout</a>
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>
<script>
  export default {
    data () {
      return {
        homeUrl: window.home_url,
        profileUrl: window.profile_url,
        logoutUrl: window.logout_url
      }
    }
  }
</script>
<style lang='scss'>
@import './../../../style/sass/abstracts/_mixins.scss';
@import './../../../style/sass/abstracts/_variables.scss';
.short_nav{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  padding: 0.7rem 1.5rem;
  ul{
    margin:0;
    padding:0;
    li{
      list-style-type: none;
      display: inline-block;
      a{
        color:$colors_text_secondary;
      }
    }
  }
}
</style>
