
const bitcoin = require('bitcoinjs-lib');

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

function dump_key() {
    const keyPair = bitcoin.ECPair.makeRandom( { network:LITECOIN });
	const priv = keyPair.privateKey.toString('hex');
	console.log(priv);
	
	const wif = keyPair.toWIF()
	console.log(wif);
	
	const key2 = bitcoin.ECPair.fromWIF(wif, LITECOIN);
	console.log(key2.toWIF());
	
	const o1 = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: LITECOIN });
	console.log(o1.address);
	const o2 = bitcoin.payments.p2pkh({ pubkey: key2.publicKey, network: LITECOIN });
	console.log(o2.address);
}

function send_btc() {
	const wif = "";
	const kp = bitcoin.ECPair.fromWIF(wif);
	console.log(kp);
    const kp2 = bitcoin.ECPair.fromPrivateKey(kp.privateKey);
	console.log(kp2);
    
	const txb = new bitcoin.TransactionBuilder();
	const prev_tx = "5bd79dd134d581c48351f505b657a5828ccaceaeb1eda589f8d0416ae6f46b33";
	const prev_n = 1;
	const amount = 300000;
	const dest = "(destination address)";
	console.log("txb_net = %o", txb.network);
	
	const dest_obj = bitcoin.address.fromBase58Check(dest);
	console.log(dest_obj);

    txb.setVersion(1)
    txb.addInput(prev_tx, prev_n) 
    txb.addOutput(dest, 299000);

	/*
		bitcoin-jsのサンプルとnpmで取れるソースとに差異あり
    txb.sign({
      prevOutScriptType: 'p2pkh',
      vin: 0, // これはいま作っているTX内のinputの番号
      keyPair: kp
    });
    */
    txb.sign(0, kp2, null);
    
    const rawtx = txb.build().toHex();
    console.log("rawtx = " + rawtx);
}

function send_ltc() {
	const wif = "L154SrKKTshvjKvKkJN1bA1YhkZ52hkzdZSRWhm9NcKNJMnJGgEk";
	const kp = bitcoin.ECPair.fromWIF(wif);
	console.log(kp);
    const kp2 = bitcoin.ECPair.fromPrivateKey(kp.privateKey, {network:LITECOIN});
	console.log(kp2);
    
	const txb = new bitcoin.TransactionBuilder(LITECOIN);
	const prev_tx = "5bd79dd134d581c48351f505b657a5828ccaceaeb1eda589f8d0416ae6f46b33";
	const prev_n = 1;
	const amount = 30000000;
	const dest = "LSywgbkkZR3bXtqjiWvgGmX5THXX1neDc7";
	console.log("txb_net = " + JSON.stringify(txb.network));
	
	const dest_obj = bitcoin.address.fromBase58Check(dest);
	console.log(dest_obj);

    txb.setVersion(1)
    txb.addInput(prev_tx, prev_n) 
    txb.addOutput(dest, 29900000);

	/*
    txb.sign({
      prevOutScriptType: 'p2pkh',
      vin: 0, // これはいま作っているTX内のinputの番号
      keyPair: kp
    });
    */
    txb.sign(0, kp2, null);
    
    const rawtx = txb.build().toHex();
    console.log("rawtx = " + rawtx);
}

send_btc();
//send_ltc();

