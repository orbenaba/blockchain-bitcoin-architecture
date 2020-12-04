const mongoose = require('../Backend/node_modules/mongoose');

const BloomFilterSchema = new mongoose.Schema({
    m:{
        type: Number,
        default:32*265
    },
    k:{
        type:Number,
        default:16
    },
    buckets:{
        type:[String] ,
        required: false
    },
    _locations:{
        type:[Number],
        required:true
    }
});

//Hook
BloomFilterSchema.pre("save",async function(next){
    //Rounding m to the nearest multiple of 32
    var n = Math.ceil(this.m / 32), i = -1;
    this.m = n*32;
    var kbytes = 1 << Math.ceil(Math.log(Math.ceil(Math.log(this.m) / Math.LN2 / 8)) / Math.LN2);
    var array = kbytes === 1 ? Uint8Array : kbytes === 2 ? Uint16Array : Uint32Array
    var kbuffer = new ArrayBuffer(kbytes * this.k)
    var buckets = this.buckets = new Int32Array(n);
    this._locations = new array(kbuffer);
})

BloomFilterSchema.methods.locations = async function(v){
    var k = this.k,
    m = this.m,
    r = this._locations,
    a = fnv_1a(v),
    b = fnv_1a(v, 1576284489), // The seed value is chosen randomly
    x = a % m;
    for (var i = 0; i < k; ++i) {
        r[i] = x < 0 ? (x + m) : x;
        x = (x + b) % m;
    }
    return r;
}

//Check whether v - value is in the filter
BloomFilterSchema.methods.test = async function(v) {
    var l = this.locations(v + ""),
        k = this.k,
        buckets = this.buckets;
    for (var i = 0; i < k; ++i) {
      var b = l[i];
      if ((buckets[Math.floor(b / 32)] & (1 << (b % 32))) === 0) {
        return false;
      }
    }
    return true;
};

//Adding an item to the filter
BloomFilterSchema.methods.add = function(v) {
    var l = this.locations(v + ""),
        k = this.k,
        buckets = this.buckets;
    for (var i = 0; i < k; ++i) buckets[Math.floor(l[i] / 32)] |= 1 << (l[i] % 32);
};

 // Estimated cardinality.
 BloomFilterSchema.methods.size = function() {
    var buckets = this.buckets,
        bits = 0;
    for (var i = 0, n = buckets.length; i < n; ++i) bits += popcnt(buckets[i]);
    return -this.m * Math.log(1 - bits / this.m) / this.k;
  };



function popcnt(v) {
    v -= (v >> 1) & 0x55555555;
    v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
    return ((v + (v >> 4) & 0xf0f0f0f) * 0x1010101) >> 24;
}

// Fowler/Noll/Vo hashing.
// Nonstandard variation: this function optionally takes a seed value that is incorporated
// into the offset basis
// "almost any offset_basis will serve so long as it is non-zero".
function fnv_1a(v, seed) {
    var a = 2166136261 ^ (seed || 0);
    for (var i = 0, n = v.length; i < n; ++i) {
        var c = v.charCodeAt(i),
            d = c & 0xff00;
        if (d) a = fnv_multiply(a ^ d >> 8);
        a = fnv_multiply(a ^ c & 0xff);
    }
    return fnv_mix(a);
}

// a * 16777619 mod 2**32
function fnv_multiply(a) {
    return a + (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
}


function fnv_mix(a) {
    a += a << 13;
    a ^= a >>> 7;
    a += a << 3;
    a ^= a >>> 17;
    a += a << 5;
    return a & 0xffffffff;
}

const BloomFilterModel = mongoose.model('BloomFilters', BloomFilterSchema);


module.exports = {BloomFilterModel, BloomFilterSchema}