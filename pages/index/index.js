//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util');

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        backgroundImg:'/public/images/background0.jpg',
    },
    
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        // console.log('111111', e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    // 捞取拼图
    salvage:function(){
        // let url =  'http://192.168.50.17:3086/drift/salvage';
        let url = util.salvageUrl;
        wx.request({
            url: url,
            success:function(result){
                console.log('捞取拼图',result);
                let res = result.data;
                if(res.code === 200){
                    let jigsaw = JSON.stringify(res.data);
                    // console.log('222222222222',jigsaw);
                    wx.navigateTo({
                        url: '/pages/play/play?task=' + jigsaw,
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '捞取失败：' + res.msg,
                        showCancel: false
                    })
                }
            },
            fail:function(err){
                wx.showModal({
                    title: '提示',
                    content: '捞取请求失败：' + err,
                    showCancel: false
                })
            }
        })
    },

    // 创建拼图
    create:function(){
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            count: 1,
            success: function (res) {
                console.log('图片信息', res);
                app.globalData.img = res.tempFilePaths;

                wx.navigateTo({
                    url: '/pages/editimg/editimg?img=' + res.tempFilePaths,
                })
            }
        })
    },

    onShow:function(){
        let random = Math.round(Math.random() * 8);
        let back = '/public/images/background' + random + '.jpg';
        this.setData({
            backgroundImg:back
        })
    }
})
