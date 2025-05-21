let mt;
let generatedNumbers = [];

function setup() {
  createCanvas(800, 400);
  mt = new MersenneTwister(5489); // seed iniziale
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  generateNumbers();
}

function draw() {
  background(30);

  fill(255);
  text("Premi il mouse per generare numeri con Mersenne Twister", 10, 10);

  // Visualizza la lista di numeri generati
  let listX = 10;
  let listY = 40;
  fill(200);
  for (let i = 0; i < generatedNumbers.length; i++) {
    text(nf(generatedNumbers[i], 1, 6), listX, listY + i * 20);
  }

  // Usa i numeri per disegnare cerchi sulla parte destra
  for (let i = 0; i < generatedNumbers.length; i += 3) {
    let x = map(generatedNumbers[i], 0, 1, width / 2, width);
    let y = map(generatedNumbers[i + 1], 0, 1, 0, height);
    let r = map(generatedNumbers[i + 2], 0, 1, 10, 60);
    fill(100 + 150 * generatedNumbers[i], 200 * generatedNumbers[i + 1], 255 * generatedNumbers[i + 2], 180);
    ellipse(x, y, r, r);
  }

  noLoop();
}

function mousePressed() {
  generateNumbers();
  loop();
}

function generateNumbers() {
  generatedNumbers = [];
  for (let i = 0; i < 15; i++) {
    generatedNumbers.push(mt.random());
  }
}

// === Mersenne Twister JS Implementation ===
// Fonte: https://gist.github.com/banksean/300494
function MersenneTwister(seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  }
  this.mt = new Array(624);
  this.mti = 625;
  this.init_genrand(seed);
}

MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti = 1; this.mti < 624; this.mti++) {
    let s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
    this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
      (s & 0x0000ffff) * 1812433253) + this.mti;
    this.mt[this.mti] >>>= 0;
  }
};

MersenneTwister.prototype.random = function() {
  return this.genrand_int32() * (1.0 / 4294967296.0);
};

MersenneTwister.prototype.genrand_int32 = function() {
  let y;
  const mag01 = [0x0, 0x9908b0df];

  if (this.mti >= 624) {
    let kk;
    for (kk = 0; kk < 227; kk++) {
      y = (this.mt[kk] & 0x80000000) | (this.mt[kk + 1] & 0x7fffffff);
      this.mt[kk] = this.mt[kk + 397] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (; kk < 623; kk++) {
      y = (this.mt[kk] & 0x80000000) | (this.mt[kk + 1] & 0x7fffffff);
      this.mt[kk] = this.mt[kk + (397 - 624)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[623] & 0x80000000) | (this.mt[0] & 0x7fffffff);
    this.mt[623] = this.mt[396] ^ (y >>> 1) ^ mag01[y & 0x1];
    this.mti = 0;
  }

  y = this.mt[this.mti++];

  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
};
