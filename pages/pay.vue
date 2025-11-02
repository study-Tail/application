<template>
	<view class="container">
		<view class="header">支付</view>
		<view class="amount-box">
			<text class="label">支付金额</text>
			<text class="amount">¥{{amount}}</text>
		</view>
		<view class="pay-btn" @click="pay">确认支付</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: 0
			}
		},
		onLoad(options) {
			this.amount = options.amount || 0
		},
		methods: {
			pay() {
				uni.showToast({
					title: '支付成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index'
					})
				}, 1500)
			}
		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		background: #f5f5f5;
		padding: 40rpx;
	}

	.header {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 60rpx;
	}

	.amount-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 60rpx;
		text-align: center;
		margin-bottom: 60rpx;
	}

	.label {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
	}

	.amount {
		font-size: 68rpx;
		color: #ff6b6b;
		font-weight: bold;
	}

	.pay-btn {
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 44rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
		box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
	}
</style>
