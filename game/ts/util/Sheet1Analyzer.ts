namespace RES {

    /**
     * SpriteSheet解析器
     * @private
     */
    export class Sheet1Analyzer extends SheetAnalyzer {
        public getRelativePath(url:string, file:string):string {
            return url.slice(0, -5) + "1";
        }
    }
}