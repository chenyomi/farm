var Data = require("Data");
var Func = Data.func;
var ToolJs = require("Tool");
var Tool = ToolJs.Tool;
cc.Class({
  extends: cc.Component,

  properties: {
    itemTop_Perfab: {
      default: null,
      type: cc.Prefab
    },
    item_Perfab: {
      default: null,
      type: cc.Prefab
    },
    iconBtn01: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn02: {
      default: null,
      type: cc.SpriteFrame
    },
    iconBtn03: {
      default: null,
      type: cc.SpriteFrame
    }
  },
  page: null,
  rank: null,
  ctor() {
    this.page = 1;
    this.Rank = 1;
  },
  //绑定节点
  bindNode() {
    this.cancelButton = cc.find("btn-close", this.node);
    this.eggNumButton = cc.find("bg-rank/btn-eggNum", this.node);
    this.cheapButton = cc.find("bg-rank/btn-cheap", this.node);
    this.contentNode = cc.find("bg-rank/scrollView/view/content", this.node);
    this.scrollViewNode = cc.find("bg-rank/scrollView", this.node);
  },
  //绑定事件
  bindEvent() {
    //关闭按钮
    this.cancelButton.on("click", () => {
      Tool.closeModal(this.node);
    });
    //产蛋榜
    this.eggNumButton.on("click", () => {
      this.contentNode.removeAllChildren();
      this.eggNumButton.color = cc.color("#FFEF4D");
      this.cheapButton.color = cc.color("#FFDE00");
      this.GetEggRankList();
    });

    //下拉刷新
    this.scrollViewNode.on("bounce-bottom", () => {
      this.GetEggRankList();
    });
  },

  //产蛋赋值
  assignData(data) {
    let advisor = data.path;
    let name = data.RealName;

    let eggCount = data.Eggcount;
    let itemNode;
    if (this.rank <= 3) {
      //Top3
      itemNode = cc.instantiate(this.itemTop_Perfab);
      let rankNode = cc.find("item-content/icon-no1", itemNode);
      switch (this.rank) {
        case 1:
          rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn01;
          break;
        case 2:
          rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn02;
          break;
        case 3:
          rankNode.getComponent(cc.Sprite).spriteFrame = this.iconBtn03;
          break;
      }
    } else {
      //大于3 的排名
      itemNode = cc.instantiate(this.item_Perfab);
      let rankLabel = cc.find("item-content/rank/text", itemNode).getComponent(cc.Label);
      rankLabel.string = this.rank;
    }

    let advisorSprite = cc.find("item-content/advisor-box/adviosr-mask/advisor", itemNode).getComponent(cc.Sprite);
    let nameLabel = cc.find("item-content/advisor-box/name", itemNode).getComponent(cc.Label);
    let countLabel = cc.find("item-content/box/textbox/label", itemNode).getComponent(cc.Label);

    nameLabel.string = name;
    countLabel.string = eggCount;

    this.contentNode.addChild(itemNode);
  },

  GetEggRankList() {
    Func.GetEggRankings(this.page).then(data => {
      if (data.Code === 1) {
        for (let i = 0; i < data.List.length; i++) {
          let element = data.List[i];
          ++this.rank;
          this.assignData(element);
          if (data.List[i].OpenID == Config.openID) {
            this.myRank = cc.find("bg-rank/layout/rank_value_", this.node).getComponent(cc.Label);
            this.myRank.string = i + 1;
          }
        }
        this.page++;
      } else {
        Msg.show(data.Message);
      }
    });
  },

  onLoad() {
    this.bindNode();
    this.bindEvent();
    this.GetEggRankList();
  },
  start() {}

  // update (dt) {},
});
