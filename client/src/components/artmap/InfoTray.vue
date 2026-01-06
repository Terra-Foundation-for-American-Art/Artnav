<template>
  <transition name='info-tray'>
    <div v-if='local_data.current_point && toggles.info_tray' id='artmap_info_tray'>
      <div class='info_tray_header row'>
        <div class='controls col-sm-2'>
          <div class='close-tray' @click='closeAndLeave'>
            <i class="gmi-x material-icons">&#xE5CD;</i>
          </div>
          <div class='next-prev'>
            <i v-if='prev' class="fa fa-angle-left" @click='cycle("prev")'></i>
            <i v-if='next' class="fa fa-angle-right" @click='cycle("next")'></i>
          </div>
        </div>
        <div class='info-title col-sm-10'>
          <h1>{{local_data.current_point.point_title}}</h1>
        </div>
      </div>
      <div class='info-tray-body row justify-content-end'>
        <div class='body-content-wrap col-sm-10'>
          <p v-html='renderQHtml(local_data.current_point.point_content)'></p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      currentPos: null
    }
  },
  computed: {
    ...mapState('artmap', ['local_data', 'toggles', 'viewer', 'point_cursor']),
    next: function () {
      if (this.local_data.current_point) {
        this.setCurrentPointIndex()
        if (this.currentPos === (this.local_data.points.length - 1)) {
          return false
        } else {
          return true
        }
      }
    },
    prev: function () {
      if (this.local_data.current_point) {
        this.setCurrentPointIndex()
        if (this.currentPos === 0) {
          return false
        } else {
          return true
        }
      }
    }
  },
  methods: {
    ...mapMutations('artmap', ['setInfoTrayClose', 'setInfoTrayOpen']),
    renderQHtml: function (contentData) {
      var parsedOps = JSON.parse(contentData)
      var cfg = {}
      var converter = new QuillDeltaToHtmlConverter(parsedOps.ops, cfg)
      return converter.convert()
    },
    closeAndLeave: function () {
      this.setInfoTrayClose()
      this.$router.push({ path: `/` })
    },
    setCurrentPointIndex: function () {
      var currentId = this.local_data.current_point.id
      this.local_data.points.forEach((point, i) => {
        if (point.id === currentId) {
          this.currentPos = i
        }
      })
    },
    cycle: function (direction) {
      if (direction === 'prev') {
        if (this.currentPos > 0) {
          this.currentPos -= 1
        }
      }
      if (direction === 'next') {
        if (this.currentPos < (this.local_data.points.length - 1)) {
          this.currentPos += 1
        }
      }
      this.$router.push({path: `/${this.local_data.points[this.currentPos].point_slug}`})
    }
  }
}
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/variables';
@import './../../style/sass/abstracts/mixins';
#artmap_info_tray{
  position: absolute;
  right:0;
  top:0;
  width: 500px;
  height: 100%;
  padding: 2rem;
  background: linear-gradient(90deg, rgba(34, 34, 34, 0), rgba(34, 34, 34, .5) 25%);
  z-index: 3;
  color:white;
  overflow-y: scroll;
}
.info_tray_header{
  position: relative;
  top:0;
  width:100%;
  color:#fffcf6;
  .info-title h1{
    font-size: 22px;
    font-family: Fragment, Helvetica, Arial, sans-serif;
    font-style: normal;
    font-weight: 300;
  }
  .controls{
    padding:0;
    margin:0;
    text-align: center;
    .close-tray{
      position: relative;
      width: 2rem;
      margin: 0 auto;
      margin-bottom: 0.6rem;
      padding-bottom: 0.6rem;
      font-size:22px;
      border-bottom:1px solid rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transform: scale(1);
      transition: all 0.25s ease-in-out;
      &:hover{
        color:#fffcf6;
      }
    }
    .next-prev{
      font-size: 25px;
      i{
        padding: 0.35rem;
        transform: translateX(0px);
        transition: all 0.25s ease-in-out;
        cursor: pointer;
        &:hover{
          color:#fffcf6;
        }
        &.fa-angle-left{
          &:hover{
            transform: translateX(-5px);
          }
        }
        &.fa-angle-right{
          &:hover{
            transform: translateX(5px);
          }
        }
      }
    }
  }
  .oi{
    color:white;
  }
}
.info-tray-body{
  .body-content-wrap{
    iframe, img{
      position: relative;
      display: block;
      width: 100%;
      height: auto;
      border-radius: 0.35rem;
    }
    p{
      color:white !important;
      @include font-size(0.88);
      background-color:transparent !important;
      span, strong, em, u{
        color: #fffcf6 !important;
        font-size: 18px;
        background-color:transparent !important;
        a{ color: #fffcf6 !important; }
      }
      a{ color: #fffcf6 !important; font-size: 18px; text-decoration: underline; }
    }
    h1{
      @include font-size(1.2);
      @include type_header_bold;
      background-color:transparent !important;
      span{
        @include font-size(1.2);
        @include type_header_bold;
        background-color:transparent !important;
      }
    }
    h2{
      @include font-size(1);
      @include type_header_bold;
      background-color:transparent !important;
      span{
        @include font-size(1);
        @include type_header_bold;
        background-color:transparent !important;
      }
    }
    h3{
      padding-bottom: 0.8rem;
      padding-top: 0.8rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    h3, h3 strong, h3 u{
      @include font-size(0.78);
      @include line-height(1.08);
    }
    // .point_caption{
    //   p{
    //     @include font-size(0.78);
    //   }
    // }
  }
}
.info-tray-enter-active, .info-tray-leave-active{
  transition: all .55s cubic-bezier(0.4, 0.0, 0.2, 1);
  opacity: 1;
  transform: translate3d(0rem, 0, 0);
}
.info-tray-enter, .info-tray-leave-to{
  opacity:0;
  transform: translate3d(22rem, 0, 0);
}
</style>
