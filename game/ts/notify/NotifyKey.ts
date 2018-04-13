namespace notify {
    export const enum KEY {
        // add key above this
        KEY_CNT,            //
    }

    const enum MOD_KEY {
        BASE = KEY.KEY_CNT,

        KEY_CNT,
    }

    function genComposeKey(base: number, ...params: number[]) {
        base *= 100;
        params.forEach(num => {
            base *= 10;
            base += num || 0;
        });
        return base;
    }
}