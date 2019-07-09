pragma solidity 0.5.0;

contract Lottery {

    /* ------ 宝くじの購入者リスト ------ */
    address payable[] private purchases;

    /* ------ 宝くじの設定 ------ */
    struct LotteryInfo {
        string title;         // 宝くじの名前
        uint   winningAmount; // 当選金額
        uint   lotteryPrice;  // 販売金額
    }
    LotteryInfo private lotteryInfo = LotteryInfo("テックジムジャンボ宝くじ", 3e18, 1e18);

    // コンストラクタ
    constructor() public payable {
        require(msg.value >= lotteryInfo.winningAmount, "保有金額が不足しています。");
    }

    // 宝くじを購入
    function buy() public payable {
        require(msg.value >= lotteryInfo.lotteryPrice, "送金額が足りないため、購入できません。");
        purchases.push(msg.sender);
    }

    // 抽選
    function decide(uint decidedIndex) public {
        address payable addr = purchases[decidedIndex];
        addr.transfer(lotteryInfo.winningAmount);
    }

    // 宝くじのタイトルを取得します
    function getLotteryTitle() public view returns (string memory) {
        return lotteryInfo.title;
    }
}
