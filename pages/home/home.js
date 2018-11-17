// pages/home/home.js
let appDatas = getApp();
const {
    watch,
    computed
} = require('../../utils/vuefy.js');
const {
    jiexi,
    minMax,
    qishu,
    accAdd,
    numMulti,
    accDivCoupon
} = require('../../utils/index.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selected2: '1',
        selected: '1',
        rangeValue: 0,
        rangeValue2: 0,
        activeIndex: 0,
        car_tax: false, //商业保险的展示
        car_taxArrow: true, //商业保险箭头
        daikuancurrentIndex: 0, //默认贷款方案的索引值为0
        daikuan: {
            priceNumber: 0,
            priceNumber2: 0,
            priceNumber3: 0,
            priceNumber4: 0,
        }, //贷款金额的数目
        lilv: 0.1,
        yinhang: false,
        datalist: appDatas.data.listCar, //第二个接口的数据
        carsList: appDatas.data.list, //level为三的数据
        youhuijia: null, //优惠价的数据
        rangeOneMin: 0, //首付比例可拖动的最小值
        rangeOneMax: 0, //首付比例可拖动的最大值
        rangeTwoMin: 0, //年度还款可拖动的最小值
        rangeTwoMax: 0, //年度还款可拖动的最大值
        yuegongqishu: [], //月供期数
        niangongqishu: 12, //年供期数
        qishuIndex: 0, //期数的index索引值
        qishu: '', //分多少期数
        qishulixi: null, //期数利息
        luochejiage: null, //裸车价格
        daikuanjinger: 300000, //贷款金额
        daikuantitle: null, //贷款方案的名字
        yuegongjieguo: null, //月供结果
        diernianyuegong: null, //第二年月供结果
        disannianyueyong: null, //第三年月供结果
        disinianyuegong: null, //第四年月供结果
        diwunianyuegong: null, //第五年月供结果
        listMask: false, //遮罩层
        ischecked: false, //购置税的是否
        istanchu: false, //弹出默认是false
        isxianshiyuegong: false, //是否显示月供,默认是false
        xianshiweikuan: true, //显示尾款
        isxianshixiugaijiage: false, //显示修改价格
        produceName: null, //车的名字
        list: [],
        listCar: [],
        qitafeiyong: null, //其他费用的
        gouzhishui: null, //购置税的
        fnzongshoufu: null, //总首付的
        daikuanjiner: null, //贷款金额的
        lixi: null, //利息
        nianduhuakuan: null, //年度还款|年度递减比例|年度尾款
        jinronyinhangIndex: 0, //银行还是金融的索引值
        yinronyinhangTitle: '宝马金融', //银行还是金融的名字
        jiandishoufu: null, //每个人多还的钱
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //在页面初次进来的时候，就更新数据
        this.setData({
            listCar: appDatas.data.listCar, //第二个接口的数据
        });
        //拿到储存的数据，然后对数据的更改，这个是更改名字的
        wx.getStorage({
            key: 'carName',
            success: (res) => {
                this.setData({
                    produceName: res.data,
                })
            },
        });
        //拿到输入优惠价的数据，并更改初始化的数据
        wx.getStorage({
            key: 'Number',
            success: (res) => {
                this.setData({
                    youhuijia: res.data,
                })
            },
        });
        //拿到三级数据
        wx.getStorage({
            key: 'list',
            success: (res) => {
                this.setData({
                    list: res.data,
                });
                //数据初始化
                this.xuanranshuj(); //第一次的渲染数据
                this.gouzhishui2(); //购置税的计算公式
                this.fnzongshoufu2(); //总首付的计算公式
                this.daikuanjiner2(); //贷款金额的公式
                this.lixi2(); //利息的算法公式
                // this.nianduhuakuan2();     //年度还款的调用公式
                this.yuegongfangfa(); //实现月供方法的调用公式
                //计算每个月减低首付的钱
                this.jiandishoufu2();
                this.duohuanqian2(); //计算每个月多还的钱
            },
        });
    },
    //拖到手动比例的值并且发生改变
    onChange2(event) {
        this.setData({
            rangeValue: event.detail.value,
        });
    },
    onChange4(event){
        this.setData({
            rangeValue: event.detail.value,
        });
        this.fnzongshoufu2(); //让总首付的值发生改变
        this.daikuanjiner2(); //让贷款金额的值发生改变
        this.yuegongfangfa(); //让月供的值也发生改变
        this.lixi2();//让利息也发生改变
        this.jiandishoufu2();//减低每个月多还的钱
        this.duohuanqian2();//计算每个月多还的钱
    },
    //拖动手动比例的值并且发生改变
    onChange3(event) {
        this.setData({
            rangeValue2: event.detail.value, //改变拖动的值
        });
        if (event.detail.value > 0) {
            if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
                //因为这个是年度尾款，有的年度尾款期数的百分比没有值，所以他不能拖动，但是如果一旦他有尾款期数的百分比有值，他肯定可以被拖动，所以这个进行一个判断
                if (+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)) {
                    this.setData({
                        qishulixi:+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)
                    })
                }
            }
        } else if (event.detail.value== 0) {
            this.setData({
                qishulixi:jiexi(this.data.listCar[this.data.daikuancurrentIndex]['period'], this.data.qishu),
            })
        }
        // //让年度还款或者年度尾款或者年度递减比例的值发生改变
        this.nianduhuakuan2();
        //让月供的方法也发生改变
        this.yuegongfangfa();
        //让利息也发生改变
        this.lixi2();
    },
    //点击切换期数
    fnqishu(event) {
        var index = event.currentTarget.dataset.index; //使用event.currentTarget.dataset.XX获取内容
        //更新期数
        let re = /[^\d]/g;
        this.setData({
            qishuIndex: index,
            qishu: event.target.dataset.text.replace(re, ''),
        });
        if (this.data.listCar) {
            this.setData({
                qishulixi: jiexi(this.data.listCar['period'] || this.data.listCar[this.data.daikuancurrentIndex]['period'], this.data.qishu),
            })
        };
        if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
            //因为这个是年度尾款，有的年度尾款期数的百分比没有值，所以他不能拖动，但是如果一旦他有尾款期数的百分比有值，他肯定可以被拖动，所以这个进行一个判断
            if (+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)) {
                let rangeTwoMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                let rangeTwoMax2 = ++minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                this.data.rangeValue2 = rangeTwoMin2;
                this.setData({
                    rangeTwoMin: rangeTwoMin2,
                    rangeTwoMax: rangeTwoMax2,
                    rangeValue2: rangeTwoMin2,
                    xianshiweikuan: true,
                });
            } else {
                //因为有的期数是没有的，所以把他最小值和最大值设置为0
                this.setData({
                    rangeTwoMin: 0,
                    rangeTwoMax: 0,
                    rangeValue2: 0,
                    xianshiweikuan: false,
                });
            }
        } else if(this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx004'){
           this.setData({
               xianshiweikuan: false,
           })
        }
        else {
            this.setData({
                xianshiweikuan: true,
            })
        };
        this.yuegongfangfa();
        this.lixi2();

    },
    //是否更改状态
    onChange() {
        //更改状态
        this.setData({
            ischecked: !this.data.ischecked
        });
        //如果状态发生改变就去调用改函数
        this.fnzongshoufu2(); //调用总首付的算法
        this.daikuanjiner2(); //调用贷款金额的算法
        this.yuegongfangfa(); //调用月供方法的算法
        this.jiandishoufu2();//减低每个月多还的钱
        this.duohuanqian2();//计算每个月多还的钱
        this.lixi2();
    },
    //数据的初始化,第一次对页面的数据进行渲染
    xuanranshuj() {

        if (this.data.listCar && this.data.listCar[0]) {
            /**
             * 在这里我们默认他选中的是第一条的数据
             */
            // this.setData({
            //   rangeOneMin: +minMax(this.data.listCar[0]['prepayPercent'])[0], //首付比例的最小值
            //   rangeOneMax: +minMax(this.data.listCar[0]['prepayPercent'])[1], //首付比例大最大值
            // });
            this.setData({
                rangeValue: this.data.rangeOneMin //首付比例是滑动的是第一条的最小数据
            });
            let rangeOneMin2 = +minMax(this.data.listCar[0]['prepayPercent'])[0];
            let rangeOneMax2 = +minMax(this.data.listCar[0]['prepayPercent'])[1];
            this.setData({
                rangeOneMin: rangeOneMin2,
                rangeOneMax: rangeOneMax2,
                rangeValue: rangeOneMin2,
            });
            /**
             * 如果对应的是不同的贷款方案，则年度还款和年度递减,年度尾款比例的结果也是不一样的，所以在这里要进行判断
             * 因为有6种不同的贷款方案，不同的贷款方案有不同的年段还款比例值和年度递减和年度尾款，所以根据结果code判断拿到不同的结果值
             */
            if (this.data.listCar[0]['productCode'] === 'xxx003') {
                let rangeTwoMin2 = +minMax(this.data.listCar[0]['yearDecreasePercent'])[0] ? +minMax(this.data.listCar[0]['yearDecreasePercent'])[0] : 0; //年度递减比例的最小值
                let rangeTwoMax2 = +minMax(this.data.listCar[0]['yearDecreasePercent'])[1] ? +minMax(this.data.listCar[0]['yearDecreasePercent'])[1] : 0; //年度递减比例的最大值
                let yuegongqishu2 = qishu(this.data.listCar[0]['yearDecreasePeriod']) ? qishu(this.data.listCar[0]['yearDecreasePeriod']) : []; //拿到月供期数
                // this.setData({
                //     rangeTwoMin: +minMax(this.data.listCar[0]['yearDecreasePercent'])[0] ? +minMax(this.data.listCar[0]['yearDecreasePercent'])[0] : 0, //年度递减比例的最小值
                //     rangeTwoMax: +minMax(this.data.listCar[0]['yearDecreasePercent'])[1] ? +minMax(this.data.listCar[0]['yearDecreasePercent'])[1] : 0, //年度递减比例的最大值
                //     yuegongqishu: qishu(this.data.listCar[0]['yearDecreasePeriod']) ? qishu(this.data.listCar[0]['yearDecreasePeriod']) : [], //拿到月供期数
                //     xianshiweikuan: true,
                // });
                // this.setData({
                //     rangeValue2: this.data.rangeTwoMin,
                // });
                this.setData({
                    rangeTwoMin: rangeTwoMin2,
                    rangeTwoMax: rangeTwoMax2,
                    yuegongqishu: yuegongqishu2,
                    xianshiweikuan: true,
                    rangeValue2: rangeTwoMin2
                });
                this.nianduhuakuan2(); //年度还款的调用公式
            } else if (this.data.listCar[0]['productCode'] === 'xxx005') {
                //这里判断是弹性尾款的
                let rangeTwoMin2 = +minMax(this.data.listCar[0]['pricesPercent'])[0] ? +minMax(this.data.listCar[0]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                let rangeTwoMax2 = +minMax(this.data.listCar[0]['pricesPercent'])[1] ? +minMax(this.data.listCar[0]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                let yuegongqishu2 = qishu(this.data.listCar[0]['period']) ? qishu(this.data.listCar[0]['period']) : []; //尾款期数
                // this.setData({
                //     rangeTwoMin: +minMax(this.data.listCar[0]['pricesPercent'])[0] ? +minMax(this.data.listCar[0]['pricesPercent'])[0] : 0, //年度尾款比例的最小值
                //     rangeTwoMax: +minMax(this.data.listCar[0]['pricesPercent'])[1] ? +minMax(this.data.listCar[0]['pricesPercent'])[1] : 0, //年度尾款比例的最大值
                //     yuegongqishu: qishu(this.data.listCar[0]['period']) ? qishu(this.data.listCar[0]['period']) : [], //尾款期数
                //     xianshiweikuan: true,
                // });
                // this.setData({
                //     rangeValue2: this.data.rangeTwoMin, //默认滑动滑动的最小数据
                // });
                this.setData({
                    rangeTwoMin: rangeTwoMin2,
                    rangeTwoMax: rangeTwoMax2,
                    yuegongqishu: yuegongqishu2,
                    xianshiweikuan: true,
                    rangeValue2:rangeTwoMin2
                });
                //this.nianduhuakuan2(); //年度还款的调用公式
            } else if (this.data.listCar[0]['productCode'] === 'xxx004') {
                //标准贷款模式下的，没有年度还款比例值
                let rangeTwoMin2 = 0;
                let rangeTwoMax2 = 0;
                let yuegongqishu2 = qishu(this.data.listCar[0]['period']);
                this.setData({
                    rangeTwoMin:rangeTwoMin2,
                    rangeTwoMax:rangeTwoMax2,
                    yuegongqishu:yuegongqishu2,
                    xianshiweikuan: true,
                    rangeValue2:rangeTwoMin2
                });
            } else if (this.data.listCar[0]['productCode'] === 'xxx001') {
                this.setData({
                    yuegongqishu: qishu(this.data.listCar[0]['period']) ? qishu(this.data.listCar[0]['period']) : [], //尾款期数
                });
                if (+jiexi(this.data.listCar[0]['pricesPeriod'], this.data.qishu)) {
                    let rangeTwoMin2 = +minMax(this.data.listCar[0]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                    let rangeTwoMax2 = +minMax(this.data.listCar[0]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                    this.setData({
                        rangeTwoMin:rangeTwoMin2,
                        rangeTwoMax:rangeTwoMax2,
                        xianshiweikuan: true,
                        rangeValue2:rangeTwoMin2
                    });
                } else {
                    this.setData({
                        rangeTwoMin: 0,
                        rangeTwoMax: 0,
                        rangeValue2: 0,
                        xianshiweikuan: false,
                    });
                    //this.nianduhuakuan2(); //年度还款的调用公式
                }
            } else {
                //this.nianduhuakuan2(); //年度还款的调用公式
                let rangeTwoMin2 = +minMax(this.data.listCar[0]['yearRepaymentPercent'])[0] ? +minMax(this.data.listCar[0]['yearRepaymentPercent'])[0] : 0; //年度还款比例的最小值
                let rangeTwoMax2 = +minMax(this.data.listCar[0]['yearRepaymentPercent'])[1] ? +minMax(this.data.listCar[0]['yearRepaymentPercent'])[1] : 0; //年度还款比例的最大值
                let yuegongqishu2 = qishu(this.data.listCar[0]['period']) ? qishu(this.data.listCar[0]['period']) : [];//月供期数
                this.setData({
                    rangeTwoMin:rangeTwoMin2,
                    rangeTwoMax:rangeTwoMax2,
                    yuegongqishu:yuegongqishu2,
                    xianshiweikuan: true,
                    rangeValue2:rangeTwoMin2
                });
            }
            let qishu2 = this.data.yuegongqishu[0];
            this.setData({
                qishu:qishu2,
                luochejiage: this.data.list['prices'],
                daikuantitle: this.data.listCar[0]['productName'],
                qishulixi: jiexi(this.data.listCar[0]['period'], qishu2),
            });
            this.nianduhuakuan2(); //年度还款的调用公式
        }

    },
    //输入修改优惠价格的，鼠标进去的时候
    getPrice(e) {
        let price = null;
        if (e.detail.value) {
            price = e.detail.value;
        } else {
            price = this.data.luochejiage;
        }
        //更改状态
        this.setData({
           youhuijia:price,
        });
        //如果状态发生改变就去调用改函数
        this.fnzongshoufu2(); //调用总首付的算法
        this.daikuanjiner2(); //调用贷款金额的算法
        this.yuegongfangfa(); //调用月供方法的算法
    },
    //实现弹出这个其他费用的算法
    tanchu() {
        this.setData({
            istanchu: !this.data.istanchu,
        })
    },
    //实现让月供和弹出层的这个方法消失
    yincanxiansyuegong() {
        this.setData({
            istanchu: false, //关闭弹出层效果
        });
        if (this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx003') {
            this.setData({
                isxianshiyuegong: false,
            })
        }
    },
    //实现让月供显示出来
    xianshiyuegong() {
        if (this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx003') {
            this.setData({
                isxianshiyuegong: true,
            })
        }
    },
    //实现隐藏其他费用的功能
    fn_car_tax_arrow(event) {
        this.setData({
            car_tax: !this.data.car_tax,
            car_taxArrow: false,
        })
    },
    //实现其他费用的向上展示的功能
    fn_up() {
        this.setData({
            car_tax: false,
            car_texArrow: true,
        })
    },
    //点击该方法，实现遮罩层的显示和隐藏
    fnjingrongyinhang(e) {
        this.setData({
            listMask: !this.data.listMask,
        })
    },
    //点击遮罩层，让遮罩层消失
    fnlistMask() {
        this.setData({
            listMask: false,
        })
    },
    //宝马和银行贷款方案的切换
    fnjinrong(event) {
        //判断是否是宝马金融还是银行方案
        let yinhang2 = '';//标志是银行的状态是true还是false
        let listMask2 = '';//标志遮罩层的状态是true还是false
        let yinronyinhangTitle2 = '';//标志金融方案切换的名字
        this.setData({
            jinronyinhangIndex: event.target.dataset.index,
        });
        if (event.target.dataset.text === '银行贷款') {
            //更改状态
            let qishulixi2 = '';
            yinhang2 = true;
            listMask2 = false;
            yinronyinhangTitle2 = '银行';
            this.setData({
                qishulixi: qishulixi2
            });

        } else {
            yinhang2 = false;
            listMask2 = false;
            yinronyinhangTitle2 = '宝马金融';
        }
        //更改状态
        this.setData({
            yinhang:  yinhang2,
            listMask: listMask2,
            yinronyinhangTitle:yinronyinhangTitle2
        });
    },
    //左箭头切换贷款方法
    leftArrow() {
        //判断this.data.listCar是否存在，如果存在则执行下面的程序
        if (this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]) {
            var length = this.data.listCar.length - 1;
            this.data.daikuancurrentIndex--;
            if (this.data.daikuancurrentIndex < 0) {
                this.data.daikuancurrentIndex = length;
            }

            let rangeOneMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] : 0; //不同方案有不同的首付比例值，这个是首付比例的最小值
            let rangeOneMax2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] : 0; //不同方案有不同的首付比例值，这个是首付比例的最大值
            // this.setData({
            //     daikuancurrentIndex: this.data.daikuancurrentIndex,
            //     daikuantitle: this.data.listCar[this.data.daikuancurrentIndex]['productName'], //贷款方案的名字
            //     rangeOneMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] : 0, //不同方案有不同的首付比例值，这个是首付比例的最小值
            //     rangeOneMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] : 0, //不同方案有不同的首付比例值，这个是首付比例的最大值
            // });
            // this.setData({
            //     rangeValue: this.data.rangeOneMin, //一切换的时候，就默认他是首付比例的最小值
            // });
            this.setData({
                daikuancurrentIndex: this.data.daikuancurrentIndex,
                daikuantitle: this.data.listCar[this.data.daikuancurrentIndex]['productName'], //贷款方案的名字
                rangeOneMin:rangeOneMin2,
                rangeOneMax:rangeOneMax2,
                rangeValue:rangeOneMin2,
            });
            //如果productCode==='xxx003则会发生改变,则会变成年度递减比例'
            if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx003') {
                this.setData({
                    yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null
                });
                this.setData({
                    rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[0] : 0, //年度递减比例的最小值
                    rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[1] : 0, //年度递减比例的最大值
                    xianshiweikuan: true,
                    qishu: this.data.yuegongqishu[0],
                });
                this.yuegongfangfa(); //调用月供的方法
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx005') {
                let yuegongqishu2 = qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : []; //尾款期数
                let rangeTwoMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                let rangeTwoMax2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                this.setData({
                    yuegongqishu:yuegongqishu2,
                    rangeTwoMin:rangeTwoMin2,
                    rangeTwoMax:rangeTwoMax2,
                    xianshiweikuan: true,
                    qishu:yuegongqishu2[0],
                });
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
                //因为这个是年度尾款，有的年度尾款期数的百分比没有值，所以他不能拖动，但是如果一旦他有尾款期数的百分比有值，他肯定可以被拖动，所以这个进行一个判断
                if (+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)) {
                    let rangeTwoMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                    let rangeTwoMax2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                    this.setData({
                        rangeTwoMin: rangeTwoMin2,
                        rangeTwoMax: rangeTwoMax2,
                        xianshiweikuan: true,
                        rangeValue2:rangeTwoMin2
                    });

                } else {
                    this.setData({
                        rangeTwoMin: 0,
                        rangeTwoMax: 0,
                        rangeValue2: 0,
                        xianshiweikuan: false
                    });
                }
                let yuegongqishu2 = qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null; //尾款期数
                this.setData({
                    yuegongqishu: yuegongqishu2,
                    qishu: yuegongqishu2[0]
                });
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx002') {
                if (this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent']) {
                    this.setData({
                        rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] : 0, //年度尾款比例的最小值
                        rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] : 0, //年度尾款比例的最大值
                        yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null
                    })
                }
                this.setData({
                    xianshiweikuan: true,
                    qishu: this.data.yuegongqishu[0]
                });
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx004') {
                this.setData({
                    yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null,
                });
                this.setData({
                    rangeTwoMin: 0,
                    rangeTwoMax: 0,
                    qishu: this.data.yuegongqishu[0],
                    xianshiweikuan: false,
                });
            } else {
                this.setData({
                    rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] : 0, //年度还款比例的最小值
                    rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] : 0, //年度还款比例的最大值
                    yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null,
                    xianshiweikuan: true
                });
            }
            this.setData({
                rangeValue2: this.data.rangeTwoMin //年度还款比例的最小值
            });
            this.nianduhuakuan2(); //年度还款的调用公式
            //初始值默认为第一个的月供期数
            this.setData({
                qishuIndex: 0,
            });
            this.setData({
                qishulixi: jiexi(this.data.listCar[this.data.daikuancurrentIndex]['period'], this.data.qishu),
            });
            if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
                if (+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)) {
                    this.setData({
                        rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0, //年度尾款比例的最小值
                        rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0, //年度尾款比例的最大值
                        xianshiweikuan: true
                    });
                    this.setData({
                        rangeValue2: this.data.rangeTwoMin,
                    });
                    this.nianduhuakuan2(); //年度还款的调用公式
                } else {
                    this.setData({
                        rangeTwoMin: 0,
                        rangeTwoMax: 0,
                        rangeValue2: 0,
                        xianshiweikuan: false
                    });
                }
            }
            this.daikuanjiner2();
            this.yuegongfangfa(); //月供方法的调用公式
            this.nianduhuakuan2(); //年度还款的调用公式
            this.fnzongshoufu2(); //总首付的计算公式
            this.lixi2();
            this.jiandishoufu2();//减低每个月多还的钱
            this.duohuanqian2();//计算每个月多还的钱
            this.setData({
                rangeValue: this.data.rangeOneMin,
                rangeValue2: this.data.rangeTwoMin,
                ischecked:false,
            });
        }
    },
    rightArrow() {
        if (this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]) {
            var length = this.data.listCar.length - 1;
            this.data.daikuancurrentIndex++;
            if (this.data.daikuancurrentIndex > length) {
                this.data.daikuancurrentIndex = 0;
            }
            let rangeOneMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] : 0; //不同方案有不同的首付比例值，这个是首付比例的最小值
            let rangeOneMax2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] : 0; //不同方案有不同的首付比例值，这个是首付比例的最大值
            // this.setData({
            //     daikuancurrentIndex: this.data.daikuancurrentIndex,
            //     daikuantitle: this.data.listCar[this.data.daikuancurrentIndex]['productName'], //贷款方案的名字
            //     rangeOneMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] : 0, //不同方案有不同的首付比例值，这个是首付比例的最小值
            //     rangeOneMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[1] : 0, //不同方案有不同的首付比例值，这个是首付比例的最大值
            // });
            // this.setData({
            //     rangeValue: this.data.rangeOneMin, //一切换的时候，就默认他是首付比例的最小值
            // });
            this.setData({
                daikuancurrentIndex: this.data.daikuancurrentIndex,
                daikuantitle: this.data.listCar[this.data.daikuancurrentIndex]['productName'], //贷款方案的名字
                rangeOneMin:rangeOneMin2,
                rangeOneMax:rangeOneMax2,
                rangeValue:rangeOneMin2,
            });
            //如果productCode==='xxx003则会发生改变,则会变成年度递减比例'
            if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx003') {
                this.setData({
                    yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null
                });
                this.setData({
                    rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[0] : 0, //年度递减比例的最小值
                    rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearDecreasePercent'])[1] : 0, //年度递减比例的最大值
                    xianshiweikuan: true,
                    qishu: this.data.yuegongqishu[0],
                });
                this.yuegongfangfa(); //调用月供的方法
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx005') {
                let yuegongqishu2 = qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : []; //尾款期数
                let rangeTwoMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                let rangeTwoMax2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                this.setData({
                    yuegongqishu:yuegongqishu2,
                    rangeTwoMin:rangeTwoMin2,
                    rangeTwoMax:rangeTwoMax2,
                    xianshiweikuan: true,
                    qishu:yuegongqishu2[0],
                });
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
                //因为这个是年度尾款，有的年度尾款期数的百分比没有值，所以他不能拖动，但是如果一旦他有尾款期数的百分比有值，他肯定可以被拖动，所以这个进行一个判断
                if (+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)) {
                    let rangeTwoMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0; //年度尾款比例的最小值
                    let rangeTwoMax2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0; //年度尾款比例的最大值
                    this.setData({
                        rangeTwoMin: rangeTwoMin2,
                        rangeTwoMax: rangeTwoMax2,
                        xianshiweikuan: true,
                        rangeValue2:rangeTwoMin2
                    });

                } else {
                    this.setData({
                        rangeTwoMin: 0,
                        rangeTwoMax: 0,
                        rangeValue2: 0,
                        xianshiweikuan: false
                    });
                }
                let yuegongqishu2 = qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null; //尾款期数
                this.setData({
                    yuegongqishu: yuegongqishu2,
                    qishu: yuegongqishu2[0]
                });
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx002') {
                if (this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent']) {
                    this.setData({
                        rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] : 0, //年度尾款比例的最小值
                        rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] : 0, //年度尾款比例的最大值
                        yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null
                    })
                }
                this.setData({
                    xianshiweikuan: true,
                    qishu: this.data.yuegongqishu[0]
                });
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx004') {
                this.setData({
                    yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null,
                });
                this.setData({
                    rangeTwoMin: 0,
                    rangeTwoMax: 0,
                    qishu: this.data.yuegongqishu[0],
                    xianshiweikuan: false,
                });
            } else {
                this.setData({
                    rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[0] : 0, //年度还款比例的最小值
                    rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['yearRepaymentPercent'])[1] : 0, //年度还款比例的最大值
                    yuegongqishu: qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) ? qishu(this.data.listCar[this.data.daikuancurrentIndex]['period']) : null,
                    xianshiweikuan: true
                });
            }
            this.setData({
                rangeValue2: this.data.rangeTwoMin //年度还款比例的最小值
            });
            this.nianduhuakuan2(); //年度还款的调用公式
            //初始值默认为第一个的月供期数
            this.setData({
                qishuIndex: 0,
            });
            this.setData({
                qishulixi: jiexi(this.data.listCar[this.data.daikuancurrentIndex]['period'], this.data.qishu),
            });
            if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
                if (+jiexi(this.data.listCar[this.data.daikuancurrentIndex]['pricesPeriod'], this.data.qishu)) {
                    this.setData({
                        rangeTwoMin: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[0] : 0, //年度尾款比例的最小值
                        rangeTwoMax: +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['pricesPercent'])[1] : 0, //年度尾款比例的最大值
                        xianshiweikuan: true
                    });
                    this.setData({
                        rangeValue2: this.data.rangeTwoMin,
                    });
                    this.nianduhuakuan2(); //年度还款的调用公式
                } else {
                    this.setData({
                        rangeTwoMin: 0,
                        rangeTwoMax: 0,
                        rangeValue2: 0,
                        xianshiweikuan: false
                    });
                }
            }
            this.daikuanjiner2();
            this.nianduhuakuan2(); //年度还款的调用公式
            this.fnzongshoufu2(); //总首付的计算公式
            this.lixi2();
            this.jiandishoufu2();//减低每个月多还的钱
            this.duohuanqian2();//计算每个月多还的钱
            // let rangeOneMin2 = +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] ? +minMax(this.data.listCar[this.data.daikuancurrentIndex]['prepayPercent'])[0] : 0; //不同方案有不同的首付比例值，这个是首付比例的最小值
            this.setData({
                rangeValue: rangeOneMin2,
                rangeValue2: this.data.rangeTwoMin,
                ischecked:false,
            })
        }
    },
    //焦点失去的时候获取输入银行的利率值
    fnyinhang(event) {
      let qishulixi2 = ''
        if (event.detail.value) {
          qishulixi2 = event.detail.value;
        }
        if(event.detail.value === ''){
          qishulixi2 = 0;
        }
      this.setData({
        qishulixi: qishulixi2, //得到期数利率的值
      });
        return event.detail.value; //将结果值返回
    },
    //上牌费用的算法
    shangpaifeiyong(e) {
        this.setData({
            ["daikuan.priceNumber"]: e.detail.value, //更改上牌费用的数目
        });
        //如果没有输入内容那么就默认设置为0
        if (e.detail.value === '') {
            this.setData({
                ["daikuan.priceNumber"]: 0, //更改上牌费用的数目
            });
        }
        this.qitafeiyong2(); //其他费用的算法
        this.fnzongshoufu2(); //总首付的算法
    },
    shangpaifeiyong2(event) {
        this.setData({
            ["daikuan.priceNumber"]: '', //更改上牌费用的数目
        })
    },
    //精品费用的算法
    jinping(e) {
        this.setData({
            ["daikuan.priceNumber2"]: e.detail.value, //更改精品费用的数目
        });
        if (e.detail.value === '') {
            this.setData({
                ["daikuan.priceNumber2"]: 0, //更改上牌费用的数目
            });
        }
        this.qitafeiyong2();
        this.fnzongshoufu2();
    },
    jinping2(event) {
        this.setData({
            ["daikuan.priceNumber2"]: '', //更改精品费用的数目
        });
    },
    //保险费用的算法
    baoxian(e) {
        this.setData({
            ["daikuan.priceNumber3"]: e.detail.value, //保险费用的算法
        });
        if (e.detail.value === '') {
            this.setData({
                ["daikuan.priceNumber3"]: 0, //保险费用的算法
            });
        }
        this.qitafeiyong2();
        this.fnzongshoufu2();
    },
    baoxian2(e) {
        this.setData({
            ["daikuan.priceNumber3"]: '', //保险费用的算法
        })
    },
    //手续费用的算法
    shouxufeiyong(e) {
        this.setData({
            ["daikuan.priceNumber4"]: e.detail.value, //手续费用的算法
        });
        if (e.detail.value ==='') {
            this.setData({
                ["daikuan.priceNumber4"]: 0, //手续费用的算法
            });
        }
        this.qitafeiyong2();
        this.fnzongshoufu2();
    },
    //进来的时候
    shouxufeiyong2(e) {
        this.setData({
            ["daikuan.priceNumber4"]: '', //手续费用的算法
        });
    },
    //其他费用的算法
    qitafeiyong2() {
        let sum = 0;
        for (let i in this.data.daikuan) {
            sum += +this.data.daikuan[i];
        }
        this.setData({
            qitafeiyong: sum,
        });
        return sum;
    },
    //购置税的算法
    gouzhishui2() {
        let gouzhishui3 = '';
        let gouzhishui3price = '';
        if (this.data.youhuijia) {
            gouzhishui3 = Math.floor(this.data.youhuijia / (1 + 0.16) * 0.1);
            gouzhishui3price = this.data.youhuijia;
        } else {
            gouzhishui3 = Math.floor(this.data.luochejiage / (1 + 0.16) * 0.1);
            gouzhishui3price = this.data.luochejiage;
        }
        this.setData({
            gouzhishui:gouzhishui3,
        });
        return Math.floor(gouzhishui3price / (1 + 0.16) * 0.1);
    },
    //总首付的计算(车的价格*首付比例+其他费用+购置税)
    fnzongshoufu2() {
        //如果这个方案有购置税，则方案的计算公式为(购置税+车的价格)*首付比例+其他费用，否则就是(车的价格*首付比例)+购置税+其他费用
        let fnzongshoufuPrice = '';//总首付的钱
        if (this.data.ischecked && this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
            if (this.data.youhuijia) {
                fnzongshoufuPrice = ((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01 + this.qitafeiyong2()).toFixed(0);
            } else {
                fnzongshoufuPrice = ((this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue * 0.01 + this.qitafeiyong2()).toFixed(0);
            }
        } else {
            if (this.data.youhuijia) {
                fnzongshoufuPrice = ((this.data.youhuijia * this.data.rangeValue * 0.01) + this.data.gouzhishui + this.qitafeiyong2()).toFixed(0);
            } else {
                fnzongshoufuPrice =((this.data.luochejiage * this.data.rangeValue * 0.01) + this.data.gouzhishui + this.qitafeiyong2()).toFixed(0)
            }
        }
        this.setData({
            fnzongshoufu: fnzongshoufuPrice,
        })
    },
    //贷款金额的算法
    daikuanjiner2() {
        //如果这个方案有购置税，则方案的计算公式为(购置税+车的价格)*首付比例，如果没有则就车的价格*首付比例
        if (this.data.listCar) {
            let daikuanjinerprice = '';
            if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                if (this.data.youhuijia) {
                    daikuanjinerprice = ((this.data.youhuijia + this.data.gouzhishui) - (this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0)
                } else {
                    daikuanjinerprice = ((this.data.luochejiage + this.data.gouzhishui) - (this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                }
            } else {
                if (this.data.youhuijia) {
                    daikuanjinerprice = (this.data.youhuijia - this.data.youhuijia * this.data.rangeValue * 0.01).toFixed(0);
                } else {
                    daikuanjinerprice = (this.data.luochejiage - this.data.luochejiage * this.data.rangeValue * 0.01).toFixed(0)
                }
            }
            this.setData({
                daikuanjiner:daikuanjinerprice
            });
        }
    },
    //利息的算法
    lixi2() {
        this.nianduhuakuan2();//调用年度还款
        this.yuegongfangfa(); //调用月供结果方法
        let re = /[^\d]/g;
        let qishu3 = '';
        let shoufu = '';
        let lixi3 = '';
        let weikuan = '';//尾款
        qishu3 = this.data.qishu.replace(re,'');
        let n = qishu3/12;
        this.data.youhuijia = +this.data.youhuijia;
        this.data.luochejiage = +this.data.luochejiage;
        this.data.gouzhishui = +this.data.gouzhishui;
        this.data.rangeValue = +this.data.rangeValue;
        this.data.yuegongjieguo = +this.data.yuegongjieguo;
        this.data.nianduhuakuan = +this.data.nianduhuakuan;
        // console.log('优惠价类型,裸车价类型,购置税类型,首付比例类型,月供结果类型,年度还款类型'+typeof this.data.youhuijia,typeof this.data.luochejiage,typeof this.data.gouzhishui,typeof this.data.rangeValue,typeof this.data.yuegongjieguo,typeof this.data.nianduhuakuan);
        if(this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001'){
            if(this.data.ischecked){
                //如果有购置税的情况下
                if(this.data.youhuijia){
                    shoufu = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                    weikuan = ((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan +　shoufu - (this.data.youhuijia + this.data.gouzhishui)).toFixed(0)
                }else{
                    shoufu = +((this.data.luochejiage + this.data.gouzhishui)  * this.data.rangeValue*0.01).toFixed(0);
                    weikuan = +((this.data.luochejiage + this.data.gouzhishui)  * this.data.rangeValue2*0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan +　shoufu  - (this.data.luochejiage + this.data.gouzhishui)).toFixed(0)
                }
            }else{
                //没有购置税的情况下
                if(this.data.youhuijia){
                    shoufu = +(this.data.youhuijia * this.data.rangeValue *　0.01).toFixed(0);
                    weikuan = +(this.data.youhuijia * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 +　shoufu + weikuan - this.data.youhuijia).toFixed(0)
                }else{
                    shoufu = +(this.data.luochejiage * this.data.rangeValue*0.01).toFixed(0);
                    weikuan = +(this.data.luochejiage * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 +　shoufu + weikuan　- this.data.luochejiage).toFixed(0)
                }
            }
        }
        else if(this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx004'){
            if(this.data.ischecked){
                //如果有购置税的情况下
                let allPrice = this.data.gouzhishui + this.data.luochejiage;//购置税加上裸车价格的计算
                if(this.data.youhuijia){
                    shoufu = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                    weikuan = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue2 *　0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan+ shoufu + this.data.nianduhuakuan * n - (this.data.youhuijia + this.data.gouzhishui)).toFixed(0);
                }else{
                    shoufu = +((this.data.luochejiage + this.data.gouzhishui)  * this.data.rangeValue * 0.01).toFixed(0);
                    weikuan = +((this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 +　shoufu + weikuan + this.data.nianduhuakuan * n - allPrice).toFixed(0);
                }
            }else{
                //没有购置税的情况下
                if(this.data.youhuijia){
                    shoufu = +(this.data.youhuijia * this.data.rangeValue *　0.01).toFixed(0);
                    weikuan = +(this.data.youhuijia * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan +shoufu + this.data.nianduhuakuan * n - this.data.youhuijia).toFixed(0);
                }else{
                    shoufu = +(this.data.luochejiage * this.data.rangeValue * 0.01).toFixed(0);
                    weikuan = +(this.data.luochejiage * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 +　shoufu + weikuan　+ this.data.nianduhuakuan * n - this.data.luochejiage).toFixed(0);
                }

            }
        }
        else if(this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx005'){
            if(this.data.ischecked){
                //如果有购置税的情况下
                if(this.data.youhuijia){
                    shoufu = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                    weikuan = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue2 *　0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan + shoufu - (this.data.youhuijia + this.data.gouzhishui)).toFixed(0)
                }else{
                    shoufu = +((this.data.luochejiage + this.data.gouzhishui)  * this.data.rangeValue*0.01).toFixed(0);
                    weikuan = +((this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan +shoufu  - (this.data.luochejiage + this.data.gouzhishui)).toFixed(0)
                }
            }else{
                //没有购置税的情况下
                if(this.data.youhuijia){
                    shoufu = +(this.data.youhuijia * this.data.rangeValue * 0.01).toFixed(0);
                    weikuan = +(this.data.youhuijia * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 +　shoufu + weikuan + this.data.nianduhuakuan * n - this.data.youhuijia).toFixed(0)
                }else{
                    shoufu = +(this.data.luochejiage * this.data.rangeValue*0.01).toFixed(0);
                    weikuan = +(this.data.luochejiage * this.data.rangeValue2 * 0.01).toFixed(0);
                    lixi3 = (this.data.yuegongjieguo * qishu3 + weikuan + shoufu  - this.data.luochejiage).toFixed(0)
                }
            }
        }
        else if(this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx002'){
            if(this.data.ischecked){
                if(this.data.youhuijia){
                    shoufu = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue*0.01).toFixed(0);
                    lixi3 = ((this.data.yuegongjieguo * (qishu3 - n) + shoufu + (this.data.nianduhuakuan * n) -(this.data.youhuijia + this.data.gouzhishui))).toFixed(0)
                }else{
                    shoufu = +((this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                    lixi3 = ((this.data.yuegongjieguo * (qishu3 - n) + shoufu + (this.data.nianduhuakuan *n) -(this.data.luochejiage + this.data.gouzhishui*1))).toFixed(0)
                }
            }else{
                if(this.data.youhuijia){
                    shoufu = +(this.data.youhuijia * this.data.rangeValue * 0.01) .toFixed(0);
                    lixi3 = ((this.data.yuegongjieguo * (qishu3 - n) + shoufu + (this.data.nianduhuakuan *n) -this.data.youhuijia)).toFixed(0);
                }else{
                    shoufu = +(this.data.luochejiage * this.data.rangeValue * 0.01) .toFixed(0);
                    lixi3 = ((this.data.yuegongjieguo * (qishu3 - n) + shoufu + (this.data.nianduhuakuan *n) -this.data.luochejiage)).toFixed(0);
                }
            }
        }else if(this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx003'){
            if(this.data.ischecked){
                if(this.data.youhuijia){
                    shoufu = +((this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01).toFixed(0);
                    if(qishu3 === '12'){
                        lixi3 = ((this.data.yuegongjieguo *　12　+ shoufu) -(this.data.youhuijia * 1 + this.data.gouzhishui )).toFixed(0);
                    }else if(qishu3 === '24'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + shoufu) - (this.data.youhuijia + this.data.gouzhishui )).toFixed(0);
                    }else if(qishu3 === '36'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ shoufu)-(this.data.youhuijia  + this.data.gouzhishui )).toFixed(0);
                    }else if(qishu3 === '48'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + shoufu)-(this.data.youhuijia  + this.data.gouzhishui )).toFixed(0);
                    }else if(qishu3 === '60'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + this.data.diwunianyuegong *12 + shoufu)-(this.data.youhuijia  + this.data.gouzhishui )).toFixed(0);
                    }
                }else{
                    shoufu = +((this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue *　0.01).toFixed(0);
                    if(qishu3 === '12'){
                        lixi3 = ((this.data.yuegongjieguo *　12　+ shoufu) -(this.data.luochejiage + this.data.gouzhishui)).toFixed(0);
                    }else if(qishu3 === '24'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + shoufu) - (this.data.luochejiage + this.data.gouzhishui)).toFixed(0);
                    }else if(qishu3 === '36'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ shoufu)-(this.data.luochejiage + this.data.gouzhishui)).toFixed(0);
                    }else if(qishu3 === '48'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + shoufu)-(this.data.luochejiage + this.data.gouzhishui)).toFixed(0);
                    }else if(qishu3 === '60'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + this.data.diwunianyuegong *12 + shoufu)-(this.data.luochejiage + this.data.gouzhishui)).toFixed(0);
                    }
                }
            }else{
                if(this.data.youhuijia){
                    shoufu = +(this.data.youhuijia * this.data.rangeValue * 0.01).toFixed(0);
                    if(qishu3 === '12'){
                        lixi3 = ((this.data.yuegongjieguo *　12　+ shoufu) -(this.data.youhuijia * 1 )).toFixed(0);
                    }else if(qishu3 === '24'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + shoufu) - (this.data.youhuijia * 1 )).toFixed(0);
                    }else if(qishu3 === '36'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ shoufu)-(this.data.youhuijia * 1 )).toFixed(0);
                    }else if(qishu3 === '48'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + shoufu)-(this.data.youhuijia * 1)).toFixed(0);
                    }else if(qishu3 === '60'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + this.data.diwunianyuegong *12 + shoufu)-(this.data.youhuijia * 1)).toFixed(0);
                    }
                }else{
                    shoufu = +(this.data.luochejiage * this.data.rangeValue * 0.01).toFixed(0);
                    if(qishu3 === '12'){
                        lixi3 = ((this.data.yuegongjieguo *　12　+ shoufu) -(this.data.luochejiage * 1)).toFixed(0);
                    }else if(qishu3 === '24'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + shoufu) - (this.data.luochejiage * 1)).toFixed(0);
                    }else if(qishu3 === '36'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ shoufu)-(this.data.luochejiage * 1)).toFixed(0);

                    }else if(qishu3 === '48'){
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong *12　+ this.data.disinianyuegong * 12 + shoufu)-(this.data.luochejiage * 1)).toFixed(0);
                    }else if(qishu3 === '60') {
                        lixi3 = ((this.data.yuegongjieguo * 12 + this.data.diernianyuegong * 12 + this.data.disannianyueyong * 12 + this.data.disinianyuegong * 12 + this.data.diwunianyuegong * 12 + shoufu) - (this.data.luochejiage * 1)).toFixed(0);
                    }
                }
            }
        }
        this.setData({
            lixi:lixi3,
            qishu:qishu3,
        })
    },
    //年度还款的算法
    nianduhuakuan2() {
        //如果是尾款的话，就裸车价格乘以尾款比例
        if (this.data.listCar && this.data.listCar[this.data.daikuancurrentIndex]) {
            //车的价格是优惠价还是裸车价格
            let carsPrice = '';
            let nianduhuakuan2 = '';
            if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx001') {
                if (this.data.youhuijia) {
                    nianduhuakuan2 = (this.data.youhuijia * this.data.rangeValue2 * 0.01).toFixed(0);
                } else {
                    nianduhuakuan2 = (this.data.luochejiage * this.data.rangeValue2 * 0.01).toFixed(0);
                }
            } else if (this.data.listCar[this.data.daikuancurrentIndex]['productCode'] === 'xxx005') {
                if (this.data.youhuijia) {
                    nianduhuakuan2 = (this.data.youhuijia * this.data.rangeValue2 * 0.01).toFixed(0);
                } else {
                    nianduhuakuan2 = (this.data.luochejiage * this.data.rangeValue2 * 0.01).toFixed(0);
                }
            } else {
                if (this.data.daikuanjiner) {
                    nianduhuakuan2 = (this.data.daikuanjiner * this.data.rangeValue2 * 0.01).toFixed(0);
                };
            }
            this.setData({
                nianduhuakuan : nianduhuakuan2,
            })
        }

    },
    //实现月供的计算方法
    //月供方法
    yuegongfangfa() {
        if (this.data.listCar) {
            var index = this.data.listCar['productCode'] || this.data.listCar[this.data.daikuancurrentIndex]['productCode'];
            let result = '';
            //如果是银行方案的话，则走银行方案的，如果没有则就是宝马金融方案的计算公式
            if (this.data.yinhang) {
                var re = /[^\d]/g;
                //更改期数内容
                this.setData({
                    qishu: this.data.qishu.replace(re, ''),
                });
                //更改期数利息率的值
                this.setData({
                    qishulixi:this.data.qishulixi,
                });
                var i = (this.data.qishulixi / 100 / 12);
                var i1 = accAdd(1, i);
                var math = (Math.pow(1 + i, this.data.qishu));
                var m = ((this.data.luochejiage * (this.data.rangeValue2 * 0.01)) / math);
                let p = 0;
                if (this.data.youhuijia) {
                    var baojia = this.data.youhuijia;
                    var shoufu = this.data.youhuijia * this.data.rangeValue * 0.01;
                    p = (baojia - shoufu - m);
                } else {
                    var baojia = this.data.luochejiage;
                    var shoufu = this.data.luochejiage * this.data.rangeValue * 0.01;
                    p = (baojia - shoufu - m);
                }
                let p2 = numMulti(i, (Math.pow(i1, this.data.qishu)));
                let p3 = Math.pow(i1, this.data.qishu) - 1;
                let d = accDivCoupon(p2, p3);
                result = (p * d).toFixed(0);
                //更改月供结果：
                this.setData({
                    yuegongjieguo: result
                });
                return result;
            } else {
                //标准悦贷
                if (index === 'xxx001') {
                    var re = /[^\d]/g;
                    this.data.qishu = this.data.qishu.replace(re, '');
                    //更新期数值
                    this.setData({
                        qishu: this.data.qishu.replace(re, ''),
                    });
                    var i = (this.data.qishulixi) / 100 / 12;
                    var i1 = accAdd(1, i);
                    var math = (Math.pow(1 + i, this.data.qishu));
                    var m = 0;
                    let p = 0;
                    var baojia = 0;
                    var shoufu = 0;
                    if (this.data.youhuijia) {
                        //如果选择有购置税
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.youhuijia + this.data.gouzhishui);
                            shoufu = (this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.youhuijia;
                            shoufu = this.data.youhuijia * this.data.rangeValue * 0.01;
                        }
                        m = (baojia * (this.data.rangeValue2 * 0.01)) / math;
                        p = (baojia - shoufu - m);
                    } else {
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (+this.data.luochejiage + +this.data.gouzhishui);
                            shoufu = (+this.data.luochejiage + +this.data.gouzhishui) * this.data.rangeValue * 0.01;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.luochejiage;
                            shoufu = this.data.luochejiage * this.data.rangeValue * 0.01;
                        }
                        m = (baojia * (this.data.rangeValue2 * 0.01)) / math;
                        p = (baojia - shoufu - m);
                    }
                    result = (p * (Math.pow(i1, this.data.qishu) * i / (Math.pow(i1, this.data.qishu) - 1))).toFixed(0);
                    this.setData({
                        yuegongjieguo: result, //更新状态值
                    });
                    return result;
                } else if (index === 'xxx002') {
                    //标准悠贷
                    var re = /[^\d]/g; //正则的一种匹配方式
                    //更改期数
                    this.setData({
                        qishu: this.data.qishu.replace(re, ''),
                    });
                    var i = this.data.qishulixi / (100 * 12); //月利率
                    var i1 = accAdd(1, i); //i+1的值
                    var x = 1 / i1;
                    // var niangong = this.daikuanjiner2() * this.data.rangeValue2 * 0.01; //年供
                    var niangong = this.data.daikuanjiner * this.data.rangeValue2 * 0.01; //年供
                    var a = 1 - x; //计算1-x的值
                    var shoufu = 0;
                    var baojia = 0;
                    if (this.data.youhuijia) {
                        //如果含购置税的情况下
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.youhuijia + this.data.gouzhishui);
                            shoufu = (this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                            ;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.youhuijia;
                            shoufu = this.data.youhuijia * this.data.rangeValue * 0.01;
                        }
                    } else {
                        //如果含有购置税的情况下
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.luochejiage + this.data.gouzhishui);

                            shoufu = (this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.luochejiage;
                            shoufu = this.data.luochejiage * this.data.rangeValue * 0.01;
                        }
                    }
                    if (Number(this.data.qishu) === 24) {
                        var c = baojia - shoufu - niangong * Math.pow(x, 12) * (1 + Math.pow(x, 12));
                        //更新月供结果值
                        this.setData({
                            yuegongjieguo: (a * c / (1 - Math.pow(x, 11)) / x / (1 + Math.pow(x, 12))).toFixed(0)
                        });
                        //返回结果值
                        return result = (a * c / (1 - Math.pow(x, 11)) / x / (1 + Math.pow(x, 12))).toFixed(0);
                    } else if (Number(this.data.qishu) === 36) {
                        var c = baojia - shoufu - (niangong * Math.pow(x, 12) * (1 + Math.pow(x, 12) + Math.pow(x, 24)));
                        //更新月供结果值
                        this.setData({
                            yuegongjieguo: (a * c / (1 - Math.pow(x, 11)) / x / (1 + Math.pow(x, 12) + Math.pow(x, 24))).toFixed(0)
                        });
                        //返回结果值
                        return result = (a * c / (1 - Math.pow(x, 11)) / x / (1 + Math.pow(x, 12) + Math.pow(x, 24))).toFixed(0);
                    } else if (Number(this.data.qishu) === 48) {
                        var c = baojia - shoufu - niangong * Math.pow(x, 12) * (1 + Math.pow(x, 12) + Math.pow(x, 24) + Math.pow(x, 36));
                        //更新月供结果值
                        this.setData({
                            yuegongjieguo: (a * c / (1 - Math.pow(x, 11)) / x / (1 + Math.pow(x, 12) + Math.pow(x, 24) + Math.pow(x, 36))).toFixed(0)
                        });
                        //返回结果值
                        return result = (a * c / (1 - Math.pow(x, 11)) / x / (1 + Math.pow(x, 12) + Math.pow(x, 24) + Math.pow(x, 36))).toFixed(0);
                    }
                } else if (index === 'xxx003') {
                    //标准智享的计算方法
                    var re = /[^\d]/g; //正则的一种匹配方式
                    this.setData({
                        qishu: this.data.qishu.replace(re, ''), //期数
                    });
                    var i = (this.data.qishulixi / 100 / 12); //月利率
                    var i1 = accAdd(1, i); //i+1的值
                    var x = 1 / i1; //x:1/(i+1)的值
                    var y = 1 - this.data.rangeValue2 * 0.01; //1-递减比例
                    var a = (1 - x);
                    if (Number(this.data.qishu) === 60) {
                        //期数为60期的月供数
                        var c = a / x / (1 - Math.pow(x, 12)); //(1-x)/x(1-x^12)
                        var d = (1 + y * Math.pow(x, 12) + Math.pow(y, 2) * Math.pow(x, 24) + Math.pow(y, 3) * Math.pow(x, 36) + Math.pow(y, 4) * Math.pow(x, 48));
                        //出来结果
                        result = (this.data.daikuanjiner * c / d).toFixed(0);
                        //更新状态结果值
                        let yuegongjieguo2 = (this.data.daikuanjiner * c / d).toFixed(0);
                        let diernianyuegong2 = (yuegongjieguo2 * (1 - this.data.rangeValue2)).toFixed(2); //第二年的月供结果
                        let disannianyueyong2 = (diernianyuegong2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0); //第三年的月供结果
                        let disinianyuegong2 = (disannianyueyong2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0);//第四年的月供结果
                        let diwunianyuegong2 = (disinianyuegong2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0); //第五年的月供结果
                        this.setData({
                            yuegongjieguo: yuegongjieguo2,
                            diernianyuegong2:diernianyuegong2,
                            disannianyueyong2:disannianyueyong2,
                            disinianyuegong:disinianyuegong2,
                            diwunianyuegong:diwunianyuegong2
                        });
                        return result;
                    } else if (Number(this.data.qishu) === 48) {
                        //期数为48期的月供数
                        var c = a / x / (1 - Math.pow(x, 12));
                        var d = (1 + y * Math.pow(x, 12) + Math.pow(y, 2) * Math.pow(x, 24) + Math.pow(y, 3) * Math.pow(x, 36));
                        result = (this.data.daikuanjiner * c / d).toFixed(0);
                        let yuegongjieguo2 = result;
                        let diernianyuegong2 = (result * (1 - this.data.rangeValue2 * 0.01)).toFixed(0);
                        let disannianyueyong2 = (diernianyuegong2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0); //第三年月供结果
                        let disinianyuegong2 = (disannianyueyong2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0); //第四年月供结果
                        let diwunianyuegong2 = null;
                        //更新状态结果值
                        this.setData({
                            yuegongjieguo:yuegongjieguo2,
                            diernianyuegong:diernianyuegong2,
                            disannianyueyong:disannianyueyong2,
                            disinianyuegong:disinianyuegong2,
                            diwunianyuegong:diwunianyuegong2
                        });
                        return result;
                    } else if (Number(this.data.qishu) === 36) {
                        //期数为36期的月供数目
                        var c = a / x / (1 - Math.pow(x, 12));
                        var d = (1 + y * Math.pow(x, 12) + Math.pow(y, 2) * Math.pow(x, 24));
                        result = (this.data.daikuanjiner * c / d).toFixed(0);
                        //更新状态结果值
                        let yuegongjieguo2 = result;
                        let diernianyuegong2 = (yuegongjieguo2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0);
                        let disannianyueyong2 = (diernianyuegong2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0);
                        let disinianyuegong2 = null;
                        let diwunianyuegong2 = null;
                        this.setData({
                            yuegongjieguo:yuegongjieguo2,
                            diernianyuegong:diernianyuegong2,
                            disannianyueyong:disannianyueyong2,
                            disinianyuegong:disinianyuegong2,
                            diwunianyuegong:diwunianyuegong2
                        });
                        return result;
                    } else {
                        //期数为24期的月供数
                        var c = a / x / (1 - Math.pow(x, 12));
                        var d = (1 + y * Math.pow(x, 12));
                        result = (this.data.daikuanjiner * c / d).toFixed(0);
                        let yuegongjieguo2 = result;
                        let diernianyuegong2 = (yuegongjieguo2 * (1 - this.data.rangeValue2 * 0.01)).toFixed(0);
                        this.setData({
                            yuegongjieguo:yuegongjieguo2,
                            diernianyuegong:diernianyuegong2,
                            disannianyueyong: null,
                            disinianyuegong: null, //第四年的结果变成null
                            diwunianyuegong: null, //第五年的月供结果变为null
                        });
                        return result;
                    }
                } else if (index === 'xxx004') {
                    //标准贷款的计算方法
                    var re = /[^\d]/g;
                    this.setData({
                        qishu: this.data.qishu.replace(re, ''),
                    });
                    var i = (this.data.qishulixi / 100 / 12);
                    var i1 = accAdd(1, i); //i+1的值
                    var baojia = 0;
                    var shoufu = 0;
                    if (this.data.youhuijia) {
                        //如果含购置税的情况下
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.youhuijia + this.data.gouzhishui);
                            shoufu = (this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.youhuijia;
                            shoufu = this.data.youhuijia * this.data.rangeValue * 0.01;
                        }
                    } else {
                        //如果含有购置税的情况下
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.luochejiage + this.data.gouzhishui);

                            shoufu = (this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.luochejiage;
                            shoufu = this.data.luochejiage * this.data.rangeValue * 0.01;
                        }
                    }
                    var a = baojia - shoufu;
                    var c = Math.pow(i1, this.data.qishu) * i;
                    var d = Math.pow(i1, this.data.qishu) - 1;
                    this.setData({
                        yuegongjieguo: result = (a * c / d).toFixed(0)
                    });
                    return result = (a * c / d).toFixed(0);
                } else if (index === 'xxx005') {
                    //标准弹性贷款方法
                    var re = /[^\d]/g;
                    this.setData({
                        qishu: this.data.qishu.replace(re, ''),
                    });
                    var i = (this.data.qishulixi / 100 / 12);
                    var i1 = accAdd(1, i);
                    var math = (Math.pow(1 + i, this.data.qishu));
                    var m = 0;
                    var baojia = 0;
                    var shoufu = 0;
                    if (this.data.youhuijia) {
                        //如果含购置税的情况下
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.youhuijia + this.data.gouzhishui);
                            shoufu = (this.data.youhuijia + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.youhuijia;
                            shoufu = this.data.youhuijia * this.data.rangeValue * 0.01;
                        }

                        m = (baojia * (this.data.rangeValue2 * 0.01)) / math
                    } else {
                        //如果含有购置税的情况下
                        if (this.data.ischecked && this.data.listCar[this.data.daikuancurrentIndex] && this.data.listCar[this.data.daikuancurrentIndex]['isPurchaseTax'] === 'y') {
                            baojia = (this.data.luochejiage + this.data.gouzhishui);
                            shoufu = (this.data.luochejiage + this.data.gouzhishui) * this.data.rangeValue * 0.01;
                            m = (baojia * (this.data.rangeValue2 * 0.01)) / math;
                        } else {
                            //没有购置税的情况下
                            baojia = this.data.luochejiage;
                            shoufu = this.data.luochejiage * this.data.rangeValue * 0.01;
                            m = (baojia * (this.data.rangeValue2 * 0.01)) / math;
                        }
                    }
                    this.setData({
                        yuegongjieguo: ((baojia - m - shoufu) * Math.pow(i1, this.data.qishu) * i / (Math.pow(i1, this.data.qishu) - 1)).toFixed(0),
                    });
                    return result = ((baojia - m - shoufu) * Math.pow(i1, this.data.qishu) * i / (Math.pow(i1, this.data.qishu) - 1)).toFixed(0);
                }
            }
        }
    },
    //计算每个月减低首付的钱
    jiandishoufu2() {
        this.fnzongshoufu2();
        let z = 0; //可贷的金额
        let fn = this.data.fnzongshoufu; //总首付的价格
        let y = 0;
        let jiandishoufuPrice = '';
        if (this.data.youhuijia) {
            y = this.data.youhuijia;
        } else {
            y = this.data.luochejiage;
        }
        z = (fn - 0.1 * y).toFixed(0);
        //对结果进行判断的展示
        if (150000 <= 0.3 * y) {
            if (z >= 150000) {
                jiandishoufuPrice = 150000;
            } else {
                jiandishoufuPrice = z;
            }
        } else {
            if (z <= 0.3 * y) {
                jiandishoufuPrice = z;
            } else {
                jiandishoufuPrice =  0.3 * y;
            }
        }
        this.setData({
            jiandishoufu: jiandishoufuPrice
        });
    },
    //计算每个月多还的钱
    duohuanqian2() {
        var n = 36; //还的期数
        var i = 0.0174; //还的利率
        var p = '';
        if(this.data.jiandishoufu){
            p = this.data.jiandishoufu;
        }
        this.setData({
            duohuanqian: (p * (i * Math.pow((1 + i), 36) / (Math.pow(i + 1, 36) - 1))).toFixed(0),
        });
        this.jiandishoufu2();
    },
});