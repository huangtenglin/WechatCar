// pages/fujiadai/fujiadai.js
const CAR_URL = 'http://diangc.cn/api/api/h5';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fujiadai: [],//附加贷的所有列表集合
    yuegongqishu: [],//月供期数值
    qishuIndex: 0,//期数index值
    qishu: '',//期数
    qishulixi: '',//期数利息
    shouxufeiyong: '',//手续费用
    chooseFananIndex: 1,//当选tab所选的index值
    daikuanjiner: 0,//输入的贷款金额
    yuegongjieguo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = '{"methodName": "getSubjoinConfigList", "reqBody": {}, "serviceName": "SubjoinConfigServiceImpl"}'
    //发送ajax请求，获取数据
    wx.request({
      url: CAR_URL, //仅为示例，并非真实的接口地址
      method: 'POST', // post的请求方式
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        //保存数据
        let result = res.data.content;
        let shouxufei2 = '';
        let arr = [];//用来存放月供期数的数组
        let arr2 = [];//用来存放月息利率的数组
        let arr3 = [];//用来存放手续费用的数组
        result.forEach(item => {
          arr.push(item['periods']);
          arr2.push(item['interestPercent']);
          arr3.push(item['procedureCharge']);
          if (!item['periods']) {
            return arr, arr2, arr3;
          }
        });
        this.setData({
          yuegongqishu: arr,
          qishulixi: arr2[0],
          shouxufeiyong: arr3[0],
          fujiadai: result,
          qishu: arr[0]
        });
        console.log(this.data.fujiadai, '期数利息', this.data.qishulixi, '手续费用', this.data.shouxufeiyong);
        //调用月供方法
        this.yuegongfangfa();
        //调用月供结果
        this.yuegongfangfa();
      },
      fail(error) {
        console.log('数据失败');
      }
    });
    this.setData({
      daikuanjiner: this.data.daikuanjiner
    });
  },
  //给三位数添加逗号的方法
  add_comma_toThousands(num) {
    var num = (num || 0).toString();
    var result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  },
  //点击期数，获取期数里面的内容
  getIndex(event) {
    //获取文字内容
    let text = event.target.dataset.text;
    //获取期数的index
    let index = event.target.dataset.index;
    //拿到数据的值
    this.data.fujiadai.forEach(item => {
      if (item['periods'] === text) {
        //更改手续费用和期数利息
        this.setData({
          qishulixi: item['interestPercent'],
          shouxufeiyong: item['procedureCharge'],
          qishu: text,
        })
      }
    });
    console.log('期数利息', this.data.qishulixi, '手续费用' + this.data.shouxufeiyong);
    //更改属性index值
    this.setData({
      qishuIndex: index,
    });
    //调用月供结果的方法
    this.yuegongfangfa();
  },
  //鼠标进去的时候，数去焦点要处理的数据
  fnBlur(event) {
    let value = event.detail.value.trim();
    if (value) {
      this.setData({
        daikuanjiner: value,
      })
    }
    //调用月供结果的方法
    this.yuegongfangfa();
  },
  //月供方法
  yuegongfangfa() {
    let p = +this.data.daikuanjiner + 　(this.data.daikuanjiner * this.data.shouxufeiyong * 0.01);
    //月供结果的计算方式
    let i = (this.data.qishulixi * 0.01) ;
    let i1 = i + 1;
    let n = +this.data.qishu;
    console.log(typeof p, typeof i, typeof n, i, n);
    let yuegongjieguo2 = '';
      //result = (p * (Math.pow(i1, this.data.qishu) * i / (Math.pow(i1, this.data.qishu) - 1))).toFixed(0);
      yuegongjieguo2 = (p * i * Math.pow(i1, n) / (Math.pow(i1, n) - 1)).toFixed(2);
    //设置属性
    this.setData({
      yuegongjieguo: yuegongjieguo2,
    });
  },
  //点击方案期数的切换
  chooseFanan(event) {
    //获取下标值
    let index = Number(event.target.dataset.index);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
});