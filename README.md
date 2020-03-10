# bbd

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


# 应用功能展示
## 赛事
### 赛事列表
1
		赛事展示页面中，头部搜索栏可以通过用户昵称搜索到其发布的作品。位于搜索框下面的操作栏目是用于赛事搜索功能区，其中点击筛选之后会弹出关于地区、类型、时长、位置、限定、费用等筛选条件查询赛事。筛选功能区下面就是赛事的栏目区域，点击关注可以添加赛事发布者到自己的关注列表中。点击赛事栏目关注意外的区域即可进入赛事详情页面；点击赛事展示页面右下角添加按钮即可进入赛事发布页面。如下图所示：
        ![赛事展示](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%B5%9B%E4%BA%8B%E5%B1%95%E7%A4%BA.png)
        ![赛事筛选](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%B5%9B%E4%BA%8B%E7%AD%9B%E9%80%89.png)
				                                

### 赛事发布
		赛事发布页面主要用于赛事发布资料的填写。其中时间、时长、赛事类型、赛事地点、赛事人数、赛事位置、评分限定、加入审核、场地是否收费为必填字段；已有信息、备注为非必填字段。如下图所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%B5%9B%E4%BA%8B%E5%8F%91%E5%B8%83.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%B5%9B%E4%BA%8B%E5%9C%B0%E7%82%B9%E9%80%89%E5%8F%96.png)
     赛事发布							     赛事地点选取
### 赛事详情
		赛事详情页面会展示发布者的信息，赛事详情信息，队友信息，赛事地点等；点击发布者头像可查看发布者详细资料，点击沟通图标可与发布者发起聊天。加入按钮位于信封处，点击即可发起加入请求。如下图所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%B5%9B%E4%BA%8B%E8%AF%A6%E6%83%851.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%B5%9B%E4%BA%8B%E8%AF%A6%E6%83%852.png)
     
## 装备
### 装备列表
		装备展示页面头部是一个标签栏，展示的是全城与同区的装备。页面右下角添加按钮可跳转致装备发布页；标签栏下是展示装备信息；布局采用了瀑布流布局，展示内容包括商品图片，描述，价格，标签，区域，发布者头像与信用评分。如下图5-3-2-1所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%A3%85%E5%A4%87%E5%88%97%E8%A1%A8.png)
 
图5-3-2-1
### 装备发布
		装备发布页面用户填写装备的描述、价格、上传装备图片、装备标签等。装备图片上限是六张，如下图所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E5%8F%91%E5%B8%83%E8%A3%85%E5%A4%871.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E5%8F%91%E5%B8%83%E8%A3%85%E5%A4%872.png)
         
### 装备详情
		装备详情页面负责展示关于装备的详细资料，包括：发布者信息、发布时间、价格、标签、秒速、图片等；页面右下角我想要按钮点击即可跳转到用户沟通页面，如下图5-3-2-3所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%A3%85%E5%A4%87%E8%AF%A6%E6%83%85.png)
图5-3-2-3

## 聊天
### 聊天列表
		聊天列表页面类似于微信聊天，负责响应式展示聊天列表。每个列表项中展示的内容如下：左侧展示用户头像如有未读新消息头像右上角会提示未读数；中间分为三栏目，上面展示用户昵称、中间展示最新的聊天内容或者类型（字符就展示字符本身，其他的展示类型）、下方展示用户设置的标签；最右边展示的是最新聊天的时间；标签栏中会展示所有的未读信息条数之和。按住列表项左移动可删除。如下图：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%81%8A%E5%A4%A9%E5%88%97%E8%A1%A81.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%81%8A%E5%A4%A9%E5%88%97%E8%A1%A82.png)
      
### 聊天详情
		聊天页面使用了better-scorll插件，实现页面下拉加载历史聊天记录，并且带有良好的新消息动画效果。页面构成如下：页面头部展示的是用户昵称，头部右方点击可以跳转致用户详细资料页面；页面底部为聊天操作栏目，点击＋号弹起操作栏，再次点击收起操作栏，其中栏目包括：赛事、发送位置、装备，均可发送相应的内容。其余的页面位置展示的是页面聊天记录。如下图所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%81%8A%E5%A4%A9%E8%AF%A6%E6%83%851.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%81%8A%E5%A4%A9%E8%AF%A6%E6%83%852.png)
       
## 我的
		我的页面主要用于展示用户信息，页面支持下拉刷新，并且有众多功能入口：我的消息、个人信息、我的赛事、我的装备、我的关注、我的评价、问题反馈等；如下图5-3-4所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E6%88%91%E7%9A%84.png)
 
图5-3-4
### 我的消息
		我的消息里面负责展示新的评论和申请加入赛事结果（假设赛事设置了加入审核）。黄色表示是未读条目，白色表示已读。点击评论会跳转致评论详细页，点击赛事加入结果会跳转赛事详细页。如下图5-3-4-1所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E6%88%91%E7%9A%84%E6%B6%88%E6%81%AF.png)
 
图5-3-4-1
### 个人信息
		个人信息页面负责用户信息的修改，包括：头像、昵称、位置、身高、体重、标签、座右铭等。其中头像上传使用了vue-imgcut组件，可支持对选择的头像进行裁剪。见下图：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E9%80%89%E5%8F%96%E5%A4%B4%E5%83%8F%E8%A3%81%E5%89%AA.png)
        
				 个人信息                           选取头像裁剪
### 我的赛事
		我的赛事页面收录我发布的赛事与我参与的赛事。页面头部有三个标签栏把赛事区分：全部、代开赛、待评价。赛事列表中的赛事分为两种：代开赛、已完赛。每个赛事都会根据赛事是否结束了显示不同的按钮。例如未开赛的会显示退出赛事；已完赛的会显示去评价。退出赛事的规则为：用户作为发布者发布的赛事并且成功有人加入赛事，不允许退出比赛；用户作为队员加入赛事成功并且退出赛事，退出成功并且扣除信用评分3分。赛事列表中点击查看赛事可以跳转致赛事详情页，点击去评论会跳转致评论页面，点击退出赛事会发起退赛请求。如下图所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E6%88%91%E7%9A%84%E8%B5%9B%E4%BA%8B.png)
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E8%AF%84%E8%AE%BA.png)
         
				我的赛事								 评论
### 我的装备
		我的装备页用于展示用户发布的装备，点击装备栏会出现两个操作按钮：查看、删除。查看可以跳转致装备详情页，删除即可删除发布的装备。如下图5-3-4-4所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E6%88%91%E7%9A%84%E8%A3%85%E5%A4%87.png)
 
图5-3-4-4
### 我的关注
		此页面会显示用户关注的所有用户；点击沟通跳转到聊天页，点击取关会取消对于该用户的关注。点击其余空白地方会跳转致用户信息展示页。如下图展示：
         ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8.png)
         ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.png)
				我的关注                           用户信息展示
### 我的评价
		我的评价页面展示的是用户收到的评论和用户给予的评论，如下图5-3-4-6所示：
    ![Alt text](https://github.com/luodaye007/bbd-client/blob/master/ScreenShots/%E6%88%91%E7%9A%84%E8%AF%84%E4%BB%B7.png)
    
 

