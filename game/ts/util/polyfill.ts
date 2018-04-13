declare module egret{
    interface Texture{
        url : string;
        host: egret.Texture;
        invalid:boolean;
    }

    interface BitmapData{
        url : string;
        host: egret.Texture;
        invalid:boolean;
    }

    interface DisplayObject{
        isOnStage:boolean;
        //touchEnabled和touchChildren只能指定对象不接收触摸事件， 但是点击区域内， 会导致父节点接收到触摸事件。
        //当touchExclude=true 时， 即不接收事件，也不会导致父节点接收事件。默认为false
        touchExclude:boolean;
        getExtraData:(key:string)=>any;
        setExtraData:(key:string, value:any)=>void;
    }

    export type TextureData = Texture| BitmapData;
}

egret.DisplayObject.prototype.getExtraData = function(key:string){
    const _this = this as egret.DisplayObject;
    return _this.$DisplayObject[key];
};
egret.DisplayObject.prototype.setExtraData = function(key:string, value:any){
    const _this = this as egret.DisplayObject;
    _this.$DisplayObject[key] = value;
};

namespace egret{
    export function getTextureHashCode(texture:egret.TextureData){
        let hashCode: number;
        if ((<egret.Texture>texture)._bitmapData && (<egret.Texture>texture)._bitmapData.hashCode) {
            hashCode = (<egret.Texture>texture)._bitmapData.hashCode;
        }
        else {
            hashCode = texture.hashCode;
        }
        return hashCode;
    }

    function getBitmapData(texture){
        if ((<egret.Texture>texture)._bitmapData) {
            return (<egret.Texture>texture)._bitmapData;
        }else{
            return texture;
        }
    }

    function setBitMapUrl(texture:egret.TextureData, url:string){
        texture.url = url;
        if ((<egret.Texture>texture)._bitmapData && (<egret.Texture>texture)._bitmapData.hashCode) {
            (<egret.Texture>texture)._bitmapData.url = url;
        }

        bitMapCountChanged(texture, 0);
    }

    function bitMapCountChanged(texture:egret.TextureData, change?:number){
        if (texture.host){
            bitMapCountChanged(texture.host, change);
            // const key = texture.host.url;
            // console.log("----change----", key, texture.url, change, resouce.UIResourceManager.instance["resList"][key]);
        } else {
            resouce.UIResourceManager.instance.change(texture.url, change);
        }
    }

