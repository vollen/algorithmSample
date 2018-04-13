
namespace EffectUtils {
    //抖动对象特效
    //类似ios密码输入错误的特效
    export function shake(obj: egret.DisplayObject, shakeDt: number = 40, propName: string = "x"): void {
        const shakeOnce = (action: egret.Tween, diff: number, delay: number) => {
            let props = {};
            props[propName] = obj[propName] + diff;
            action.to(props, shakeDt)
                .wait(delay);
        };
        const action = egret.Tween.get(obj);
        shakeOnce(action, -10, shakeDt * 2);
        shakeOnce(action, 20, shakeDt * 3);
        shakeOnce(action, -20, shakeDt * 4);
        shakeOnce(action, 20, shakeDt * 5);
        shakeOnce(action, 0, 0);
    }


    //抖动对象特效
    // 1：抖动  2：震动
    export function shakeScreen(effectType: number = 1): void {
        const obj = UI.instance;
        const shakeDt = 40;
        shake(obj, shakeDt);
        if (effectType === 2) {
            shake(obj, shakeDt, "y");
        }
    }

    /**
    * 给显示对象增加特效
    * obj           对象
    * cartoonType   动画类型 1:变小，弹大 2:变小，轻微弹大 3：变小，还原
    */
    export function click(obj: egret.DisplayObject, cartoonType: number = 1): void {
        const key = "isPlayingEffect";
        if (obj[key]) { return; }

        const props = { scaleX: 1, scaleY: 1, x: obj.x - obj.width / 10, y: obj.y - obj.height / 4 };
        let time: number = 500, func: Function;
        if (cartoonType === 1) {
            func = egret.Ease.elasticOut;
        } else if (cartoonType === 2) {
            func = egret.Ease.backOut;
        } else if (cartoonType === 3) {
            time = 100;
        }

        obj[key] = true;
        egret.Tween.get(obj)
            .to({ scaleX: 0.8, scaleY: 0.8, x: obj.x + obj.width / 10, y: obj.y + obj.height / 10 }, 100, egret.Ease.sineIn)
            .to(props, time, func)
            .call(() => {
                obj[key] = false;
            });
    }

    /**
    * 显示对象上线浮动特效
    * obj           对象
    * time          浮动时间 毫秒
    * space         浮动高度
    * todo          多个对象跳动
    */
    export function float(obj: egret.DisplayObject, time: number, space: number = 50): void {
        if (obj === null) { return; }
        egret.Tween.get(obj, { loop: true })
            .to({ y: obj.y + space }, time / 2)
            .to({ y: obj.y - space }, time)
            .to({ y: obj.y }, time / 2);
    }

    /**
    * 显示对象摇头特效
    * obj           对象
    * time          浮动时间 毫秒
    * space         摇头幅度
    * todo          多个对象摇头
    * 注意：需要将对象的注册点位置：0.5,1
    */
    export function rock(obj: egret.DisplayObject, time: number, space: number = 20): void {
        if (obj === null) { return; }
        egret.Tween.get(obj, { loop: true })
            .to({ rotation: space }, time / 2)
            .to({ rotation: -space }, time)
            .to({ rotation: 0 }, time / 2);
    }

    /**
    * 文字打字机效果
    * obj           文本对象
    * content       文字
    * interval      打字间隔 毫秒
    */
    export function typer(obj: egret.TextField, content: string = "", interval: number = 200): void {
        const strArr: Array<any> = content.split("");
        const len: number = strArr.length;
        for (let i = 0; i < len; i++) {
            egret.setTimeout(function () {
                obj.appendText(strArr[Number(this)]);
            }, i, interval * i);
        }
    }

    export function bomp(obj: egret.DisplayObject, duration = 100, wait = 900, scale = 1.2): egret.Tween {
        const action = egret.Tween.get(obj, { loop: true });
        action.to({ scaleX: scale, scaleY: scale }, duration).to({ scaleX: 1, scaleY: 1 }, duration).wait(wait);
        return action;
    }


    //从下到上弹出
    export function downToUp(obj: egret.DisplayObject): void {
        egret.Tween.get(obj).to({
            y: obj.y - 120,
            alpha: 1
        }, 800, egret.Ease.backOut)
            .to({ alpha: 0 }, 500)
            .call(removeSelf, obj);
    }

    //从左至右 或者 从右至左
    export function leftToRight(obj: egret.DisplayObject): void {
        obj.x = -obj.width;
        egret.Tween.get(obj)
            .to({ x: (Game.instance.gameWidth - obj.width) / 2 - 50, alpha: 1 }, 300, egret.Ease.sineInOut)
            .wait(300)
            .to({ x: obj.x + 100 }, 500)
            .wait(800)
            .to({ x: Game.instance.gameWidth }, 300, egret.Ease.sineIn)
            .wait(1100)
            .call(removeSelf, obj);
    }

    export function rightToLeft(tips: egret.DisplayObject) {
        const gw = Game.instance.gameWidth;
        tips.x = gw;
        egret.Tween.get(tips)
            .to({ x: (gw - tips.width) / 2 + 50, alpha: 1 }, 300, egret.Ease.sineInOut)
            .wait(300)
            .to({ x: tips.x - 100 }, 500)
            .wait(800)
            .to({ x: -tips.width }, 300, egret.Ease.sineIn)
            .wait(1100)
            .call(removeSelf, tips);
    }

    //从里到外
    export function fadeOut(tips: egret.DisplayObject): void {
        tips.scaleX = 0;
        tips.scaleY = 0;
        egret.Tween.get(tips)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200)
            .wait(1000)
            .to({ alpha: 0 }, 500)
            .call(removeSelf, tips);
    }

    //从外到里
    export function fadeIn(tips: egret.DisplayObject): void {
        tips.scaleX = 4;
        tips.scaleY = 4;
        egret.Tween.get(tips)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200)
            .wait(1000)
            .to({ alpha: 0 }, 500)
            .call(removeSelf, tips);
    }

    // 数字滚动
    export function numberRoll(obj: egret.TextField, num1: number, num2: number) {
        let sum = num1;
        const num3 = Math.abs(num2);
        const interval = 1500 / num3;
        var changeNum = Math.ceil(num3 / 1500);
        if(interval < 1000 / 60){
           changeNum = Math.ceil(num3 / 90);
        }
        if (num2 > 0) {
            var intervalId1 = egret.setInterval(() => {
                if (sum >= num1 + num2) {
                    obj.text = `总战斗力：${num1 + num2}`;
                    egret.clearInterval(intervalId1);
                } else {
                    sum += changeNum;
                    obj.text = `总战斗力：${sum}`;
                }
            }, this, interval);
        }
         if (num2 < 0) {
            var intervalId2 = egret.setInterval(() => {
                if (sum <= num1 + num2) {
                    obj.text = `总战斗力：${num1 + num2}`;
                    egret.clearInterval(intervalId2);
                } else {
                    sum -= changeNum;
                    obj.text = `总战斗力：${sum}`;
                }
            }, this, interval);
        }
    }

    function removeSelf() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}

