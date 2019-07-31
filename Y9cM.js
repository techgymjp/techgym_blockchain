
const bitcoin = require('bitcoinjs-lib');

// LiteCoin用パラメータ　出典はbitcoinjs-lib内にあるサンプル
const LITECOIN = {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0
    }

// P2PKHアドレスの作成
// BTC,LTC双方あるが、演習ではBTCのみでもよい。
function gen_bitcoin() {
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address;
}

function gen_litecoin() {
    const keyPair = bitcoin.ECPair.makeRandom({ network: LITECOIN });
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: LITECOIN });
    return address;
}

//適当な鍵ペアに対し、WIFフォーマットとアドレスを出力
function dump_key() {
    const kp_b = bitcoin.ECPair.makeRandom();
	const priv = kp_b.privateKey.toString('hex');
	console.log("privateKey=%s", priv);
	
    const kp_l = bitcoin.ECPair.fromPrivateKey(kp_b.privateKey, { network:LITECOIN });
	
	const wif_b = kp_b.toWIF()
	console.log("wif_b=%s", wif_b);
		
	const wif_l = kp_l.toWIF()
	console.log("wif_l=%s", wif_l);

	const addr_b_pkh = bitcoin.payments.p2pkh({ pubkey: kp_b.publicKey }).address;
	console.log("btc pkh addr=%s", addr_b_pkh);
	
	const addr_l_pkh = bitcoin.payments.p2pkh({ pubkey: kp_l.publicKey, network: LITECOIN }).address;
	console.log("ltc pkh addr=%s", addr_l_pkh);
	
	// 一例として、このようにすればP2SHアドレスも取れるが初学者には困難かもしれない
	const t = bitcoin.address.fromBase58Check(addr_b_pkh);
	const addr_b_sh = bitcoin.payments.p2sh({hash: t.hash });
	console.log("btc sh addr=%s", addr_b_sh.address);
	
	const addr_l_sh = bitcoin.payments.p2sh({hash: bitcoin.address.fromBase58Check(addr_l_pkh).hash, network:LITECOIN });
	console.log("ltc sh addr=%s", addr_l_sh.address);

}

dump_key();
