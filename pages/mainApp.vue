<template>
	<view style="background-color: #F5F5F5; padding-bottom: 100rpx; min-height: 100vh;">
		<view class="headr">
			<text @click="back()" style="font-size: 45rpx;">←</text>
			<text style="font-size: 32rpx; font-weight: bold;">车主服务</text>
			<text @click="MH()" style="color: #007AFF;">维保历史</text>
		</view>
		
		<!--表单-->
		<view style="margin: 20rpx; background: #fff; border-radius: 16rpx;overflow: hidden;">
			<view class="tit">预约表单</view>
			<view class="row">
				<text>维保类型:</text>
				<radio-group @change="typechange">
					<label style="font-size: 28rpx;">
						<radio value="0" :checked="type == '0'"/>常规保养
					</label>
					<label style="font-size: 28rpx;">
						<radio value="1" :checked="type == '1'"/>车辆维修
					</label>
				</radio-group>
			</view>
			<!-- 城市 -->
			<view class="row">
				<text>城市:</text>
				<picker @change="e => city = e.detail.value" :value="city" :range="cityList" range-key="name">
				<text>{{cityList[city] && cityList[city].name || '请选择'}}</text>
				</picker>
			</view>
			
			<!--预约站-->
			<view class="row">
				<text>维保服务站:</text>
				<picker @change="e=>station = e.detail.value" :value="station" :range="stationList" range-key="serviceStationName">
				<text>{{stationList[station] && stationList[station].serviceStationName || '请选择'}}</text>
				</picker>
			</view>
			
			<!-- 日期 -->
			<view class="row">
				<text>预约日期:</text>
				<picker mode="date" :value="date" @change="e=>date=e.detail.value">
				<text>{{date || '请选择'}}</text>
				</picker>
			</view>
			
			<!-- 时间 -->
			<view class="row">
				<text>预约时间:</text>
				<picker mode="time" :value="time" @change="e=>time=e.detail.value">
				<text>{{time}}</text>
				</picker>
			</view>
			
			<!-- 输入 -->
			<view class="row">
				<text>维保车辆:</text><input v-model="carName" placeholder="请输入" />
			</view>
			<view class="row">
				<text>车牌号码:</text><input v-model="carPhone" placeholder="请输入"/>
			</view>
			<view class="row">
				<text>联系人:</text><input v-model="username" placeholder="请输入"/>
			</view>
			<view class="row">
				<text>联系电话:</text><input v-model="phone" placeholder="请输入"/>
			</view>
			
			<!-- 维修表单 -->
			<view v-if="type =='1'" style="margin: 20rpx; border-radius: 16rpx; background: #eee; overflow: hidden;">
				<view style="tit">维修方案</view>
				<view v-for="i in list" :key="i.id" style="margin: 20rpx; padding: 20rpx;background: #f9f9f9;border-radius: 12rpx;">
					<view class="line"><text>更换零件:</text><text>{{i.replacementPart}}</text></view>
					<view class="line"><text>维修类目:</text><text>{{i.category}}</text></view>
					<view class="line"><text>单项价格:</text><text style="color: #ff6b6b; font-weight: bold;">{{i.unitPrice}}</text></view>
				</view>
				<!-- 总价周期 -->
				<view class="line"><text>维修总价:</text><text style="color: #FF6b6b; font-weight: bold;">{{money}}</text></view>
				<view class="line"><text>维修周期:</text><text>{{days}}天</text></view>

				<canvas canvas-id="sign" style="width: calc(100% - 40rpx); height: 400rpx; margin: 20rpx; background:#F5f5f5; border: dashed 2rpx #ddd; border-radius: 12rpx;" @touchstart="start" @touchmove="move" @touchend="end"></canvas>
			</view>
			
			<view class="btn" @click='submit()'>提交预约</view>
			
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				type:'0',
				cityList:[{
					name:'加载中'
				}],
				city:0,
				stationList:[{
					serviceStationName:'加载中'
				}],
				station:0,
				date:'',
				time:'09:00',
				carName:'',
				carPhone:'',
				username:'',
				phone:'',
				list:[],
				ctx:null,
				drawing:false,
				money:0,
				days:0
			}
		},
		onLoad() {
			this.getcity()
			this.getstation()
			this.gogo()
		},
		methods:{
			back(){
				uni.navigateBack()
			},
			MH(){
				uni.navigateTo({
					url:"/pages/mainHistory"
				})
			},
						// 登录(获取token)
			async gogo(){
				let i = await uni.$u.post('/dev-api/login',{
						username:'16618792645',
						password:"123456"
					})
				if(i.code == 200) uni.setStorageSync('token',i.token)
			},
						// 获取城市列表
			async getcity(){
				let i = await uni.$u.get('/dev-api/common/province/page')
				this.cityList = i.rows
			},
						// 获取服务站列表
			async getstation(){
				const res = await uni.$u.get('/dev-api/bs-vehicle-owner/maintenance-service-station/page')
				this.stationList = res.rows
				console.log(this.stationList)
			},
						// 获取维修方案
			async getplan(){
				let i = await uni.$u.get('/dev-api/bs-vehicle-owner/maintenance-plan/randomList')
				if(i.data){
				this.list = i.data
					this.money = this.list.reduce((sum,item)=> sum+item.unitPrice,0)
					this.days = this.list.reduce((sum,item)=> sum + item.duration,0)
				}
			},
			typechange(e){
				this.type = e.detail.value
				if(this.type == '1'){
					this.getplan()
					this.$nextTick(()=>{
						this.ctx =uni.createCanvasContext('sign',this)
						this.ctx.setLineWidth(3)
						this.ctx.setLineCap('round')
					})
				}
			},
			start(e){
				this.drawing = true
				this.ctx.beginPath()
				this.ctx.moveTo(e.touches[0].x,e.touches[0].y)
			},
			move(e){
				if(!this.drawing) return
				this.ctx.lineTo(e.touches[0].x,e.touches[0].y)
				this.ctx.stroke()
				this.ctx.draw(true)
			},
			end(){
				this.drawing = false
			},
				  
			async submit(){
				// if(!this.name || this.phone) return uni.showToast({
				// 	title:'请填写完整',
				// 	icon:'none'
				// })
				let i  =await uni.$u.post('/dev-api/bs-vehicle-owner/maintenance-appointment',{
					type:this.type,
					carId:1,
					appointDateStr:this.date,
					appointTime:this.time,
					customerName:this.username,
					customerPhone:this.phone
				})
				
					if(this.type == '1'){
						uni.navigateTo({
url: '/pages/data?amount=' + this.total
						})
					}else{
						uni.showToast({
							title:'预约成功'
						})
						setTimeout(()=> uni.navigateTo({url:'/pages/index'}) , 1500)
					}
				// this.$router.push(`/pay?d=${JSON.stringify(r.data)}`)
			}
		}
	}
</script>

<style scoped>
	.headr{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		height: 88rpx;
		padding: 0 30rpx;
	}
	.tit{
		padding: 30rpx;
		font-size: 32rpx;
		font-weight: bold;
		border-bottom: 1rpx solid #eee;
	}
	.row{
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: solid 1rpx #eee;
	}
	.row text:first-child{
		width: 200rpx;
		font-size: 28rpx;
		color: #666;
	}
	.row radio-group{
		display: flex;
		gap: 40rpx;
	}
	.row input,
	.row picker{
		flex: 1;
		font-size: 28rpx;
		text-align: right;
	}
	.line{
		display: flex;
		justify-content: space-between;
		padding: 15rpx 30rpx;
		font-size: 28rpx;
	}
	.btn{
		margin: 40rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg,#667eea 0% , #764ba2 100%);
		border-radius: 44rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
		box-shadow: 0 8rpx 20rpx rgba();
	}
</style>