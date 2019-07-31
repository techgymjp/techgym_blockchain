const bitcoin = require('bitcoinjs-lib');
const hash256 = bitcoin.crypto.hash256;

// 新しいキーペア作成  本当は充分質の高い乱数であることの検証が必要だが練習ではそこまで求めなくてもよい
const keyPair = bitcoin.ECPair.makeRandom();

// ハッシュ値の取得 bitcoinjs-libではBufferを経由してハッシュを取り、得られるハッシュもまたBufferである
const testdata = "hello techgym";
const hash = hash256(new Buffer(testdata));

//ハッシュに対して署名を取る
const signature = keyPair.sign(hash);
console.log("signature = " + signature);

//署名が正しいことを検証
const verified = keyPair.verify(hash, signature);
console.log("verified = " + verified);

//違うデータについては（例えば署名の先頭バイトを変更)、検証が失敗する
signature[0]++;
const should_fail = keyPair.verify(hash, signature);
console.log("should_fail = " + should_fail);
