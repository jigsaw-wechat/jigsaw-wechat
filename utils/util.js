const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const userInfo = {};

const prd = false; // 是否生产环境。
const MAIN_URL = prd ? 'https://pt.xiaomaiw.top' :'http://192.168.50.18:3086';

const salvageUrl = MAIN_URL + '/drift/salvage';
const uploadImgUrl = MAIN_URL + '/img/upload';
const delImgUrl = MAIN_URL + '/img/delete';
const driftCreateUrl = MAIN_URL + '/drift/create';
const downloadImgUrl = MAIN_URL + '/img/download';

module.exports = {
    formatTime: formatTime,
    userInfo: userInfo, // 用户信息
    salvageUrl: salvageUrl, // 捞取拼图接口
    uploadImgUrl: uploadImgUrl, // 上传图片接口
    delImgUrl: delImgUrl, // 删除图片接口
    driftCreateUrl: driftCreateUrl, // 创建漂流拼图接口
    downloadImgUrl: downloadImgUrl, // 下载图片接口--其实可以不需要
}