    export function polyfill_Texture(){
        const SheetAnalyzer_analyzeBitmap = RES.SheetAnalyzer.prototype.analyzeBitmap;
        RES.SheetAnalyzer.prototype.analyzeBitmap = function(resItem, texture) {
            setBitMapUrl(texture, resItem.name);
            return SheetAnalyzer_analyzeBitmap.call(this, resItem, texture);
        };

        const RES_ImageAnalyzer_analyzeData = RES.ImageAnalyzer.prototype["analyzeData"];
        RES.ImageAnalyzer.prototype["analyzeData"] = function(resItem: RES.ResourceItem, texture: Texture){
            setBitMapUrl(texture, resItem.name);
            return RES_ImageAnalyzer_analyzeData.call(this, resItem, texture);
        };

        const egret_SpriteSheet_prototype_createTexture = SpriteSheet.prototype.createTexture;
        SpriteSheet.prototype.createTexture = function(name:string, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number, offsetX:number = 0, offsetY:number = 0, textureWidth?:number, textureHeight?:number):Texture {
            const texture:egret.Texture = egret_SpriteSheet_prototype_createTexture.call(this, name, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight);
            texture.host = this["$texture"];
            texture.url = name;
            return texture;
        };

        const egret_BitmapData_addDisplayObject = BitmapData.$addDisplayObject;
        BitmapData.$addDisplayObject = function(displayObject: DisplayObject, texture: egret.TextureData): void {
            // if(!displayObject.isOnStage){ return;}
            bitMapCountChanged(texture, 1);
            // const result = egret_BitmapData_addDisplayObject.call(this, displayObject, texture);
            // const hashCode = getTextureHashCode(texture);
            // console.log("-BitmapData--$addDisplayObject---", hashCode, texture.url, BitmapData["_displayList"][hashCode].length);
            // return result;
        };

        const egret_BitmapData_removeDisplayObject = BitmapData.$removeDisplayObject;
        BitmapData.$removeDisplayObject = function(displayObject: DisplayObject, texture: egret.TextureData): void {
            if (displayObject instanceof egret.Bitmap) {
                const curTexture = displayObject.$Bitmap[sys.BitmapKeys.bitmapData];
                if(curTexture === texture){
                    displayObject.$Bitmap[sys.BitmapKeys.bitmapData] = null;
                    displayObject.$Bitmap[sys.BitmapKeys.image] = null;
                }
            }

            bitMapCountChanged(texture, -1);
            // const hashCode = getTextureHashCode(texture);
            // const originList = BitmapData["_displayList"][hashCode];
            // const originCnt =  originList ? originList.length : 0;
            // const result = egret_BitmapData_removeDisplayObject.call(this, displayObject, texture);
            // const list = BitmapData["_displayList"][hashCode];
            // console.log("-BitmapData--$removeDisplayObject---", hashCode, texture.url, originCnt, list ? list.length : 0);
            // return result;
        };

        const egret_BitmapData_dispose = BitmapData.$dispose;
        BitmapData.$dispose = function(texture: egret.TextureData): void {
            const data = getBitmapData(texture);
            data.invalid = true;
            return egret_BitmapData_dispose.call(this, texture);
        };

        const Bitmap_prototype_onAddToStage = Bitmap.prototype["$onAddToStage"];
        Bitmap.prototype["$onAddToStage"] = function(stage: Stage, nestLevel: number): void {
            const result = Bitmap_prototype_onAddToStage.call(this, stage, nestLevel);
            if(this.__source){
                const texture:TextureData = this.$Bitmap[sys.BitmapKeys.image];
                if(!texture || texture.invalid){
                    const source = this.__source;
                    this.texture = undefined;
                    let adapter:eui.IAssetAdapter = egret.getImplementation("eui.IAssetAdapter");
                    adapter.getAsset(source, this.$$onResLoaded, this);
                }
            }
            return result;
        };

        const Bitmap_prototype_setBitmapData = Bitmap.prototype["$setBitmapData"];
        Bitmap.prototype["$setBitmapData"] = function $setBitmapData(texture: TextureData): boolean {
            if(texture){
                const data = getBitmapData(texture);
                const isAction = resouce.UIResourceManager.instance.isIgnore(data.url);
                if(!isAction){
                    this.__source = texture.url;
                }
            } else{
                this.__source = undefined;
            }

            return Bitmap_prototype_setBitmapData.call(this, texture);
        };

        Bitmap.prototype["$$onResLoaded"] = function(content, source): void {
            const texture:TextureData = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if(texture && !texture.invalid){ return;}
            if(content && !content.$getTextureWidth){return;}
            this.$setBitmapData(content);
        };

        Object.defineProperty(Bitmap.prototype, "scrollRect", {
            get: function(){
                return undefined;
            },
            set: function(rect:egret.Rectangle){
                let values = this.$Bitmap;
                this.$refreshImageData();
                values[egret.sys.BitmapKeys.bitmapWidth] = Math.min(values[egret.sys.BitmapKeys.bitmapWidth], rect.width);
                values[egret.sys.BitmapKeys.bitmapHeight] = Math.min(values[egret.sys.BitmapKeys.bitmapHeight], rect.height);
                values[egret.sys.BitmapKeys.bitmapX] += rect.x;
                values[egret.sys.BitmapKeys.bitmapY] += rect.y;
                this.$invalidateContentBounds();
            },
            enumerable: false,
            configurable: false
        });

        Object.defineProperty(DisplayObject.prototype, "isOnStage", {
            get: function(){
                return this.$nestLevel !== 0;
            },
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(DisplayObject.prototype, "touchExclude", {
            value: false,
            writable: true,
            enumerable: false,
            configurable: false
        });

        const egret_DisplayObjectContainer_$hisTest = egret.DisplayObjectContainer.prototype.$hitTest;
        egret.DisplayObjectContainer.prototype.$hitTest = function(x, y){
            if(this.touchExclude){ return null;}
            return egret_DisplayObjectContainer_$hisTest.call(this, x, y);
        };

        const egret_DisplayObject_$hisTest = egret.DisplayObject.prototype.$hitTest;
        egret.DisplayObject.prototype.$hitTest = function(x, y){
            if(this.touchExclude){ return null; }
            return egret_DisplayObject_$hisTest.call(this, x, y);
        };

        var eui_image_source = Object.getOwnPropertyDescriptor(eui.Image.prototype, "source");
        Object.defineProperty(eui.Image.prototype, "source", {
            get:function(){
                return eui_image_source.get.call(this);
            },
            set: function(value){
                if(value === this._source){
                    return;
                }
                this.__source = undefined;
                return eui_image_source.set.call(this, value);
            },
            enumerable: true,
            configurable: true
        });
    }
}