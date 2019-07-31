const { promisify } = require('util');
const fs = require("fs");
const sprintf = require('sprintf-js').sprintf;
const sha256 = require('bitcoinjs-lib').crypto.sha256;

const char_counts = new Array(16).fill(0);

function toIndex(s) {
  return parseInt(s, 16);
}

const rf = promisify(fs.readFile);
const tasks = [];

for(let i=0; i<256; i++) {
  tasks.push( rf( sprintf("work/test%'03d.bin", i)).then( data => {
    const hash = sha256(Buffer.from(data));
    const hash_str = hash.toString("hex");
    console.log(sprintf("%3d\t%s", i, hash_str)); // ハッシュ値の出力
    // 16種の文字の分布カウント これがだいたい均等になっていることを確認する
    for(let j = 0; j < hash_str.length; j++) {
      char_counts[parseInt(hash_str.charAt(j), 16)]++;
    }
  }) );
}

Promise.all(tasks).then( () => {
  //文字の分布結果表示
  console.log("char counts");
  let sum = 0;
  for(let i=0; i<char_counts.length; i++) {
    console.log( sprintf("%x\t%d", i, char_counts[i]));
    sum += char_counts[i];
  }
  console.log("total char count " + sum); // ハッシュ１個が64文字、256個のハッシュ、で文字数合計は64*256=16384のはず
}
);
