<template>
  <div class="opt-wrap">
    	<ul>
    		<li :class="{active: item.color == value }" v-for="(item, i) in colors" :key="i">
    			<button :disabled="disabled" @click.stop="selectColor($event, item)" :style="{'background-color': item.color}"></button>
    		</li>
    	</ul>
  </div>
</template>

<script>
import colors from './colors'

export default {
	name: "ColorPicker",
	props: {
	  value: {
	  	type: String
	  },
	  disabled: {
	    type: Boolean,
	    default: false
	  }
	},
	data() {
	  return {
	    colors,
	  };
	},
	created() {

	},
	computed:{

	},
	watch: {
	},
	methods: {
		selectColor(e, item){
			this.$emit('input', item.color)
		}
	}
}
</script>

<style scoped>
	.opt-wrap{
		font-size: 0;
		
	}
	.opt-wrap ul{
		padding-left: 0;
	}
	.opt-wrap li{
		display: inline-block;
		margin: 5px;
		line-height: 0;
		position: relative;
	}
	.opt-wrap li.active:before{
		content: '';
		position: absolute;
		width: 38px;
		height: 38px;
		left: 50%;
		top: 50%;
		transform: translate(tranalteX(-50%), tranlateY(-50%));
		border: 1px solid #e60012;
		z-index: 2;
	    transform: translate(-50%, -50%);
		border-radius: 50%;
	}
	.opt-wrap li button{
		width: 28px;
		height: 28px;
		outline: 0;
		border-radius: 50%;
		padding: 0;
		border: 1px solid #ccc;
		cursor: pointer;
	}

</style>
