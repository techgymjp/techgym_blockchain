pragma solidity 0.5.0;

contract Lottery {

    /* ------ 宝くじの購入者リスト ------ */
    address payable[] private purchases;

    /* ------ 宝くじの設定 ------ */
    string private lotteryTitle  = "テックジムジャンボ宝くじ"; // 宝くじの名前
    uint   private winningAmount = 3e18;                       // 当選金額（3ETH）
    uint   private lotteryPrice  = 1e18;                       // 販売金額（1ETH）

    // コンストラクタ
    constructor() public payable {
        require(msg.value >= winningAmount, "保有金額が不足しています。");
    }

    // 宝くじを購入
    function buy() public payable {
        require(msg.value >= lotteryPrice, "送金額が足りないため、購入できません。");
        purchases.push(msg.sender);
    }

    // 抽選
    function decide(uint decidedIndex) public {
        address payable addr = purchases[decidedIndex];
        addr.transfer(winningAmount);
    }
}
