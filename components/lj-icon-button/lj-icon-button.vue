<template>
	<view>
		<view @click="handleClick">
			<view class="u-text-center">
				<image class="icon" :src="src"></image>
			</view>
			<view class="u-text-center">{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "lj-icon-button",
		props: {
			src: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleClick() {
				this.$emit('click');
			}
		}
	}
</script>

<style scoped>
	.icon {
		width: 80rpx;
		height: 80rpx;
	}
</style>
