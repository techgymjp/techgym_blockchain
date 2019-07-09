pragma solidity 0.5.0;

import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Lottery {

    using SafeMath for uint256;

    /* ------ オーナー情報 ------ */
    address private _owner;
    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    /* ------ 宝くじの購入者リスト ------ */
    address payable[] private purchases;

    /* ------ 宝くじの設定 ------ */
    struct LotteryInfo {
        string title;         // 宝くじの名前
        uint   winningAmount; // 当選金額
        uint   lotteryPrice;  // 販売金額
        uint   maxSales;      // 販売枚数
    }
    LotteryInfo private lotteryInfo = LotteryInfo("テックジムジャンボ宝くじ", 3e18, 1e18, 10);

    // コンストラクタ
    constructor() public payable {
        require(msg.value >= lotteryInfo.winningAmount, "保有金額が不足しています。");

        // オーナーの登録
        _owner = msg.sender;
    }

    // 宝くじを購入
    function buy() public payable {
        require(msg.value >= lotteryInfo.lotteryPrice, "送金額が足りないため、購入できません。");
        require(purchases.length < lotteryInfo.maxSales, "宝くじは完売しました。。。");

        // 返金
        uint refund = msg.value.sub(lotteryInfo.lotteryPrice);
        if (refund > 0) msg.sender.transfer(refund);

        purchases.push(msg.sender);
    }

    // 抽選
    function decide(uint decidedIndex) public onlyOwner {
        address payable addr = purchases[decidedIndex];
        addr.transfer(lotteryInfo.winningAmount);
    }

    // 宝くじのタイトルを取得します
    function getLotteryTitle() public view returns (string memory) {
        return lotteryInfo.title;
    }
}
