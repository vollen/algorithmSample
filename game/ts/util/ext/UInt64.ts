class UInt64
{

    public constructor(high?: Uint32, low?: Uint32)
    {
        this._high = high;
        this._low = low;
    }

    public Set(high: Uint32, low: Uint32): void
    {
        this._high = high;
        this._low = low;
    }

    public SetVal(val: number)
    {
        this._low = val >>> 31;
        this._low = val >>> 1;
        this._high = ((val & 0xffffffff) >>> 0);
    }

    public  Low(): Uint32
    {
        return this._low;
    }

    public High(): Uint32
    {
        return this._high;
    }

    public get IsZero(): boolean { return this._high == 0 && this._low == 0; }

    public ToNumber():number
    {
        return this._low * 0x100000000 + this._high;
    }

    public Equal(other: UInt64): boolean
    {
        return other.High() == this._high && other.Low() == this._low;
    }

    private _low: Uint32 = 0;
    private _high: Uint32 = 0;
}

//TOFIX
const p = egret.ByteArray.prototype;
p.writeDouble = function(value:number){
    const _this:egret.ByteArray = this;
    const low = Math.floor(value / 0x100000000);
    _this.writeUnsignedInt(low);
    _this.writeUnsignedInt(((value & 0xffffffff) >>> 0));
};

p.readDouble = function(){
    const _this:egret.ByteArray = this;
    const low = _this.readUnsignedInt();
    const high = _this.readUnsignedInt();
    return low * 0x100000000 + high;
};
