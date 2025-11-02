import {
	devUrl,
	prodUrl,
} from '@/common/settings'
// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	})
	return actions.join('');
}

export function getBaseUrl() {
	return uni.getStorageSync('serverIp');
	// return process.env.NODE_ENV === 'development' ? devUrl : prodUrl;
}

export function dateFormat(date) {
	if (typeof(date) !== 'object') {
		date = date.replace(/-/g, '/');
	}
	let timestamp = new Date(date).getTime();
	return uni.$u.timeFormat(timestamp, 'yyyy年mm月dd日');
}


/**
 * 获取任意时间 
 */
export function getDate(date, AddDayCount = 0) {
	if (!date) {
		date = new Date()
	}
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/')
	}
	const dd = new Date(date)

	dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

	const y = dd.getFullYear()
	const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
	const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
	return {
		fullDate: y + '-' + m + '-' + d,
		year: y,
		month: m,
		date: d,
		day: dd.getDay()
	}
}
