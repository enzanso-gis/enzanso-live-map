// テーマの表示非表示
const THEME_CONFIG = {
    "indoor": true,
    "outdoor": true,
    "flower": true,
    "autumn": true,
    "animal": true
};
// 場所のマスターデータ
const JUMP_LOCATIONS = {
    "enzanso": { name: "🏕️ 燕山荘（えんざんそう）", coords: "36.3992, 137.7152, 19" },
    "ariakeso": { name: "♨️ 有明荘（ありあけそう）", coords: "36.3942, 137.7468, 18" },
    "daitenso": { name: "🏕️ 大天荘（だいてんそう）", coords: "36.3638, 137.7030, 18" },
    "hyuttenisidake": { name: "🏕️ ヒュッテ西岳", coords: "36.3355, 137.6800, 18" },
    "hyutteooyari": { name: "🏕️ ヒュッテ大槍", coords: "36.3378, 137.6550, 18" },
    "kassenkoya": { name: "🏕️ 合戦小屋（かっせんごや）", coords: "36.3936, 137.7268, 18" },
    "hounomine": { name: "🏕️ 【関東】棒ノ嶺", coords: "35.8587, 139.1549, 16" },
    "sobosan": { name: "⛰️ 【九州】祖母山", coords: "32.8289, 131.3324, 14" },
    "karakunidake": { name: "⛰️ 【九州】韓国岳", coords: "31.9424, 130.8521, 14" },
    "hirakikidake": { name: "⛰️ 【九州】開聞岳", coords: "31.1871, 130.5325, 14" }
};
// IDによるグループ定義
const JUMP_GROUPS = {
    // 000 はプログラム側で「すべて」として処理します
    "001": [], // 北海道
    "002": [], // 東北
    "003": ["nishidake"], // 関東
    "004": [], // 中部
    "005": [], // 近畿
    "006": [], // 中国
    "007": [], // 四国
    "008": ["sobosan","karakunidake","hirakikidake"], // 九州
    "009": [], // 沖縄
    "100": ["enzanso","ariakeso","daitenso","hyuttenisidake","hyutteooyari","kassenkoya"]  // 燕山荘グループ
};