const sd = require('silly-datetime');

export function isPoneAvailable(pone) {
    // 判断是否为手机号
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
        return false;
    } else {
        return true;
    }
}

export function sillyDay(date) {
    return sd.format(date, 'YYYY年MM月DD日 HH:mm');
}

export function sillyDay1(date) {
    return sd.format(date, 'YYYY-MM-DD HH:mm');
}

export function ago(timestamp) {
    sd.locate('zh-cn')
    return sd.fromNow(timestamp);
}

export function getFlatternDistance(lon1, lat1, lon2, lat2) {
    var DEF_PI = 3.14159265359; // PI
    var DEF_2PI = 6.28318530712; // 2*PI
    var DEF_PI180 = 0.01745329252; // PI/180.0
    var DEF_R = 6370693.5; // radius of earth
    var ew1, ns1, ew2, ns2;
    var dx, dy, dew;
    var distance;
    // 角度转换为弧度
    ew1 = lon1 * DEF_PI180;
    ns1 = lat1 * DEF_PI180;
    ew2 = lon2 * DEF_PI180;
    ns2 = lat2 * DEF_PI180;
    // 经度差
    dew = ew1 - ew2;
    // 若跨东经和西经180 度，进行调整
    if (dew > DEF_PI)
        dew = DEF_2PI - dew;
    else if (dew < -DEF_PI)
        dew = DEF_2PI + dew;
    dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
    dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
    // 勾股定理求斜边长
    distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
    return distance;
}

export function quickSort(arr) { //快速排序
    if (arr.length < 1) {
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2); //找到那个基准数
    var pivot = arr.splice(pivotIndex, 1)[0]; //取出基准数，并去除，splice返回值为数组。
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].distance < pivot.distance) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right)); //加入基准数
}

export function calculatRate(data) {
    //接受一个数组 为用户所有的评论 求和
    let rate = 1.5;
    data.forEach(item => {
        rate += item.rate;
    });
    return rate / (data.length + 1);
}

export async function getLocation(store, cb) {
    console.log('开始获取位置信息');
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(r => {
        if (r.point) {
            var lng = r.longitude;
            var lat = r.latitude;

            var point = new BMap.Point(r.longitude, r.latitude); //用当前定位的经纬度查找省市区街道等信息
            var gc = new BMap.Geocoder();
            gc.getLocation(point, rs => {
                var addComp = rs.addressComponents;
                //console.log(rs); //地址信息
                console.log(rs.address); //地址信息
                store.commit("LOCATION", {
                    lng: parseFloat(lng),
                    lat: parseFloat(lat),
                    address: rs.address,
                    district: rs.addressComponents.district
                });
                cb(true);
            });
        } else {
            cb(false);
        }
    });
}