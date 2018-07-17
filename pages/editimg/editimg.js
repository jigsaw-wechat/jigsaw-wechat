// pages/editimg/editimg.js
import WeCropper from '../../utils//we-cropper.min.js';
let app = getApp();
const device = app.globalData.device;
const width = device.windowWidth
const height = device.windowHeight - 100;

Page({

    data: {
        cropperOpt: {
            src:'',
            id: 'cropper',
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 300) / 2,
                y: (height - 300) / 2,
                width: 300,
                height: 300
            }
        }

    },
    onLoad: function (e) {
        let that = this;
        let img = e.img;
        let { cropperOpt } = this.data
        cropperOpt.src = img;

        new WeCropper(cropperOpt)
            .on('ready', (ctx) => {
                console.log(`wecropper is ready for work!`)
            })
            .on('beforeImageLoad', (ctx) => {
                console.log(`before picture loaded, i can do something`)
                console.log(`current canvas context:`, ctx)
                wx.showToast({
                    title: '上传中',
                    icon: 'loading',
                    duration: 20000
                })
            })
            .on('imageLoad', (ctx) => {
                console.log(`picture loaded`)
                console.log(`current canvas context:`, ctx)
                wx.hideToast()
            })
            .on('beforeDraw', (ctx, instance) => {
                console.log(`before canvas draw,i can do something`)
                console.log(`current canvas context:`, ctx)
            })
            .updateCanvas();
    },
    touchStart(e) {
        this.wecropper.touchStart(e)
    },
    touchMove(e) {
        this.wecropper.touchMove(e)
    },
    touchEnd(e) {
        this.wecropper.touchEnd(e)
    },

    // 重新选择图片
    chooseimage: function () {
        let that = this;

        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            count:1,
            success: function (res) {
                that.setData({
                    cutImage: 'show',
                    addtribeConShow: 'hide'
                });
                that.wecropper.pushOrign(res.tempFilePaths[0]);
            }

        })

    },

    // 确定
    getCropperImage:function() {
        var that = this;
        that.wecropper.getCropperImage((src) => {
            console.log('确定',src);
            if (src) {
                //跳转到任务创建页
                wx.navigateTo({
                    url: '/pages/newJigsaw/newJigsaw?img='+src,
                })
            }

        })

    }
})