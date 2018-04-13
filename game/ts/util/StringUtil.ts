namespace StringUtils {
    /**
    *直接传递参数输出字符串
    * "{0}~{1}", "A", "B");
    */
    export function format(str: string, ...params: any[]): string {
        return formatByArray(str, params);
    }

    /**
    *传递数组格式化输出字符串
    */
    export function formatByArray(str: string, params?: any[]): string {
        if (params) {
            // 查找字符串中的所有占位符，格式{...}
            var matchArr: RegExpMatchArray = str.match(/{\d+(,\d+)?}%?/g);
            var numberReg: RegExp = /\d+/g;
            if (matchArr) {
                matchArr.forEach((v, i, a) => {
                    var matchNumArr = v.match(numberReg);
                    var index: string = matchNumArr[0];

                    if (params[index] === undefined) { return; }

                    var replaceKey: string;
                    var replaceContent: string;

                    // 正常处理
                    if (v.lastIndexOf("%") === -1) {
                        replaceKey = v;
                        replaceContent = params[index];
                    }
                    // 处理百分比数值
                    else {
                        var fractionDigits: number = matchNumArr.length > 1 ? parseInt(matchNumArr[1]) : 2;
                        replaceKey = v.substr(0, v.length - 1);
                        replaceContent = (params[index] * 100).toFixed(fractionDigits);
                    }

                    str = str.replace(replaceKey, replaceContent);
                });
            }
        }
        str = str.replace(/\\n/g, "\n");
        return str;
    }

    const timeUnitName: string[] = ["秒", "分", "时", "天"];
    const timeUnitBase: number[] = [60, 60, 24];
    export function toTime(seconds: number) {
        const arr: string[] = [];
        timeUnitBase.forEach((base, i) => {
            const unit = timeUnitName[i];
            const num = seconds % base;
            seconds = (seconds - num) / base;
            if (num > 0) {
                arr.push(num + unit);
            }
        });
        if (seconds > 0) {
            arr.push(seconds + timeUnitName[timeUnitBase.length]);
        }
        if (arr.length === 0) {
            return `0${timeUnitName[0]}`;
        } else {
            return arr.reverse().join("");
        }
    }

    export function numCN(num: number) {
        const arr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];
        return arr[num];
    }

    export function numPY(num: number) {
        const arr = ["Ling", "Yi", "Er", "San", "Si", "Wu", "Liu", "Qi", "Ba", "Jiu"];
        return arr[num];
    }

    /*
        格式化数字
        @params dec  保留小数位数
        @params dsep 整数小数分隔符
        @params tsep 整数部分三位递进分隔符 
    */
    export function formatNum(num: number, dec: number, dsep = ".", tsep = ""): string {
        if (isNaN(num) || num === null) { return ''; };

        const str = num.toFixed(~~dec);
        const parts = str.split('.');
        const fnums = parts[0];
        const decimals = parts[1] ? dsep + parts[1] : '';

        return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    }

}