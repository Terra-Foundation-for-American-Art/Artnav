<template>
  <div class="loader_wrap">
      <div class="location_indicator"></div>
  </div>
</template>
<script>
</script>
<style lang='scss'>
@import './../../style/sass/abstracts/_variables.scss';
.loader_wrap{
  position: relative;
  display: block;
  margin:0 auto;
  top:50%;
  transform: translateY(-50%);
}
.location_indicator:before, .location_indicator:after{
    position: relative;
    content: "";
}

.location_indicator:before{
    position: relative;
    margin: 0 auto;
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 100% 100% 100% 0;
    transform: rotateZ(-46deg);
    box-shadow: 0px 0px 0px 2px rgba(255,255,255,1);
    animation: mapping 0.8s ease infinite;
}

.location_indicator:after{
    position: relative;
    margin: 0 auto;
    content: '';
    display: block;
    width: 30px;
    height: 10px;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    top: 7px;
    z-index: -1;
    animation: shadow 0.8s ease infinite;
}

@keyframes mapping{
    0% {transform: translateY(0px) rotate(-46deg);}
    50%{transform: translateY(-8px) rotate(-46deg);}
    100% {transform: translateY(0px) rotate(-46deg);}
}
@keyframes mapping{
    0% {transform: translateY(0px) rotate(-46deg);}
    50%{transform: translateY(-8px) rotate(-46deg);}
    100% {transform: translateY(0px) rotate(-46deg);}
}
@-moz-keyframes mapping{
    0% {transform: translateY(0px) rotate(-46deg);}
    50%{transform: translateY(-8px) rotate(-46deg);}
    100% {transform: translateY(0px) rotate(-46deg);}
}

@keyframes shadow{
    0% {transform: scale(1);}
    50%{transform: scale(0.85);}
    100% {transform: scale(1);}
}
@-webkit-keyframes shadow{
    0% {transform: scale(1);}
    50%{transform: scale(0.85);}
    100% {transform: scale(1);}
}
@-moz-keyframes shadow{
    0% {transform: scale(1);}
    50%{transform: scale(0.85);}
    100% {transform: scale(1);}
}
</style>
