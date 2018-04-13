interface SparseArr<T> {
    [index: number]: T;
}

interface TypedCollection<T> {
    [index: string]: T;
}

declare const LEO_HOST: string;
namespace utils {
    export function isIOS() {
        var u = navigator.userAgent;
        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    }

    export function isAndroid() {
        var u = navigator.userAgent;
        return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    }

    export const RESOURCE_ROOT = LEO_HOST + "resource/";
    // export const ASSET_ROOT = RESOURCE_ROOT + (isIOS() ? "assets/" : "assets_webp/");
    export const ASSET_ROOT = RESOURCE_ROOT + "assets/";
    export const CONFIG_ROOT = RESOURCE_ROOT + "config/";
    export const SCENE_BG_ROOT = "pic/scene-bg/";

    export function random(max: number) {
        return Math.floor(Math.random() * max);
    }

    export function randomRange(min: number, max: number) {
        return random(max - min) + min;
    }

    export function shuffle(arr) {
        for (let i = arr.length - 1, half = i / 2; i > half; i--) {
            const num = Math.floor(Math.random() * i);
            const tmp = arr[num];
            arr[num] = arr[i];
            arr[i] = tmp;
        }
    }

    export function copy<T>(obj: T): T {
        let result = <T>{};
        for (let id in obj) {
            (<any>result)[id] = (<any>obj)[id];
        }
        return result;
    }

    function sub(a: any, b: any) {
        return a - b;
    }

    export function binarySearch<T>(list: T[], value: T, compareFunc: (a: T, b: T) => number = sub) {
        const length = list.length;
        let min = 0, max = length - 1;
        let cur: number;
        while (min <= max) {
            cur = Math.floor((min + max) / 2);
            const result = compareFunc(list[cur], value);
            if (result === 0) {
                min = cur;
                break;
            } else if (result > 0) {
                max = cur - 1;
            } else {
                min = cur + 1;
            }
        }
        return min;
    }

    const emptyObj = {};
    export function flatObjArray(objs: Object[]): any {
        if (!objs) { return emptyObj; }

        // let result = objs["flat"];
        // if (result) { return result; }

        // objs["flat"] = result = {};
        let result = {};
        objs.forEach(obj => {
            for (let k in obj) {
                result[k] = obj[k];
            }
        });
        return result;
    }

    export function getObjArray(objs: Object[]) {
        var posList: any[][] = [];
        objs.forEach((obj) => {
            for (let k in obj) {
                posList.push([k, obj[k]]);
            }
        });
        return posList;
    }

