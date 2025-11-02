<template>
	<view class="container u-p-20" style="background-color: #F5f5f5; min-height: 100vh;">
		<u-card :show-head="false" :body-style="{padding:'40rpx'}">
			<view slot='body'>
				<text class="u-font-xl u-main-color u-text-center u-block" style="font-weight: bold;">
					{{title}}
				</text>
			</view>
		</u-card>
		<u-card :show-head="false" :body-style="{padding:'20rpx'}" class="u-m-t-20">
			<view slot="body">
				<qiun-data-charts type='column' :opts='opts' :cahrData='chartData' :style="{width:chartWidth +'px' , height:cahrheight +'px'}" />
			</view>
		</u-card>
		
		<u-cell-group title="数据总览" class="u-m-t-20">
			<u-cell-item title="总充电次数" :value="totalcont + '次'"></u-cell-item>
			<u-cell-item title="总充电量" :value="all + 'kwh'"></u-cell-item>
			<u-cell-item title="总花费" :value="'￥'+totalcost"  :value-style="{color:'#fa3534' , fontWeight:'bold'}"></u-cell-item>
		</u-cell-group>
		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				 title:'2023年上半年充电数据分析',
				 chartWidth:0,
				 cahrheight:400,
				 totalcont:0,
				 all:0,
				totalcost:0,
				chartData:{},
				opts:{
					color:["#1890FF" , "#91CB74" , '#FAC858'],
					padding:[15,15,0,5],
					legend:{
						show:true,
						position:'top',
						float:'center'
					},
					xAxis:{
						disableGrid:true,
						scrollShow:false,
						itemCount:6,
						fontSize:12
					},
					yAxis:{
						gridType:"dash",
						data:[{
							min:0,
							title:'次数/电量',
							titleFontSize:11
						}]
					},
					extra:{
						colum:{
							type:"group",
							width:25,
							seriesGap:2,
							categoryGap:5
						}
					}
				}
			}
		},
		async onLoad(){
			let i = uni.getSystemInfoSync();
			this.chartWidth = i.windowWidth - 40
			
			await this.loadData()
		},
		methods:{
			async loadData(){
				uni.showLoading({
					title:'加载中....'
				});
				const res = await uni.$u.get('/dev-api/bs-smart-charger/record/list', {
					queryType: 2,
					beginTime: '2023-01-01 00:00:00',
					endTime: '2023-07-01 23:59:59',
					chargingPileId: 1
				});
			},
			processData(datas) { // 接收 'datas' 作为参数
				// 1. 初始化月份数据结构
				const monthlyData = {
					'1月': {
						count: 0,
						capacity: 0,
						cost: 0
					},
					'2月': {
						count: 0,
						capacity: 0,
						cost: 0
					},
					'3月': {
						count: 0,
						capacity: 0,
						cost: 0
					},
					'4月': {
						count: 0,
						capacity: 0,
						cost: 0
					},
					'5月': {
						count: 0,
						capacity: 0,
						cost: 0
					},
					'6月': {
						count: 0,
						capacity: 0,
						cost: 0
					}
				};
				const pricePerKwh = 1.5; // 电费单价
				// 2. 遍历 API 返回的数据
					datas.forEach(item => {
						if (item.createTime) {
							const month = new Date(item.createTime).getMonth() + 1; // 获取月份 (1-12)
							if (month >= 1 && month <= 6) {
								const monthKey = month + '月';
								const capacity = parseFloat(item.chargingCapacity || 0); // 容错处理
								monthlyData[monthKey].count += 1;
								monthlyData[monthKey].capacity += capacity;
								monthlyData[monthKey].cost += capacity * pricePerKwh; // 实时计算花费
							}
						}
					});
				
					// 3. 【脚本精简】使用 reduce 链式调用计算总计并格式化
					const allMonthStats = Object.values(monthlyData);
					this.totalCount = allMonthStats.reduce((sum, data) => sum + data.count, 0);
					this.totalCapacity = allMonthStats.reduce((sum, data) => sum + data.capacity, 0).toFixed(2);
					this.totalCost = allMonthStats.reduce((sum, data) => sum + data.cost, 0).toFixed(2);
				
					// 4. 【脚本精简】准备图表数据 (使用 map 链式调用)
					const categories = Object.keys(monthlyData);
					this.chartData = {
						categories: categories,
						series: [{
								name: "充电次数",
								data: categories.map(month => monthlyData[month].count)
							},
							{
								name: "充电量(kWh)",
								data: categories.map(month => parseFloat(monthlyData[month].capacity.toFixed(2)))
							},
							{
								name: "花费(元)",
								data: categories.map(month => parseFloat(monthlyData[month].cost.toFixed(2)))
							}
						]
					};
				}
		}
	}
</script>

<style scoped>
	
</style>