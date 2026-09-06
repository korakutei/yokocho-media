// トップページのMAPセクション(地方ブロッククリック)と /travel の地域アンカーで
// 共有する、地方名(data/yokocho-directory.jsonの"region"値) → ASCIIアンカーID の対応表。
export const REGION_ANCHOR_IDS: Record<string, string> = {
  "北海道・東北": "hokkaido-tohoku",
  関東: "kanto",
  中部: "chubu",
  "関西・中国・四国": "kinki-chugoku-shikoku",
  "九州・沖縄": "kyushu-okinawa",
};