    export function forEachObj(obj: Object, callback: (value: any, key: string, obj: Object) => any) {
        if (!obj) { return; }
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            if (obj[key] !== undefined) {
                callback(obj[key], key, obj);
            }
        });
    }

    export function someObj(obj: Object, callback: (value: any, key: string, obj: Object) => boolean) {
        if (!obj) { return false; }
        const keys = Object.keys(obj);
        return keys.some((key) => {
            if (obj[key] !== undefined) {
                return callback(obj[key], key, obj);
            }
        });
    }

    export function everyObj(obj: Object, callback: (value: any, key: string, obj: Object) => boolean) {
        if (!obj) { return true; }
        const keys = Object.keys(obj);
        return keys.every((key) => {
            if (obj[key] !== undefined) {
                return callback(obj[key], key, obj);
            } else {
                return true;
            }
        });
    }

    export function forEachObjCheck(obj: Object, callback: (value: any, key: string, obj: Object) => any) {
        if (!obj) { return; }
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            callback(obj[key], key, obj);
            if (obj[key].progress > 0) { return; }
        }
    }

    export function matchStr(str: string, reg: RegExp) {
        if (str === null) { return; }
        var strArr = str.split(/\[|\]/);
        strArr.splice(0, 1);
        return strArr;
    }

    export function minusWipeOff(num: number) {
        return num > 0 ? num : 0;
    }

    //下面两个是一对方法， 用于存取以本地时间为基准的计时器
    export function getLeftTime(time: number) {
        return Math.max(Math.ceil(time - Game.serverTime), 0);
    }
    export function getEndTime(time: number) {
        return time + Game.serverTime;
    }
    /**返回数组中最小数值 */
    export function getMinNumInArr(arr: number[]): number {
        if (!arr) { return 0; };
        return Math.min.apply(Math, arr);
    }
    /**返回数组中最大数值 */
    export function getMaxNumInArr(arr: number[]): number {
        if (!arr) { return 0; };
        return Math.max.apply(Math, arr);
    }
    /**返回指定数位数*/
    export function getDigit(num: number) {
        var count = 1;
        while (num > 9) {
            num = num / 10;
            count++;
        }
        return count;
    }

    //部分link 配置成[link,...params] 的形式， 通过此函数获取真正的link key
    export function getRealLink(link: any): string {
        if (utils.isArray(link)) {
            return link[0];
        } else {
            return link;
        }
    }

    /*
    * 天空之城有相对应link的npc,通过npc打开
    */
    export function checkSkyNpcLink(link: any) {
        link = getRealLink(link);
        const npcList = Config.MapNpc.getAll();
        return utils.someObj(npcList, (npc: VO.MapNpc) => {
            const flag = getRealLink(npc.link) === link;
            if (flag && mod.Venture.checkMapEnter()) {
                if (!UI.instance.getPanelExist(mod.skycity.SkyCityPanel)) {
                    System.instance.openAndClear(mod.PANEL.SKY_CITY);
                }
                mod.skycity.PlayerManager.instance.playerMove(Game.player.base.id, npc.x, npc.y, 3);
            }
            return flag;
        });
    }

    /*
    * 检查成就点条件，不满足添加灰
    */
    export function checkAchievement(slotIndex: number, link: string, obj: egret.DisplayObjectContainer) {
        const config = Config.Achievement.get(slotIndex, link);
        if (!config) {
            if (obj.getChildIndex(Game.player.daily.achievement) !== -1) {
                obj.removeChild(Game.player.daily.achievement);
            }
            return;
        }


        if (config.achievementPoints > Game.player.daily.godProgress || Game.player.daily.GodGetProgresList.indexOf(config.achievementPoints) === -1) {
            const ach = Game.player.daily.achievement;

            // if (obj instanceof mod.equip.EquipPanelEnchantment) {
            //     ach.y = 0;
            // } else if(obj instanceof mod.equip.EquipStarPanel){
            //     ach.y = -140;
            // }
            obj.addChild(ach);
            ach.verticalCenter = 0;
            ach.horizontalCenter = 0;
            let arr: egret.ITextElement[] = [];
            arr.push({ text: `成就达到`, style: { textColor: Color.YELLOW } });
            arr.push({ text: `${config.achievementPoints}`, style: { textColor: Color.GREEN } });
            arr.push({ text: `点解锁此功能`, style: { textColor: Color.YELLOW } });
            ach.label1.textFlow = arr;
            arr = [];
            arr.push({ text: `当前成就点`, style: { textColor: Color.YELLOW } });
            arr.push({ text: `${Game.player.daily.godProgress}/${config.achievementPoints}`, style: { textColor: Color.GREEN } });
            ach.label2.textFlow = arr;
        } else {
            if (obj.getChildIndex(Game.player.daily.achievement) !== -1) {
                obj.removeChild(Game.player.daily.achievement);
            }
        }
    }

    /*
    * 检查等级条件，返回提示字符串,已检查结果
    */
    export function checkLvlCondiEx(condi: any): [string, boolean] {
        // const tips = this.checkLvlCondi(condi.lvl, condi.transfer, condi.star);
        const base = Game.player.base;
        var tips: string;
        let flag = true;
        if (condi.transfer && base.transfer < condi.transfer) {
            flag = false;
        } else if (condi.star && base.transfer === condi.transfer && base.star < condi.star) {
            flag = false;
        } else if (base.lvl < condi.lvl) {
            flag = false;
        }
        if (condi.transfer) {
            if (condi.star) {
                tips = `${condi.transfer}转${condi.star}星`;
            } else {
                tips = condi.transfer + "转";
            }
        } else {
            tips = condi.lvl + "级";
        }
        return [tips, flag];
    }

    /*
    * 检查等级条件，不符合返回错误信息， 符合则返回undefined
    */
    export function checkLvlCondi(lvl: number, transfer: number, star: number): string {
        const base = Game.player.base;
        let flag = true;
        if (transfer && base.transfer < transfer) {
            flag = false;
        } else if (star && base.transfer === transfer && base.star < star) {
            flag = false;
        } else if (base.lvl < lvl) {
            flag = false;
        }

        if (!flag) {
            if (transfer) {
                if (star) {
                    return `${transfer}转${star}星`;
                } else {
                    return transfer + "转";
                }
            } else {
                return lvl + "级";
            }
        }
        return undefined;
    }
    /*
    * 检查等级或者vip条件，不符合返回错误信息， 符合则返回undefined
    */
    export function checkLvlVipCondi(vip: number, transfer: number, star: number, lvl: number): string {
        let condiStr: string = "";
        const base = Game.player.base;
        let flag = true;
        if (transfer && base.transfer < transfer) {
            flag = false;
        } else if (star && base.transfer === transfer && base.star < star) {
            flag = false;
        } else if (base.lvl < lvl) {
            flag = false;
        } else if (base.vip < vip) {
            flag = false;
        }

        if (!flag) {
            if (transfer) {
                if (star) {
                    condiStr += `${transfer}转${star}星`;
                } else {
                    condiStr += transfer + "转";
                }
            } else if (lvl) {
                condiStr += lvl + "级";
            }
            if (vip) {
                condiStr += "vip" + vip;
            }

            return condiStr;
        }

        return undefined;
    }
    /**
     * 检查目标是否达成，不符合返回错误信息， 符合则返回undefined
     */
    export function checkTragetCondi(targetId: number): string {
        let error: string = "";
        if (targetId >= Game.player.features.id) {
            error = "获得英灵开放";
        }
        return error !== "" ? error : undefined;
    }
    /**
     * 检查财富， 足够返回undefind，不够返回不够信息
     */
    export function checkFortune(fortune: string | Const.FORTUNE, cost: number) {
        var type: Const.FORTUNE;
        if (typeof fortune === "string") {
            type = Const.FORTUNE_ENUM[fortune];
        } else {
            type = fortune;
        }
        const num = Game.player.getFortune(type);
        if (num < cost) {
            return `${Const.FORTUNE_NAMES[type]}不足`;
        } else {
            return undefined;
        }
    }

    export function findInArray<T>(arr: Array<T>, func: (value: T, index?: number, arr?: Array<T>) => boolean) {
        for (let i = 0, l = arr.length; i < l; i++) {
            if (func(arr[i], i, arr)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * 数组大小比较
     */
    export function compareArray(list1: number[], list2: any[]) {
        if (!list1 || !list2) { return false; }
        var result: boolean = false;
        list1.some((lvl, index) => {
            if (lvl !== list2[index] || index === list1.length - 1) {
                result = lvl >= list2[index];
                return true;
            }
            return false;
        });
        return result;
    }
    /**
     *
     */
    export function splitNum(num: number) {
        const num1 = num >> 8 & 255;
        const num2 = num & 255;
        return [num1, num2];
    }
    /**
     * 检查条件  满足一个条件即可 满足返回undefine 不满足返回字符串
     */

    export function checkCondi(condiList: Object[], checkVip = false) {
        if (!condiList) { return undefined; }
        var error: string;
        condiList.some((condi) => {
            for (let k in condi) {
                if (checkVip) {
                    switch (k) {
                        case "vip":
                            error = utils.checkVip(condi[k]);
                            break;
                        default: break;
                    }
                } else {
                    switch (k) {
                        case "lvl":
                            error = utils.checkLvlCondi(condi[k][2], condi[k][0], condi[k][1]);
                            break;
                        case "venture":
                            error = utils.checkVenture(condi[k]);
                            break;
                        default: break;
                    }
                }
            }
            return !!error;
        });
        return error;
    }
    export function checkCondiWeedOut(condiList: Object[]) {
        const condi = condiList[0];
        for (let k in condi) {
            switch (k) {
                case "lvl":
                    return Game.player.base.lvl >= condi[k];
                case "transfer":
                    return Game.player.base.transfer >= condi[k];
                case "servant_count":
                    return Game.player.base.roleCnt > 3;
            }
        }
    }

    export function checkVenture(venture: number) {
        if (Game.player.venture.ventureId <= venture) {
            return `主线通关${venture}关`;
        }
    }
    export function checkVip(vip: number) {
        if (Game.player.base.vip < vip) {
            return `需要VIP${vip}`;
        }
    }
    /**
     * 检查技能等级是否可以提升
     */
    export function checkSkillLvl(skillLvl: number): boolean {

        const base = Game.player.base;
        const lvl = base.lvl;
        const transfer = base.transfer;
        const star = base.star;
        const max = computeSkillLvl(lvl, transfer, star);

        return skillLvl < max;
    }
    /**
     * 计算当前人物等级的技能等级上限
     */
    export function computeSkillLvl(lvl: number, transfer: number, star: number) {
        let skillMaxLvl: number = 0;
        if (transfer === 0) {
            skillMaxLvl = lvl;
        } else {
            skillMaxLvl = (transfer - 1) * 10 + lvl + star;
        }
        return skillMaxLvl;

    }
    export function getLvlStr(lvl: number, transfer: number, star: number): string {
        if (transfer) {
            return `${transfer}转`;
        } else {
            return `${lvl}级`;
        }
    }
    /**
     * 战斗力相加
     */
    export function addStren(attr: any, totleAttr: VO.Attr) {
        if (!attr) { return; }
        for (var i = 0; i < attr.length; i++) {
            for (let k in attr[i]) {
                totleAttr[k] = (totleAttr[k] || 0) + (+attr[i][k]);
            }
        }
    }

    export function fixAttr(key: string, num: number) {
        if (key === "dmgAdd" || key === "dmgDec") {
            return `${num / 100}%`
        }
        return `${num}`
    }

    export function getCfgGoodsList(cost: Object[]): model.Goods[] {
        const result: model.Goods[] = [];
        if (cost) {
            cost.forEach(obj => {
                for (let k in obj) {
                    const mo = mod.Bag.createItem(+k, obj[k]);
                    result.push(mo);
                }
            });
        };
        return result;
    }

    export function getVentureGoodsList(cost: Object[]): model.Goods[] {
        const result: model.Goods[] = [];
        if (cost) {
            cost.forEach(obj => {
                for (let k in obj) {
                    if (obj[k] instanceof Array) {
                        obj[k].forEach((goods) => {
                            ;
                            for (let _k in goods) {
                                const mo = mod.Bag.createItem(+_k, goods[k]);
                                result.push(mo);
                            }
                        })
                    } else {
                        for (let _k in obj) {
                            const mo = mod.Bag.createItem(+_k, obj[_k]);
                            result.push(mo);
                        }
                    }
                }
            });
        };
        return result;
    }

    export function getCfgWealthList(cost: Object[]): model.Goods[] {
        const result: model.Goods[] = [];
        if (cost) {
            cost.forEach((obj) => {
                for (let k in obj) {
                    const mo = mod.Bag.createItem(ui.misc.getFortuneDropGoods(k), obj[k]);
                    result.push(mo);
                }
            });
        }
        return result;
    }

    export interface CostFortune {
        type: Const.FORTUNE;
        num: number;
    }
    export function getCostWealthList(cost: Object[]) {
        const result: CostFortune[] = [];
        if (cost) {
            cost.forEach((obj) => {
                for (let k in obj) {
                    const type = Const.FORTUNE_KEY.indexOf(k);
                    result.push({ type: type, num: obj[k] });
                }
            });
        }
        return result;
    }

    export function getLvlValue(params: number[], lvl: number = Game.player.base.lvl): number {
        if (!params) { return; }
        let result = 0;
        params.forEach(param => {
            result = result * lvl + param;
        });
        return result;
    }

    export function getLvl(lvl: number, transfer: number = 0, star: number = 0) {
        if (transfer === 0) {
            return lvl;
        } else {
            return lvl + (transfer - 1) * 10 + star;
        }
    }

    export function getRaceMemberCnt(race: number, subrace: number) {
        if (race === Const.RACE.HERO) {
            if (subrace === Const.SUB_RACE.PLAYER) {
                return 1;
            } else {
                return Game.player.base.roleCnt - 1;
            }
        } else {
            return Game.player.base.roleCnt;
        }
    }

    export function isArray(obj: any): obj is Array<any> {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    export function conversionTime(time: number): string {
        return `${Math.floor(time / 3600)}:${Math.floor((time % 3600) / 600)}${Math.floor((time % 600) / 60)}:${Math.floor((time % 60) / 10)}${Math.floor(time % 10)}`;
    }

    export function returnTimeDiff(timestamp: number): string {
        const time = Game.serverTime - timestamp;
        var str: string = "";
        if (Math.floor(time / 86400) > 0) {
            str = `${Math.floor(time / 86400)}天`;
        } else if (Math.floor(time / 60) > 0) {
            if (Math.floor(time / 3600) > 0) {
                str += `${Math.floor(time / 3600)}小时`;
            }
            if (Math.floor((time % 3600) / 60) > 0) {
                str += `${Math.floor((time % 3600) / 60)}分钟`;
            }
        } else {
            str = `${Math.floor(time)}秒`;
        }
        return str;
    }

    export function conversionTimeToString(time: number) {
        var str: string = "";
        if (Math.floor(time / 86400) > 0) {
            str = `${Math.floor(time / 86400)}天`;
        }
        if (Math.floor(time / 3600) > 0) {
            str += `${Math.floor((time % 86400) / 3600)}小时`;
        }
        if (Math.floor((time % 3600) / 60) > 0) {
            str += `${Math.floor((time % 3600) / 60)}分钟`;
        }
        str += `${Math.floor(time % 60)}秒`;
        return str;
    }

    export function intTime(time: number) {
        if (Math.floor(time / 86400) > 0) {
            return `${Math.floor(time / 86400)}天`;
        }
        if (Math.floor(time / 3600) > 0) {
            return `${Math.floor((time % 86400) / 3600)}小时`;
        }
        if (Math.floor((time % 3600) / 60) > 0) {
            return `${Math.floor((time % 3600) / 60)}分钟`;
        }
        return `${Math.floor(time % 60)}秒`;
    }

    /**
     * 计算开始时间到结算时间差
     * params startTime     开始时间戳 秒
     * params stopTime      结算时间 （1——24）小时
     */
    export function getTimeDiff(startTime: number, stopTime: number) {
        var time: number = 0;
        const toStartTime = getMinute(startTime);
        const toStoopTime = (stopTime - 8) * 60;
        if (toStartTime >= 0 && toStartTime < toStoopTime) {
            // 8点到结算时间之间
            time = toStoopTime - toStartTime;
        } else {
            time = 2220 - toStartTime;
        }

        //  上一个8点到开始时间分钟数
        function getMinute(startTime: number) {
            return Math.floor(startTime / 60) % 1440;
        }
        return time;
    }

    export function getPlayerPos(x, y): number[][] {
        var random = Math.random();
        var posX, posY: number;
        if (random < 0.5) {
            posX = utils.randomRange(x - 250 < 200 ? 200 : x - 250, x + 250 > 3800 ? 3800 : x + 250);
            random = Math.random();
            if (random > 0.5) {
                posY = y + 250 > 3800 ? 3800 : y + 250;
            } else {
                posY = y - 250 < 200 ? 200 : y - 250;
            }
        } else {
            random = Math.random();
            if (random > 0.5) {
                posX = x + 250 > 3800 ? 3800 : x + 250;
            } else {
                posX = x - 250 < 200 ? 200 : x - 250;
            }
            posY = utils.randomRange(y - 250 < 200 ? 200 : y - 250, y + 250 > 3800 ? 3800 : y + 250);
        }

        return [[posX], [posY]];
    }

    export function filtDataRes(list: string[]) {
        return list.filter(v => {
            return v.substr(-4) === "data";
        });
    }

    export function removeHtmlTab(text) {
        return text.replace(/[</>?&]/g, '');//删除所有HTML标签
    }

    export function getMapType(type: number, subtype: number) {
        return type * 100 + subtype;
    }

    export function removeSelf(obj: egret.DisplayObject) {
        if (obj && obj.parent) {
            obj.parent.removeChild(obj);
        }
    }

    export function setChildVisible(obj: egret.DisplayObject, flag: boolean, parent: egret.DisplayObjectContainer) {
        if (flag) {
            if (obj.parent !== parent) {
                parent.addChild(obj);
            }
        } else if (obj.parent) {
            obj.parent.removeChild(obj);
        }
    }

    export function getGridCloud(x: number, y: number) {
        var pointList: number[][] = [];
        for (var i = x - 1; i < x + 2; i++) {
            for (var j = y - 1; j < y + 2; j++) {
                pushPoint(i, j);
            }
        }
        function pushPoint(x: number, y: number) {
            if (x >= 1 && x <= 6 && y >= 1 && y <= 15) {
                pointList.push([x, y]);
            }
        }
        return pointList;
    }

    // export function getAttr(attr: any) {
    //     if (!attr) { return; }
    //     const totleAttr = new VO.Attr();
    //     for (var i = 0; i < attr.length; i++) {
    //         for (let k in attr[i]) {
    //             totleAttr[k] = (totleAttr[k] || 0) + (+attr[i][k]);
    //         }
    //     }
    //     return totleAttr;
    // }

    //生命周期管理
    const __lifeCycleKey__ = "__lifeCycleKey__";
    const __timerKey__ = "__timerKey__";
    function watchLifeCycle(obj: egret.DisplayObject, change: number) {
        let count = obj.getExtraData(__lifeCycleKey__) || 0;
        count += change;
        obj.setExtraData(__lifeCycleKey__, count);
        if (count === 1) {
            obj.addEventListener(egret.Event.REMOVED_FROM_STAGE, onObjRemoveFromStage, obj);
            obj.addEventListener(egret.Event.ADDED_TO_STAGE, onObjAddToStage, obj);
        } else if (count <= 0) {
            obj.removeEventListener(egret.Event.REMOVED_FROM_STAGE, onObjRemoveFromStage, obj);
            obj.removeEventListener(egret.Event.ADDED_TO_STAGE, onObjAddToStage, obj);
        }
    }

    function onObjAddToStage() {
        var obj: egret.DisplayObject = this;
        const timer: egret.Timer = obj.getExtraData(__timerKey__);
        if (timer) {
            timer.start();
        }
    }

    function onObjRemoveFromStage() {
        var obj = this;
        clearInterval(obj);
    }

    //计时器
    export function setInterval(obj: egret.DisplayObject, func: (any) => boolean, thisObj: any, interval: number) {
        function update() {
            const flag = func.call(thisObj);
            if (!flag) {
                clearInterval(obj);
            }
            return flag;
        }

        clearInterval(obj);
        const flag = update();
        if (flag) {
            const timer = new egret.Timer(interval, 0);
            timer.addEventListener(egret.TimerEvent.TIMER, update, undefined);
            obj.setExtraData(__timerKey__, timer);
            watchLifeCycle(obj, 1);
            if (obj.isOnStage) {
                timer.start();
            }
        }
    }

    export function clearInterval(obj: egret.DisplayObject) {
        const timer: egret.Timer = obj.getExtraData(__timerKey__);
        if (timer) {
            timer.stop();
            obj.setExtraData(__timerKey__, undefined);
            watchLifeCycle(obj, -1);
        }
    }

    export function getProtoMsgId(obj: (Proto.ProtoObjectC2S | Proto.ProtoObjectS2C)) {
        return obj["_msgId"];
    }

    export function collision(actRect1: battle.ActionRect, actRect2: battle.ActionRect, obj1: { x: number, y: number }, obj2: { x: number, y: number }): boolean {
        if (!actRect1 || !actRect2) { return false; }
        let rect1: egret.Rectangle = new egret.Rectangle(actRect1.x, actRect1.y, actRect1.w, actRect1.h);
        let rect2: egret.Rectangle = new egret.Rectangle(actRect2.x, actRect2.y, actRect2.w, actRect2.h);
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }

    export function hitCheck(obj1: egret.DisplayObject, obj2: egret.DisplayObject, objScale1: number = 2, objScale2: number = 3, Offset1: number = 2, Offset2: number = 2): boolean {
        let rect1: egret.Rectangle = obj1.getBounds();
        let rect2: egret.Rectangle = obj2.getBounds();
        rect1.width -= rect1.width / objScale1;
        rect1.height -= rect1.height / objScale1;
        rect2.width -= rect2.width / objScale2;
        rect2.height -= rect2.height / objScale2;
        rect1.x = obj1.x - rect1.width / Offset1;
        rect1.y = obj1.y - rect1.height / Offset1;
        rect2.x = obj2.x - rect2.width / Offset2;
        rect2.y = obj2.y - rect2.height / Math.abs(Offset2);
        return rect1.intersects(rect2);
    }

    export function getNetErrorMsg(msgId: number) {
        return "NetError" + msgId;
    }

    export function removeOnceListener(dispatcher: egret.EventDispatcher, type: string) {
        const list = dispatcher.$EventDispatcher[1][type] as egret.sys.EventBin[];
        if (list) {
            list.forEach(eventBin => {
                if (eventBin.dispatchOnce) {
                    eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
                }
            });
        }
    }

    export function donull(){}
}