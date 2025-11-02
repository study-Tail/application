<template>
	<view class="container u-p-20">
		<u-card :show-head="false" :body-style="{padding: '40rpx'}">
			<view slot="body">
				<text class="u-font-xl u-main-color u-text-center u-block" style="font-weight: bold;">
					{{title}}
				</text>
			</view>
		</u-card>

		<u-card :show-head="false" :body-style="{padding: '20rpx'}" class="u-m-t-20">
			<view slot="body">
				<qiun-data-charts  type="column"   :opts="opts"   :chartData="chartData"
					:style="{width: chartWidth + 'px', height: chartHeight + 'px'}" />
			</view>
		</u-card>

		<u-cell-group title="数据总览" class="u-m-t-20">
			<u-cell-item title="总充电次数" :value="totalCount + '次'"></u-cell-item>
			<u-cell-item title="总充电量" :value="totalCapacity + 'kWh'"></u-cell-item>
			<u-cell-item title="总花费" :value="'¥' + totalCost" :value-style="{ color: '#fa3534', fontWeight: 'bold' }">
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '2023年上半年充电数据分析', // 标题抽离为变量
				chartWidth: 0, // 图表宽度
				chartHeight: 400, // 图表高度
				totalCount: 0, // 总次数
				totalCapacity: 0, // 总电量
				totalCost: 0, // 总花费
				chartData: {}, // 图表数据
				// 图表配置 (这部分是 qiun-data-charts 的配置，精简空间不大)
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858"],
					padding: [15, 15, 0, 5],
					legend: {
						show: true,
						position: "top",
						float: "center"
					}, // 精简了 legend 部分
					xAxis: {
						disableGrid: true,
						scrollShow: false,
						itemCount: 6,
						fontSize: 12
					},
					yAxis: {
						gridType: "dash",
						data: [{
							min: 0,
							title: "次数/电量",
							titleFontSize: 11
						}] // 精简了 yAxis 标题
					},
					extra: {
						column: {
							type: "group",
							width: 25,
							seriesGap: 2,
							categoryGap: 5
						}
					}
				}
			}
		},
		async onLoad() {
			// 1. 动态获取屏幕宽度 (减去页面 padding)
			const sysInfo = uni.getSystemInfoSync();
			this.chartWidth = sysInfo.windowWidth - 40; // 40 = u-p-20 的左右 padding (20*2)

			// 2. 加载数据
			await this.loadData();
		},
		methods: {
			async loadData() {
				uni.showLoading({
					title: '加载中...'
				});
				try {
					// 1. 发起 API 请求
					const res = await uni.$u.get('/dev-api/bs-smart-charger/record/list', {
						queryType: 2,
						beginTime: '2023-01-01 00:00:00',
						endTime: '2023-07-01 23:59:59',
						chargingPileId: 1
					});

					this.processData(res.data || []); // 传入空数组兜底

				} catch (error) {
					console.error('加载数据失败:', error);
				}
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
	/* 【样式精简】
	   由于 u-card 和 u-cell-group 已经提供了所有卡片、
	   圆角、阴影、边距和分割线样式，
	   所以这里几乎所有的自定义样式都可以删除。
	   我们只需要一个页面背景色。
	*/
	.container {
		/* background-color 建议在 pages.json 中配置 */
		background-color: #f5f5f5;
		min-height: 100vh;
	}
</style>
