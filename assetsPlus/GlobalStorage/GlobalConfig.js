/**
 * Created by ichangtou on 2017/7/21.
 */
const courseList = [0,1,2];
const couseIdNameMap = new Map();

const courseInfo = {
    'course21':{
        price: [9,3],
        title: '21天训练营',
    },
    'seven':{
        price: [9,3],
        title: '长投派'
    },
    'fund':{
        price: [9,3],
        title: '长投派'
    },
}


class GlobalConfig {
    static init() {
        couseIdNameMap.set("0", "seven");
        couseIdNameMap.set("1", "fund");
        couseIdNameMap.set("2", "course21");
    }

    static getCourseInfo(courseId) {
        let nameKey = couseIdNameMap.get(courseId);
        return courseInfo[nameKey];
    }

}

module.exports = GlobalConfig;