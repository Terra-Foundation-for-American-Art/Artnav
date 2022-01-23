<template>
<div class="mini-loader_wrap">
  <div class="sp-3balls" :class='colorClass' :style='additionalStyles'></div>
</div>
</template>
<script>
export default {
  props: ['colorClass', 'additionalStyles']
}
</script>
<style lang='scss'>
.mini-loader_wrap{
  position: relative;
  width: 34px;
  height: 7px;
  display: inline-block;
}
.sp-3balls, .sp-3balls:before, .sp-3balls:after {
  position: absolute;
  top: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 1);
  width: 5px;
  height: 5px;
  transform-origin: center center;
  display: inline-block;
}
.sp-3balls {
  // position: relative;
  background-color: rgba(255, 255, 255, 1);
  opacity: 1;
  -webkit-animation: spScaleAlpha 1s infinite linear;
  animation: spScaleAlpha 1s infinite linear;
}

.sp-3balls.dark, .sp-3balls.dark:before, .sp-3balls.dark:after {
  background-color: rgba(50, 50, 50, 1);
}

.sp-3balls.light, .sp-3balls.light:before, .sp-3balls.light:after {
  background-color: rgba(255, 255, 255, 1);
}

.sp-3balls:before, .sp-3balls:after {
  content: '';
  opacity: 0.25;
}
.sp-3balls:before {
  left: 9px;
  -webkit-animation: spScaleAlphaBefore 1s infinite linear;
  animation: spScaleAlphaBefore 1s infinite linear;
}
.sp-3balls:after {
  left: -9px;
  -webkit-animation: spScaleAlphaAfter 1s infinite linear;
  animation: spScaleAlphaAfter 1s infinite linear;
}
@-webkit-keyframes spScaleAlpha {
  0% { opacity: 1; }
  33% { opacity: 0.25; }
  66% { opacity: 0.25; }
  100% { opacity: 1; }
}
@keyframes spScaleAlpha {
  0% { opacity: 1; }
  33% {  opacity: 0.25; }
  66% { opacity: 0.25; }
  100% {  opacity: 1; }
}
@-webkit-keyframes spScaleAlphaBefore {
  0% { opacity: 0.25; }
  33% { opacity: 1; }
  66% { opacity: 0.25; }
}
@keyframes spScaleAlphaBefore {
  0% { opacity: 0.25; }
  33% { opacity: 1; }
  66% { opacity: 0.25; }
}
@-webkit-keyframes spScaleAlphaAfter {
  33% { opacity: 0.25; }
  66% { opacity: 1; }
  100% { opacity: 0.25; }
}
@keyframes spScaleAlphaAfter {
  33% { opacity: 0.25; }
  66% { opacity: 1; }
  100% { opacity: 0.25; }
}
</style>
