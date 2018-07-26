var Data = require('Data');
cc.Class({
  extends: cc.Component,

  properties: {},
  dataList: null,
  // use this for initialization
  onLoad: function() {
    cc.director.getCollisionManager().enabled = true;
    this.touchingNumber = 0;
    this.CollectNumber = 0;
    this.dataList = JSON.parse(cc.sys.localStorage.getItem('FarmData')); //缓存机制
  },

  onCollisionEnter: function(other) {
    let self = this;
    other.node.color = cc.Color.CYAN;

    this.touchingNumber++;
    this.dataList = JSON.parse(cc.sys.localStorage.getItem('FarmData')); //缓存机制

    this.FarmJs = cc.find('Canvas');
    let id = Number(other.node.name.slice(4));
    let propertyId = Config.propertyId; //种子ID
    let type = Config.fertilizerId; //肥料ID
    clearTimeout(this.timers); //清理定时器
    clearTimeout(this.timers2); //清理定时器
    if (self.dataList.toolType == 1) {
      self.crops(id, propertyId);
    } else if (self.dataList.toolType == 2) {
      self.water(id);
    } else if (self.dataList.toolType == 3) {
      self.weed(id);
    } else if (self.dataList.toolType == 4) {
      self.disinsection(id);
    } else if (self.dataList.toolType == 5) {
      self.cropsSertilize(id, type);
    } else if (self.dataList.toolType == 6) {
      self.collectCrops(id);
    }
  },
  //播种
  crops(id, propertyId) {
    let self = this;
    let landId = this.dataList.List[id].ID;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    console.log(this.dataList.List[id]);
    if (CropsID == 0 && !IsLock) {
      self.timers2 = setTimeout(function() {
        Msg.show('播种成功，经验+5');
      }, 500);
      this.dataList.List[id].CropsStatus = 1;
      cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.dataList));
      Data.func.addCrops(landId, propertyId).then(data => {
        self.timers = setTimeout(function() {
          if (data.Code == 1) {
            Data.func.getFarmModalData().then(data2 => {
              // FarmJsFarmJs.fn.setLocalStorageData.call(FarmJs, data2);
              self.FarmJs.emit('updataPlant', {
                data: self.dataList.List
              });
            });
          } else {
          }
        }, 1500);
      });
    }
  },
  //浇水
  water(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let IsDisinsection = this.dataList.List[id].IsDisinsection;
    let IsWater = this.dataList.List[id].IsDry;
    let IsWeeds = this.dataList.List[id].IsWeeds;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock && IsWater) {
      if (!IsDisinsection && IsWater) {
        self.timers2 = setTimeout(function() {
          Msg.show('浇水成功，经验+5');
        }, 500);
        this.dataList.List[id].IsDry = true;
        cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.dataList));
        Data.func.CropsWatering(CropsID).then(data => {
          self.timers = setTimeout(function() {
            if (data.Code === 1) {
              Data.func.getFarmModalData().then(data2 => {
                // FarmJs.fn.setLocalStorageData.call(FarmJs, data2);

                self.FarmJs.emit('updataPlant', {
                  data: self.dataList.List
                });
              });
            } else {
            }
          }, 1500);
        });
      } else {
        self.timers2 = setTimeout(function() {
          Msg.show('我现在不需要浇水哦~');
        }, 500);
      }
    }
  },
  //除草
  weed(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let IsDisinsection = this.dataList.List[id].IsDisinsection;
    let IsWater = this.dataList.List[id].IsDry;
    let IsWeeds = this.dataList.List[id].IsWeeds;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock && IsWeeds) {
      if (!IsDisinsection && !IsWater && IsWeeds) {
        self.timers2 = setTimeout(function() {
          Msg.show('除草成功，经验+5');
        }, 500);
        this.dataList.List[id].IsWeeds = true;
        cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.dataList));
        Data.func.CropsWeeding(CropsID).then(data => {
          self.timers = setTimeout(function() {
            if (data.Code === 1) {
              Data.func.getFarmModalData().then(data2 => {
                // Msg.show(data.Message);
                self.FarmJs.emit('updataPlant', {
                  data: self.dataList.List
                });
              });
            } else {
            }
          }, 1500);
        });
      } else {
        self.timers2 = setTimeout(function() {
          Msg.show('我现在不需要除草哦~');
        }, 500);
      }
    }
  },
  //除虫
  disinsection(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let IsDisinsection = this.dataList.List[id].IsDisinsection;
    let IsWater = this.dataList.List[id].IsDry;
    let IsWeeds = this.dataList.List[id].IsWeeds;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock && IsDisinsection) {
      if (IsDisinsection) {
        self.timers2 = setTimeout(function() {
          Msg.show('除虫成功，经验+5');
        }, 500);
        this.dataList.List[id].IsDisinsection = true;
        cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.dataList));
        Data.func.CropsDisinsection(CropsID).then(data => {
          self.timers = setTimeout(function() {
            if (data.Code === 1) {
              Data.func.getFarmModalData().then(data2 => {
                // Msg.show(data.Message);
                self.FarmJs.emit('updataPlant', {
                  data: self.dataList.List
                });
              });
            } else {
            }
          }, 1500);
        });
      } else {
        self.timers2 = setTimeout(function() {
          Msg.show('我现在不需要除虫哦~');
        }, 500);
      }
    }
  },
  //施肥
  cropsSertilize(id, type) {
    let self = this;

    let IsLock = this.dataList.List[id].IsLock;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus !== 0 && !IsLock) {
      Data.func.getFarmModalData().then(data2 => {
        // FarmJsFarmJs.fn.setLocalStorageData.call(FarmJs, data2);
        let CropsID = data2.Model[id].CropsID;
        if (data2.Code === 1) {
          Data.func.CropsSertilize(CropsID, type).then(data => {
            self.timers = setTimeout(function() {
              if (data.Code === 1) {
                Msg.show(data.Message);
                self.FarmJs.emit('updataPlant', {
                  data: data2.Model
                });
              } else {
                Msg.show(data.Message);
              }
            }, 500);
          });
        } else {
          Msg.show(data2.Message);
        }
      });
    }
  },
  //收取农作物
  collectCrops(id) {
    let self = this;
    let CropsID = this.dataList.List[id].CropsID;
    let IsLock = this.dataList.List[id].IsLock;
    let CropsStatus = this.dataList.List[id].CropsStatus;
    if (CropsStatus == 4 && !IsLock) {
      Data.func.CollectCrops(CropsID).then(data => {
        if (data.Code === 1) {
          self.CollectNumber += Number(data.Model);
          self.timers2 = setTimeout(function() {
            Msg.show('收取 × ' + self.CollectNumber);
          }, 500);
          setTimeout(function() {
            self.dataList.List[id].CropsStatus = 0;
            self.dataList.List[id].CropsID = 0;
            cc.sys.localStorage.setItem('FarmData', JSON.stringify(this.dataList));
          }, 1000);
          self.timers = setTimeout(function() {
            self.CollectNumber = 0;
            Data.func.getFarmModalData().then(data2 => {
              self.FarmJs.emit('updataPlant', {
                data: self.dataList.List
              });
            });
          }, 1000);
        } else {
        }
      });
    } else {
      self.timers2 = setTimeout(function() {
        Msg.show('我现在还不能收取哦~');
      }, 500);
    }
  },
  onCollisionStay: function(other) {},

  onCollisionExit: function(other) {
    //碰撞后的状态显示
    this.touchingNumber--;
    if (this.touchingNumber === 0) {
      // other.node.color = cc.Color.WHITE;
    }
    //找到当前预置资源
    let id = Number(other.node.name.slice(4));
    let ParentNodes = other.node.parent.parent;
    let PlantNodes = cc.find('Prefab' + id, ParentNodes);
    let PlantNodesTip = cc.find('Prefab' + id + '/New Node/reap', ParentNodes);
    //是否存在预置资源

    if (PlantNodes) {
      //是否成熟并且选择是镰刀收割工具
      if (
        this.dataList.List[id].CropsStatus == 4 &&
        this.dataList.toolType == 6 &&
        !this.dataList.List[id].IsDisinsection &&
        !this.dataList.List[id].IsDry &&
        !this.dataList.List[id].IsWeeds
      ) {
        var action = cc.sequence(cc.moveBy(0.3, 0, 20), cc.fadeOut(0.5), cc.callFunc(PlantNodes.removeFromParent));
        PlantNodes.runAction(action);
      }
      //浇水
      if (this.dataList.List[id].IsDry && this.dataList.toolType == 2) {
        var action = cc.fadeOut(0.5);
        PlantNodesTip.runAction(action);
      }
      //除草
      if (this.dataList.List[id].IsWeeds && this.dataList.toolType == 3) {
        var action = cc.fadeOut(0.5);
        PlantNodesTip.runAction(action);
      }
      //除虫
      if (this.dataList.List[id].IsDisinsection && this.dataList.toolType == 4) {
        var action = cc.fadeOut(0.5);
        PlantNodesTip.runAction(action);
      }
    }
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});
