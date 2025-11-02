import Vue from 'vue'
import App from './App'
import store from '@/store';
import uView from "uview-ui";

import { selectDictLabel, getBaseUrl, dateFormat, getDate} from "@/common/commUtils.js";

Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.getBaseUrl = getBaseUrl
Vue.prototype.dateFormat = dateFormat
Vue.prototype.getDate = getDate

Vue.use(uView);
Vue.config.productionTip = false


// vuex
const vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})


// http拦截器
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)
//日期格式

// http接口API集中管理
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

// 公共函数
import globalFunc from '@/utils/common.js'
Vue.use(globalFunc, app)



app.$mount()
