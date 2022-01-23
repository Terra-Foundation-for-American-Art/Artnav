<template>
<div class='artist_card_column'>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">
        {{card.artist_name}}
      </h3>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: ['card']
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
.artist_card_column{
  display: inline-block;
  margin-bottom: 2.8rem;
  position: relative;
  width: 25%;
  padding-right: 21px;
  padding-left: 21px;
  @include respond-to('large') {
    width: 33%;
  }
  @include respond-to('medium') {
    width: 50%;
  }
  @include respond-to('small') {
    width: 100%;
  }

  .card_body_text{
    display: none;
  }
  .data-fig{
    bottom:0rem;
    right:auto;
    width:100%;
  }
  .card{
    padding-bottom:0rem;
  }
}
.collection_card_content_group{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  .card-body{
    padding: 0.8rem 1.25rem 0rem 1.25rem;
  }
}
.card{
  border: none;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.08);
  border-radius: 0.8rem;
  height:100%;
  padding:0;
  padding-bottom:2rem;
  .data-fig{
    position: absolute;
    bottom:0rem;
    right:auto;
    width:100%;
    padding-left: 1.25rem;
    @include font-size(0.625);
    color: #b3b3b3;
    @include line-height(1)
  }
}

.card-img-top{
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 9.8rem;
  position: relative;
  margin: 0 auto;
  border-bottom:$border_primary;
  overflow: hidden;
  border-top-left-radius: 0.8rem;
  border-top-right-radius: 0.8rem;
  .collection-length{
    display: block;
    position: relative;
    margin-top:1rem;
    text-align: center;
    @include font-size(0.65);
  }
  .art_image{
    position: absolute;
    display: block;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    .published_tag{
      display: block;
      position: absolute;
      bottom: -0.8rem;
      right: 1rem;
      border: none;
      border-radius: 0.2rem;
      padding: 0.2rem 0.5rem;
      padding-bottom: 1rem;
      @include font-size(0.7)

    }
  }
}
.collection_images{
  margin:0;
  padding:0;
  position: absolute;
  left:50%;
  top:50%;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  @include type_header_medium;
  li{
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 2.5rem;
    height: 2.5rem;
    display: inline-block;
    margin: 0;
    margin-left: -1.4rem;
    &:first-child{
      margin-left:0;
    }
    &.plus_some_circle{
      background-color:$colors_primary;
      color:white;
      float: right;
      z-index: 6;
      position: relative;

      span{
        display: inline-block;
        position: relative;
        top:50%;
        transform: translateY(-50%);
        @include font-size(0.7)
      }
    }
  }
}
.empty_collection{
  display: block;
  margin:0;
  padding:0;
  position: absolute;
  top:50%;
  width: 100%;
  transform: translateY(-50%);
  text-align: center;
  @include type_header_medium;
  @include font-size(0.7);
  @include line-height(1);
  color:#c1c1c1;
}
.card-body{
  position: relative;
  padding: 1rem 1.25rem;
}
.card_body_text{
  position: relative;
  text-align: left;
  margin-top: 1.5rem;
  z-index: 1;
}
.card-title{
  position: relative;
  margin-bottom:0;
  z-index: 1;
  h3{
    margin:0;
    color:$colors_grays_dark;
  }
  a{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    display: block;
    color:$colors_grays_dark;
    line-height: 1.2rem;
  }
}
.artist_byline{
  color:$colors_text_secondary;
  margin: 0;
  @include font-size(0.8)
  position: relative;
  z-index: 1;
}
.card-text{
  margin-bottom:2rem;
}
</style>
