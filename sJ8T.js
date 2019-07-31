const { promisify } = require('util');
const fs = require("fs");
const sprintf = require('sprintf-js').sprintf;
const sha256 = require('bitcoinjs-lib').crypto.sha256;

// 整数で返す [0, m)
function random(m) {
  return Math.floor(Math.random() * m);
}

// size<64K 前提で、最初のデータセットを返す。これがトランザクション集合のつもり
function generateSourceData(size) {
  const r = [];
  for(let i=0; i<size; i++) {
    const buf = new Buffer(0x400);
    buf.fill(0);
    buf[0] = i / 256;
    buf[1] = i % 256;
    r.push(buf);
  }
  return r;
}

//ランダムにトランザクション集合を定め、前ブロックのハッシュとともに連結したデータのハッシュを計算する
function selectAndHash(source, prev_block_hash, count) {
  const r = new Array(count);
  const b = new Array(count + 1);
  b[0] = prev_block_hash;
  for(let i=0; i<count; i++) {
      r[i] = random(source.length);
      b[i+1] = source[r[i]];
  }
  const total = Buffer.concat(b);
  //console.log(sprintf("totallen=%d", total.length));
  return { indices:r, hash:sha256(total) }; // sha3_256.array() でバイナリデータとしてのハッシュが得られる。sha3_256()では16進数で文字列化したものになってしまう
}

//合格になるトランザクション集合を探す
function search(source, prev_block_hash) {
  let try_count = 0;
  
  while(true) {
    try_count++;
    const c = selectAndHash(source, prev_block_hash, 5);
    if(check_pass(c.hash)) {
      c.try_count = try_count;
      return c;
    }
  }
}

function check_pass(hash) {
  //return hash[0]==0 && hash[1]==0; //先頭何バイトに０が並ぶべきかのチェック
  return hash[0]==0;
}

//main part
const source = generateSourceData(0x10000);
const i2s = function(i) { return i.toString(); };

let block_number = 0;
let total_try_count = 0;
let block_hash = new Buffer(0);
while(block_number < 1000) { //この回数は適当に
  const c = search(source, block_hash);
  total_try_count += c.try_count;
  //ブロック生成状況  try_countのばらつきがかなりあること、averageが256に近づくことを観察しよう
  console.log(sprintf("block %d: try=%d, average=%f, indices=%s", block_number, c.try_count, total_try_count / (block_number+1), c.indices.map( i2s ).join(",")));
  block_number++;
  block_hash = c.hash;
}

