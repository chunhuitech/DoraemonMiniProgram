// pages/modules/mine.js
import request from '../../../utils/net/request';
var app = getApp();
var bookData = {};
var readBase = {};
Page({
  data: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowWidth:0,
    windowHeight:0,
    pageStatus:'next',//当前是点击的下一页还是上一页
    page: 2,
    dataPageIndex:1,
    indexDiv: 0,
    ed: 0,
    animationData: {},
    animationToast: {},
    animationPage: {},
    animationDouPage: {},
    singleClass: '',
    doubleClass: '',
    opacity: 0,
    // cover:'http://static.zcool.cn/git_z/build/images/success.png',
    coverSingle: 'http://www.firemail.wang:8088/chunhui_resource/primaryschool/grade3/english/volume2/4.jpg',
    coverDouble: 'http://www.firemail.wang:8088/chunhui_resource/primaryschool/grade3/english/volume2/4.jpg',
    statements: [],
    stateImgBase: {
      w: 540,
      h: 810
    },
    client: {
      w: 0,
      h: 0
    },
    toastW: 0,
    toastH: 0,
    ToastText: "",
    continu: false,
    continuFuc: null,
    singleInx: 10,
    douInx: 11,
    pageToIdMap:{}
  },
  onLoad: function () {
    this.getWindowInfo().then(res=>{
      this.init();
    })
  },
  init(){
    let voice = app.globalData.audio;
    voice.onPlay(() => {
      console.log('开始播放')
    })
    voice.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    voice.onTimeUpdate(() => {
      if (!this.data.continu) {
        if (voice.currentTime > this.data.ed) {
          voice.pause();
        }
      } else {
        if (voice.currentTime > this.data.ed) {
          voice.pause();
          let item = this.data.statements[this.data.indexDiv + 1]
          if (!item) {
            this.nextPageFuc();
            this.setData({
              indexDiv: 0
            })
            this.commonReadState(this.data.statements[this.data.indexDiv])
          } else {
            this.commonReadState(item);
            this.setData({
              indexDiv: this.data.indexDiv + 1
            })
          }
        }
      }
    })
    this.getAllBookVioce()
  },
  //获取整本书的音频数据
  getAllBookVioce(){
    return request.get({ url: '/api/admin/weixin/resource/get', data: { id: 1232 } }).then((res2) => {
      if (res2.data.code == 0) {
        res2.data.data.dataList.map(v => {
          bookData[v.id] = v;
        });
        this.getPageData()
      } else {
      }
    })
  },
  //获取书每页详情的list（分页返回）
  getPageData:function(boole){
    let dataPageIndex = this.data.dataPageIndex <= 0 ? 1 : this.data.dataPageIndex;
    return request.get({ url: '/api/admin/weixin/page/get', data: { classId: 1232, page: dataPageIndex, limit: 100 } }).then((res2) => {
      let pageToIdMap=this.data.pageToIdMap;
      let {code,data}=res2.data;
      if(code===0){
        data.dataList.forEach(element => {
          if(!pageToIdMap[element.page]){
            pageToIdMap[element.page]=element.id;
          }
        })
        !boole &&this.updateData()
      }
    })
  },
  onShow: function () {

  },
  //获取当前页面窗口宽高
  getWindowInfo(){
    let self=this;
    return new Promise((resolve,reject)=>{
      wx.getSystemInfo({
        success: res => {
          self.data.windowWidth = res.windowWidth;
          self.data.windowHeight = res.windowHeight;
          resolve()
        }
      })
    })
  },
  //处理每页详情的信息
  updateData: function () {
    let page = this.data.page;
    let pageId= this.data.pageToIdMap[page];
    if (!pageId){

      this.data.dataPageIndex = this.data.pageStatus == 'next' ? this.data.dataPageIndex + 1 : this.data.dataPageIndex - 1;
      return this.getPageData(true).then(res=>{
        pageId = this.data.pageToIdMap[page]
        if (!pageId){
          this.palyOver();
        }else{
          return this.getPageInfoByPage(pageId)
        }
      })
    }else{
      return this.getPageInfoByPage(pageId)
    }
  },
  //根据pageid获取每页信息
  getPageInfoByPage(pageId){
    let page=this.data.page;
    return request.get({ url: '/api/admin/weixin/readpoint/get', data: { pageId: pageId } }).then((res2) => {
      let { code, data } = res2.data;
      if (code === 0) {
        data.dataList.forEach(v => {
          if (readBase[page]) {
            readBase[page].data.push(v);
          } else {
            readBase[page] = {};
            readBase[page].url = bookData[v.resourceId].relativePath;
            readBase[page].imageUrl = v.imageUrl;
            readBase[page].data = [];
            readBase[page].data.push(v);
          }
        })
        this.pointPage();
      }
    })
  },
  //更新视图
  pointPage(){
    let arr = [];
    readBase[this.data.page].data.map(v => {
      arr.push(this.calculationPx(v))
    })
    this.setData({
      statements: arr,
    });
  },
  //播放完毕
  palyOver(){
    let animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    });
    animation.translate(0, -50).step();
    this.setData({
      animationData: animation.export()
    })
    wx.showToast({
      title: '播放完毕',
      icon: 'success',
      duration: 2000
    })
    return;
  },
  handleReadState: function (e) {
    let dom = e.currentTarget;
    this.commonReadState(dom.dataset.item);
  },
  commonReadState: function (item) {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    let animationToast = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    });

    // this.animation = animation;
    //   animation.scale(2,2).rotate(45).step()
    // animation.width(dom.dataset.item.w*1).height(dom.dataset.item.h*1).translate(dom.dataset.item.l*1,dom.dataset.item.t*1+50).step();
    let left = item.l * 1;
    if (this.data.page % 2 > 0) {
      left = app.globalData.client.w - item.l * 1 - item.w * 1;
    }
    animationToast.opacity(0).step();
    animation.width(item.w * 1).height(item.h * 1).translate(left, item.t * 1 + 50).opacity(1).step();
    this.setData({
      animationData: animation.export(),
      animationToast: animationToast.export(),
      toastW: item.w * 1,
      toastH: item.h * 1,
      ToastText: item.text
    });
    this.playMuisc(item);
    setTimeout(() => {
      animationToast.opacity(1).step();
      this.setData({
        animationToast: animationToast.export()
      })
    }, 400)
  },
  calculationPx(obj) {
    return {
      l: (obj.leftPosition * this.data.windowWidth / this.data.stateImgBase.w).toFixed(2),
      t: (obj.topPosition * this.data.windowHeight / this.data.stateImgBase.h).toFixed(2),
      w: (obj.width * this.data.windowWidth / this.data.stateImgBase.w).toFixed(2),
      h: (obj.height * this.data.windowHeight / this.data.stateImgBase.h).toFixed(2),
      bg: obj.beginPoint,
      ed: obj.endPoint,
      text: obj.text
    }
  },
  playMuisc: function (obj) {
    let voice = app.globalData.audio;
    let index = this.data.count;
    let bg = obj.bg;
    let ed = obj.ed;
    let text = obj.text;
    let url = readBase[this.data.page].url;
    voice.autoplay = false;
    voice.src = url;
    voice.startTime = bg;
    this.setData({
      ed: ed
    })
    // this.updateText(text);
    // if(voice.paused){
    //   voice.play();
    // }else{
    //   voice.pause();
    // }
    voice.play();
  },
  nextPageFuc: function () {
    // this.initPageAnim();
    this.initPageImageUrl();
    let page = this.data.page;
    let doubleClass = '';
    let singleClass = '';
    let singleInx = 10;
    let douInx = 11;
    if (!(page % 2)) {
      doubleClass = 'pageAnimateCss';
    } else {
      singleInx = 11;
      douInx = 10;
      singleClass = 'pageAnimateCss';
    }
    this.data.page=this.data.page+1;
    this.updateData()
    this.setData({
      page: this.data.page,
      doubleClass: doubleClass,
      singleClass: singleClass,
      singleInx: singleInx,
      douInx: douInx
    });
    let animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    });
    animation.translate(0, -50).step();
    this.setData({
      animationData: animation.export()
    })
  },
  continuPlay: function () {
    let index = 0;
    let that = this;
    this.pointPage();
    this.commonReadState(this.data.statements[index])
    this.setData({
      continu: true,
      // continuFuc:voice=> {
      //     that.commonReadState(that.data.statements[index+1]);
      // }
    })

  },
  initPageImageUrl: function () {
    let page = this.data.page;
    let single = this.data.coverSingle;
    let double = this.data.coverDouble;
    let base = 'http://www.firemail.wang:8088/chunhui_resource/primaryschool/grade3/english/volume2/';
    if (page % 2) {
      single = base + (4 + (page * 1 - 1) / 2) + '.jpg';
    } else {
      double = base + (4 + page * 1 / 2) + '.jpg';
    }

    setTimeout(() => {
      this.setData({
        coverSingle: single,
        coverDouble: double
      })
    }, 600);
  },
  initPageAnim: function () {
    let page = this.data.page;
    let singleInx = 10;
    let douInx = 11;
    let singleRot = 0;
    let douRot = 90;
    let a = 0;

    if (!(page % 2)) {
      singleInx = 10;
      douInx = 11;
      singleRot = 0;
      douRot = 90;
      a = 0;
    } else {
      a = 1;
      singleInx = 11;
      douInx = 10;
      singleRot = 90;
      douRot = 0;
    }
    let animationS = wx.createAnimation({
      duration: singleRot * 10,
      timingFunction: 'ease',
      transformOrigin: '0 50% 0'
    });
    let animationD = wx.createAnimation({
      duration: douRot * 10,
      timingFunction: 'ease',
      transformOrigin: '0 50% 0'
    });
    animationS.rotateY(singleRot).step();
    animationD.rotateY(douRot).step();
    this.setData({
      singleInx: singleInx,
      douInx: douInx
    })

    if (!a) {
      this.setData({
        animationPage: animationS.export()
      })
      setTimeout(() => {
        this.setData({
          animationDouPage: animationD.export()
        })
      }, singleRot * 10 + 100)
    } else {
      this.setData({
        animationDouPage: animationD.export()
      })
      setTimeout(() => {
        this.setData({
          animationPage: animationS.export()
        })
      }, douRot * 10 + 100)
    }
  }
})