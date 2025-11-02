<template>
	<view>
		<view>
			<view style="margin-top: 30rpx; font-size: 45rpx; text-align: center; margin-bottom: 20rpx;">车主服务</view>
			<view style="padding: 30rpx;">
				<view class="one"style="margin-bottom: 20rpx;" @click="MA()">维保预约</view>
				<view class="one" @click="MH()">维保历史</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			MA(){
				uni.navigateTo({
					url:"/pages/mainApp"
				})
			},
			MH(){
				uni.navigateTo({
					url:"/pages/mainHistory"
				})
			}
		}
	}
</script>

<style>
	.one{
		border: solid 1rpx #000000;
		border-radius: 10rpx;
		padding: 20rpx;
	}
</style>
