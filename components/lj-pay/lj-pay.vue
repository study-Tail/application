<template>
	<view>
		<view class="content">
			<view class="u-font-15 u-font-bold u-m-b-20 u-p-l-10">
				支付
			</view>
			<view class="u-flex u-border-bottom u-padding-10">
				<view class="u-flex-1">
					<image src="/static/image/balance.png" class="icon"></image>
				</view>
				<view class="u-flex-10">电子钱包</view>
				<view class="u-flex-1">
					<u-radio-group v-model="payType">
						<u-radio name="电子钱包"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="u-flex u-border-bottom u-padding-10">
				<view class="u-flex-1">
					<image src="/static/image/alipay.png" class="icon"></image>
				</view>
				<view class="u-flex-10">支付宝支付</view>
				<view class="u-flex-1">
					<u-radio-group v-model="payType">
						<u-radio name="支付宝"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="u-flex u-padding-10">
				<view class="u-flex-1">
					<image src="/static/image/wxPay.png" class="icon"></image>
				</view>
				<view class="u-flex-10">微信支付</view>
				<view class="u-flex-1">
					<u-radio-group v-model="payType">
						<u-radio name="微信"></u-radio>
					</u-radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "lj-pay",
		props: {
			value: {
				type: String,
				default:"电子钱包"
			}
		},
		data() {
			return {
				payType: this.value
			};
		},
		watch: {
			value() {
			      this.payType = this.value;
			 },
			payType() {
				this.$emit("input", this.payType);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx;
		padding-right: 0rpx;
		background-color: white;
	}

	.icon {
		width: 30px;
		height: 30px;
	}
</style>
