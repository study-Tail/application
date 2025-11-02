<template>
	<view style="min-height: 100vh; background: #F5F5F5;">
		<view style="display: flex; align-items: center;justify-content: space-between; height: 88rpx; background: #fff; padding: 0 30rpx;">
			<text style="font-size: 40rpx; color: #333;" @click="back">←</text>
			<text style="font-size: 32rpx; font-weight: bold; color: #333; text-align: center;">维保历史</text>
		</view>
		<view style="padding: 30rpx; font-size: 28rpx;color: #666; background: #fff;margin: 20rpx 20rpx 0; border-radius: 16rpx 16rpx 0 0;">
			共<text style="font-weight: bold;font-size: 32rpx; color: #007AFF;" >{{list.length}}</text>条维保记录
		</view>
		
		<view class="list">
			<view v-for="(item,index) in list" :key="index" class="list-item">
				<view class="item-row">
					<text class="label">工单号:</text>
					<text class="value">{{item.workNo}}</text>
				</view>
				<view class="item-row">
					<text class="label">维保类型:</text>
					<text class="value">{{item.type == '0' ? '常规保养':'车辆维修'}}</text>
				</view>
				<view class="item-row">
					<text class="label">预约日期:</text>
					<text class="value">{{item.createTime}}</text>
				</view>
				<view class="item-row">
					<text class="label">预约时间:</text>
					<text class="value">{{item.deliveryTime}}</text>
				</view>
				<view class="item-row">
					<text class="label">维保费用:</text>
					<text class="value">{{item.payment.price}}</text>
				</view>
				<view class="item-row">
					<text class="label">维保状态:</text>
					<text class="value">{{weibao[item.status]}}</text>
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				list:[],
				weibao: ['待支付', '维保中', '已完成']
			}
		},
		async onLoad(){
			let i = await uni.$u.get('/dev-api/bs-vehicle-owner/maintenance-appointment/page')
			this.list = i.rows
		}
	}
</script>

<style scoped>
	.list-item{
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
	}
	.item-row{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx 0;
		font-size: 28rpx;
	}
	.label{
		color: #666;
	}
	.value{
		color: #333;
		font-weight: 500;
	}
</style>