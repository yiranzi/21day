/**
 * Created by ichangtou on 2017/7/21.
 */
//课程id表
const courseIdList = [0,1,2];
// const couseIdNameMap = new Map();
// const couseIdName = {};

const courseInfo = {
    '-1':{
        shareTitle: '长投派,每天进步一点点的行动派',
        shareDesc: '生活变得不一样',
    },

    '2':{
        // payPicLength: 4,//报名页图片长度
        price: [9,3],//价格
        title: '21天训练营',//标题
        router: '/course21',//默认路由前缀`
        shareTitle: '21天训练营开开营',//分享标题
        shareDesc: '快来快来',//分享描述
    },
    '0':{
        price: [9,3],
        title: '7天训练营',
        router: '/seven',
        shareTitle: '和我一起提高财商吧',
        shareDesc: '邀请你一起参加7天财商训练营',
    },
    '1':{
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

    static getCourseIdList() {
        return courseIdList;
    }

}

module.exports = GlobalConfig;