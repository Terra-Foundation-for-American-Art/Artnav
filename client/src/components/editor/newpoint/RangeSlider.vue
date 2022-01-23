<template>
  <div>
    <input 
      type="range" 
      :min="scale_min" 
      :max="scale_max" 
      :value='scale_value'
      @input="handleRangeChange">
    <!-- <img class='range_ticks' src="~@/assets/range_slider_image.svg"> -->
    <RangeSliderTicks class='range-slider-ticks' />
  </div>
</template>
<script>
import RangeSliderTicks from '@/components/svgs/RangeSliderTicks.vue'
export default {
  props: ['scale_min', 'scale_max', 'scale_value'],
  components: {
    RangeSliderTicks
  },
  methods: {
    handleRangeChange (e) {
      console.log(e.target.value)
      this.$emit('rangeChange', e.target.value)
    }
  }
}
</script>
<style lang='scss' scoped>
.range-slider-ticks{
  position: absolute;
  display: block;
  top: 0;
  left: 0;
}
.range_ticks{
  display: block;
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 1;
}
input{
  position: relative;
  border:none;
  z-index: 2;
}
input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent; 
  border-color: transparent;
  color: transparent;
}

/* Special styling for WebKit/Blink */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 25px;
  width: 25px;
  border-radius: 2rem;
  background: #ffffff;
  cursor: pointer;
  top:50%;
  transform: translateY(-50%);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
}

/* All the same stuff for Firefox */
input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  height: 25px;
  width: 25px;
  border-radius: 2rem;
  background: #ffffff;
  cursor: pointer;
  top:50%;
  transform: translateY(-50%);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
}

/* All the same stuff for IE */
input[type=range]::-ms-thumb {
  -webkit-appearance: none;
  height: 25px;
  width: 25px;
  border-radius: 2rem;
  background: #ffffff;
  cursor: pointer;
  top:50%;
  transform: translateY(-50%);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border: 0px;
  outline: none;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border: 0px;
  outline: none;
}

input[type=range]::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border: 0px;
  outline: none;
}

input[type=range]::-ms-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border: 0px;
  outline: none;
}

</style>