/**
 * Created by ichangtou on 2017/7/21.
 */
//课程id表
    //添加课程请增加 数组 和 课程信息
const courseIdList = [0,1,2];
// const couseIdNameMap = new Map();
// const couseIdName = {};
// `./assetsPlus/image/${GlobalConfig.getCourseName()}/course_select_title.png`
const courseInfo = {
    '-1':{
        shareTitle: '长投派,每天进步一点点的行动派',
        shareDesc: '生活变得不一样',
    },

    '2':{
        name: 'course21',
        // payPicLength: 4,//报名页图片长度
        price: [9,3],//价格
        title: '21天训练营',
        router: '/course21',//默认路由前缀`
        shareTitle: '超过10万+的人都追捧的理财入门课，还不快来吗？',//分享标题
        shareDesc: '只要一顿早餐的钱，点击报名！',//分享描述
    },
    '0':{
        name: 'seven',
        price: [9,3],
        title: '7天训练营',
        router: '/seven',
        shareTitle: '和我一起提高财商吧',
        shareDesc: '邀请你一起参加7天财商训练营',
    },
    '1':{
        name: 'fund',
        price: [9,3],
        title: '基金课',
        router: '/fund',
        shareTitle: '14天带你躺赢基金定投！一天10分钟，手把手教你！',
        shareDesc: '宝宝618不再担心没钱买买买啦',
    },
}


class GlobalConfig {
    // static init() {
    //     couseIdNameMap.set("0", "seven");
    //     couseIdNameMap.set("1", "fund");
    //     couseIdNameMap.set("2", "course21");
    //
    //     let value = '';
    //     for(let i = 0; i<courseIdList.length; i++) {
    //         switch (i) {
    //             case 0:
    //                 value = 'seven';
    //                 break;
    //             case 1:
    //                 value = 'fund';
    //                 break;
    //             case 2:
    //                 value = 'course21';
    //                 break;
    //         }
    //         couseIdName[i] = value;
    //     }
    //
    // }

    // static getCourseName(courseId) {
    //     return couseIdName[courseId];
    // }

    static getCourseInfo(courseId) {
        // let nameKey = couseIdNameMap.get(courseId);
        return courseInfo[courseId];
    }

    static getCourseName() {
        return this.getCourseInfo(sessionStorage.getItem('courseId')).name
    }

    static getCourseIdList() {
        return courseIdList;
    }

}


module.exports = GlobalConfig;
window.GlobalConfig = GlobalConfig;