/**
 * Created by ichangtou on 2017/7/21.
 */
const courseList = [0,1,2];
const couseIdNameMap = new Map();

const courseInfo = {
    'course21':{
        title: '21天训练营'
    },
    'seven':{
        title: '长投派'
    },
    'fund':{
        title: '长投派'
    },
}

class GlobalConfig {
    static init() {
        console.log('init');
        couseIdNameMap.set(0, "seven");
        couseIdNameMap.set(1, "fund");
        couseIdNameMap.set(2, "course21");
    }

    static getCourseInfo(courseId) {
        let nameKey = couseIdNameMap.get(courseId);
        return courseInfo.nameKey;
    }

}

module.exports = GlobalConfig;