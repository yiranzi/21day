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
        //常规
        name: 'course21',
        router: '/course21',//默认路由前缀`
        //描述
        title: '21天训练营',
        //报名
        // payPicLength: 4,//报名页图片长度
        price: [9,6],//价格
        //分享
        shareTitle: '超过10万+的人都追捧的理财入门课，还不快来吗？',//分享标题
        shareDesc: '只要一顿早餐的钱，点击报名！',//分享描述

        shareOther: [
            //听课证
            {
                title: '',
                desc: '',
            }
        ]
    },
    '0':{
        name: 'seven',
        price: [9,3],
        title: '7天训练营',
        router: '/seven',
        shareTitle: '和我一起提高财商吧',
        shareDesc: '邀请你一起参加7天财商训练营',

        shareOther: [
            //听课证
            {
                title: '',
                desc: '',
            }
        ]
    },
    '1':{
        name: 'fund',
        price: [9,3],
        title: '基金课',
        router: '/fund',
        shareTitle: '14天带你躺赢基金定投！一天10分钟，手把手教你！',
        shareDesc: '宝宝618不再担心没钱买买买啦',
    },
};

const routerInfo = {
    '-1': '',
    '0': 'seven',
    '1': 'fund',
    '2': 'course21',
    //长投家页面
    'main': 'main',
    'homelist': 'homelist',
    'homeinfo': 'homeinfo',
    'pay': 'payPage',
    'listen': 'listenCourse',
    'select': 'courseSelect',
    // 'begin': 'courseBegin',
    // 'graduated': 'getGraduated',
    'begin': 'courseBegin',
    'reward': 'getReward',
    'gradua': 'getGraduated',
};


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


    /**
     *
     * @param courseId 课程编号
     * @param shareType 界面名称
     * @returns {{}}
     * 界面名称有两种 1 预设好的界面名称.作为进入每个界面自动触发的分享.
     * 2自定义的额外界面.作为一个界面需要有两种以上的分享(判定逻辑)
     */
    static getShareInfo(courseId,shareType,params) {
        if(!params) {
            params = {};
        }
        courseId = parseInt(courseId);
        let shareInfo =
        {
            '-1': {
                'default': {
                    title: '长投派,每天进步一点点的行动派',
                    desc: '生活变得不一样',
                    link: ''
                }
            },
            '0': {
                'default': {
                    title: '和我一起提高财商吧',
                    desc: '邀请你一起参加7天财商训练营',
                    link: ''
                },
                'getReward': {
                    title: `我是第${params.rank}名完成${params.courseName}课的人，快来看看我的成就卡吧！`,
                    desc: '快比比谁的财商更高吧?',
                    link: `&goPath=${GlobalConfig.getRouterInfo('reward')}&courseId=${sessionStorage.getItem('courseId')}&name=${params.name}&rank=${params.rank}&dayId=${params.dayId}&getWhere=share`
                }
            },
            '1': {
                'default': {
                    title: '14天带你躺赢基金定投！一天10分钟，手把手教你！',
                    desc: '宝宝618不再担心没钱买买买啦',
                },
                'getReward': {
                    title: '',
                    desc: '',
                }
            },
            '2': {
                //默认到报名页
                'default': {
                    title: '超过10万+的人都追捧的理财入门课，还不快来吗？',
                    desc: '只要一顿早餐的钱，点击报名！',
                    link: `&goPath=${GlobalConfig.getRouterInfo('pay')}&courseId=${sessionStorage.getItem('courseId')}&getWhere=share`,
                },
                //开课证页面
                'courseBegin': {
                    title: '快看我的录取通知书！',
                    desc: '我在参加21天训练营',
                    link: `&goPath=${GlobalConfig.getRouterInfo('begin')}/other&courseId=${sessionStorage.getItem('courseId')}&getWhere=share`,
                }
            },
        };

        let getCourseDefault = shareInfo[courseId];
        if(!getCourseDefault) {
            getCourseDefault = shareInfo[-1]
        }
        let getCourseShare = getCourseDefault[shareType];
        if(!getCourseShare) {
            getCourseShare = getCourseDefault['default'];
        }
        return getCourseShare;
        return finalResult;
    }

    static getCourseInfo(courseId) {
        // let nameKey = couseIdNameMap.get(courseId);
        return courseInfo[courseId];
    }

    static getRouterInfo(key) {
        let result = routerInfo[key];
        if(result) {
            return result
        } else {
            return null;
        }
    }

    static getCourseName() {
        return this.getCourseInfo(sessionStorage.getItem('courseId')).name
    }

    static getCourseIdList() {
        return courseIdList;
    }
}
// let finalResult = {};
// switch (courseId) {
//     case -1:
//         switch (shareType) {
//             default:
//                 finalResult = {
//                     title: '长投派,每天进步一点点的行动派',
//                     desc: '生活变得不一样',
//                     link: ''
//                 }
//         }
//         break;
//     case 0:
//         switch (shareType) {
//             case 'getReward':
//                 finalResult = {
//                     title: `我是第 ${arguments[0]} 名完成'+ ${arguments[1]}  + '课的人，快来看看我的成就卡吧！`,
//                     desc: '快比比谁的财商更高吧?',
//                     link: ''
//                 };
//                 break;
//             default:
//                 finalResult = {
//                     title: '和我一起提高财商吧',
//                     desc: '邀请你一起参加7天财商训练营',
//                     link: ''
//                 }
//         }
//         break;
//     case 1:
//         switch (shareType) {
//             case 'getReward':
//                 finalResult = {
//                     title: `我是第 ${arguments[0]} 名完成'+ ${arguments[1]}  + '课的人，快来看看我的成就卡吧！`,
//                     desc: '快比比谁的财商更高吧?',
//                     link: ''
//                 };
//                 break;
//             default:
//                 finalResult = {
//                     title: '14天带你躺赢基金定投！一天10分钟，手把手教你！',
//                     desc: '宝宝618不再担心没钱买买买啦',
//                     link: ''
//                 }
//         }
//         break;
//     case 2:
//         switch (shareType) {
//             case 'courseBegin':
//                 finalResult = {
//                     title: '快看我的录取通知书！',
//                     desc: '我在参加21天训练营',
//                     link: `&goPath=${GlobalConfig.getRouterInfo('reward0')}
//                            &courseId=${sessionStorage.getItem('courseId')}`,
//                 };
//                 break;
//             default:
//                 finalResult = {
//                     title: '超过10万+的人都追捧的理财入门课，还不快来吗？',
//                     desc: '只要一顿早餐的钱，点击报名！',
//                     link: `&goPath=${GlobalConfig.getRouterInfo('pay')}
//                            &courseId=${sessionStorage.getItem('courseId')}`,
//                 }
//         }
//         break;
//     default:
//         finalResult = {
//             title: '长投派,每天进步一点点的行动派',
//             desc: '生活变得不一样',
//         }
// }

module.exports = GlobalConfig;
window.GlobalConfig = GlobalConfig;