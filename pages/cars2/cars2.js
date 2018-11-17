// pages/cars/cars.js
const CAR_URL = 'http://diangc.cn/api/api/h5';
var utils = require('../../utils/util');
var RSA = require('../../utils/wxapp_rsa.js')
let appDatas = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isToShow: false,                  //车系默认隐藏状态,
        currentIndex: null,               //指定索引值,
        listMask: false,                  //遮罩层默认为false
        list: [],  //数据列表集合,
        listCar: [], //对应的车型数据的列表集合
        isiTemTwo:false,
        mynumber:null, //定义输入框的价格为null
        inputValue:'',   //输入按钮框的值
        chooseFananIndex:0,//方案的索引值
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 请求数据
        //发送ajax请求，定时器等事件
        wx.request({
            url: CAR_URL,//网址
            data: {"methodName": "getCarProductConfigDtos","reqBody": {},"serviceName": "CarProductConfigServiceImpl"}, //请求参数
            method: 'post',// post的请求方式
            header: {
                'content-type': 'application/json' // 默认值
            },                                                         // 设置请求的 header
            success: (res) => {
                res.data.content.forEach(item1 => {
                    item1.childCarProductConfigDto.forEach(item => {
                        item.isShow = false
                    })
                });
                this.setData({
                    list: res.data.content,
                })
                //更新全局appData的数据请求
                appDatas.data.list = res.data.content;
            },
            fail: () => {
            }
        });
    },
    //执行逻辑事件
    leibiaozhangkai(event) {
        let index1 = event.currentTarget.dataset.index1
        let index2 = event.currentTarget.dataset.index2
        let itemtwo = event.currentTarget.dataset.itemtwo
        itemtwo.isShow = !itemtwo.isShow
        this.data.list[index1].childCarProductConfigDto[index2] = itemtwo
        this.setData({
            list: this.data.list
        })
    },
    getDetail(event) {
        let productCode = event.target.dataset.itemthree['productCode'];       //获取productCode的code值
        // 请求数据
        //发送ajax请求，定时器等事件
        wx.request({
            url: CAR_URL, //请求网址
            data: {"methodName": "getCarProductDto", "reqBody": { "paramsMap": { "carTypeCode": productCode } }, "serviceName": "CarProductServiceImpl" }, //请求参数
            method: 'post',// post的请求方式
            header: {
                'content-type': 'application/json' // 默认值
            },                                                         // 设置请求的 header
            success: (res) => {
                this.setData({
                    listCar: res.data.content,
                })
                //更新全局appData的数据请求
                appDatas.data.listCar = res.data.content;
                //发送成功的时候，存储车的名字
                wx.setStorage({
                    key: 'carName',
                    data: event.currentTarget.dataset.itemthree['productName'],
                })

                //发送请求的时候，存储三级数据
                wx.setStorage({
                    key: 'list',
                    data: event.currentTarget.dataset.itemthree,
                });

                this.toHome();//请求到数据成功后，跳转到home页面去

            },
            fail: () => {
            }
        });
    },
    //进入焦点，清除输入框的内容
    clear(e){
        this.setData({
            inputValue:'',
        })
    },
    //获取焦点的内容
    fill(e){
        //输入内容更改里面的值
        this.setData({
            inputValue:e.detail.value,
        })
    },
    //点击确认按钮，跳转到home页面效果去
    toHome(e){
        //更改状态
        this.setData({
            listMask:false,
        });
        //页面跳转的时候，把数据存储起来
        wx.setStorage({
            key:'Number',
            data:this.data.inputValue,
        });
        //进入页面的跳转
        wx.navigateTo({
            url: '/pages/home/home',
            success(){
                console.log('页面跳转成功');
            }
        })
    },
    //点击方案期数的切换
    chooseFanan(event){
        //获取下标值
        let index = Number(event.target.dataset.index);
    }
})