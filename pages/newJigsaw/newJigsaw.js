// pages/newJigsaw/newJigsaw.js
let app = getApp();
const device = app.globalData.device;
const width = device.windowWidth;
const screanHeight = device.windowHeight;

const util = require('../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: '', // 本地图片路径
        imgPath:'', // 服务器图片路径
        iwidth: 0, // 图片显示宽度
        left: 0, // 图片距左边距离
        overtime: false, // 超时设置开启

        col:1,
        row:1,
        remark: '', // 留言
        intimeRemark: '', // 未超时留言
        overtimeRemark:'', // 超时留言

        total:0, // 格子总数
        mwidth:0, // 单个格子宽度
        mheight:0, // 单个格子高度

        isShare:false, // 是否已经分享
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        // console.log('00000000000',e);
        let img = e.img;
        let iwidth = parseInt(width * 0.7);
        let left = (width - iwidth) / 2;

        let remarkHeight = screanHeight - iwidth - 49 - 42-42 -10-20;
        this.setData({
            iwidth:iwidth,
            imgUrl:img,
            left:left,
            remarkHeight: remarkHeight
        });

        // 上传图片--尝试改成base64
        // let ctx = wx.createCanvasContext('firstCanvas');
        // ctx.drawImage(img, 0, 0, 300, 300);
        // ctx.draw();
        

        let _this = this;
        let url = util.uploadImgUrl;
        wx.uploadFile({
            url: url,
            filePath: img,
            name: 'jigsaw',
            success: function (res) {
                let path = res.data
                console.log('服务器图片路径', path);
                if(!path){
                    wx.showModal({
                        title: '提示',
                        content: '图片上传失败，不能分享给好友！',
                    });
                    return
                }
                _this.data.imgPath = path;
                
            },
        })
    },
    // 使用canvas获取图片数据并显示到另一个canvas中
    // getImgData:function(){
    //     wx.canvasGetImageData({
    //         canvasId: 'firstCanvas',
    //         x: 0,
    //         y: 0,
    //         width: 300,
    //         height: 300,
    //         success(res) {
    //             console.log('11111111111111', res);
    //             console.log(res.width) // 100
    //             console.log(res.height) // 100
    //             console.log(res.data instanceof Uint8ClampedArray) // true
    //             console.log(res.data.length) // 100 * 100 * 4

    //             let ctx1 = wx.createCanvasContext('firstCanvas1');
    //             wx.canvasPutImageData({
    //                 canvasId: 'firstCanvas1',
    //                 x: 0,
    //                 y: 0,
    //                 width: 300,
    //                 // height:200,
    //                 data: res.data,
    //                 success(res) { 
    //                     console.log('3333333',res);
    //                 },
    //                 fail:function(err){
    //                     console.log('2222222',err);
    //                 }
    //             })
    //         },
    //         fail: function (err) {
    //             console.log('00000000000', err);
    //         }
    //     })
    // },

    // 创建相应数量的网格
    createGridding:function(){
        let col = this.data.col, // 列数
            row = this.data.row; // 行数
        let total = col * row;
        let iwidth = this.data.iwidth;
        let mwidth = iwidth/col,
            mheight = iwidth/row;
        // console.log('11111111', total, mwidth, mheight);
        this.setData({
            total:total,
            mwidth:mwidth,
            mheight:mheight
        })
    },

    // 列数更新
    colNumChange: function (e) { 
        console.log('列数',e.detail.value);
        let col = e.detail.value;
        if(col>1 && col<5){
            this.data.col = col;
        } else if(col>4) {
            // 超出设定
            console.log('超出设定');
        } else if (col < 0) {
            console.log('不能为负');
        } else {
            this.data.col = 1;
        }
        
        this.createGridding();
    },

    // 行数更新
    rowNumChange: function (e) { 
        console.log('行数', e.detail.value);
        let row = e.detail.value;
        if (row > 1 && row < 5) {
            this.data.row = row;
        } else if (row > 4) {
            // 超出设定
            console.log('超出设定');
        } else if(row<0){
            console.log('不能为负');
        } else {
            this.data.row = 1;
        }

        this.createGridding();
    },

    // 超时设置
    overtimeChange:function(e){
        // console.log('超时设置',e);
        this.setData({
            overtime:e.detail.value
        })
    },

    // 未超时留言
    intimeRemark:function(e){
        this.intimeRemark = e.detail.value;
    },
    // 未超时留言
    overtimeRemark:function(e){
        this.overtimeRemark = e.detail.value;
    },

    // 留言更新
    remarkChange: function (e) { 
        console.log('留言',e.detail.value);
        this.data.remark = e.detail.value;
    },
    
    // 返回首页
    goIndex:function(){
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    // 取消
    cancel:function(){
        // 先去数据库删除这张照片，再返回
        let share = this.data.isShare;
        if(!share){
            // 删除图片
            let path = this.data.imgPath;
            let url = util.delImgUrl;
            wx.request({
                url: url,
                method:'POST',
                data:{path:path},
                dataType:'JSON',
                success: function (res) {
                    console.log('删除结果',path,res);
                    let data = JSON.parse(res.data);
                    if (data.code === 200) {
                        wx.navigateBack({
                            delta: 1
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '图片删除失败，暂时不能取消，请再试！',
                            showCancel:false
                        })
                    }                   
                },
            })
        }else{
            wx.navigateBack({
                delta: 1
            })
        }
    },

    // 作为漂流瓶扔海里
    driftBottle:function(){
        let obj = {};
        obj.img = this.data.imgPath;
        obj.col = this.data.col;
        obj.row = this.data.row;
        obj.remark = this.data.remark;

        let user = app.globalData.userInfo;

        obj.nickName = user.nickName; // 用户昵称
        obj.avatarUrl = user.avatarUrl; // 用户头像
        // obj.from = user;
        
        let self = this;
        let url = util.driftCreateUrl;
        wx.request({
            url: url,
            method:'POSt',
            data:obj,
            dataType:'JSON',
            success:function(result){
                // console.log('111111111111111', result);
                let res = JSON.parse(result.data);
                if(res.code === 200){
                    self.setData({
                        isShare: true
                    });
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '扔到海里失败：'+ res.msg,
                        showCancel:false
                    })
                }
            },
            fail:function(err){
                wx.showModal({
                    title: '提示',
                    content: '请求失败：' + err,
                    showCancel: false
                })
            }
        })
    },

    /**
     * 用户点击发给好友
     */
    onShareAppMessage: function (e) {
        // console.log('用户点击发给好友',e);
        let obj = {};
        obj.img = this.data.imgPath;
        obj.col = this.data.col;
        obj.row = this.data.row;
        obj.remark = this.data.remark;

        let user = app.globalData.userInfo;
        obj.nickName = user.nickName;
        obj.avatarUrl = user.avatarUrl;

        let img = this.data.imgUrl;

        this.setData({
            isShare:true
        });
        
        return {
            title: '拼一拼',
            path: '/pages/play/play?task=' + JSON.stringify(obj),
            imageUrl: img
        }
        
    }
})