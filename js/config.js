/*
 * LP設定値 — ここだけ書き換えれば全ページに反映されます。
 * ※ index.html 内の構造化データ(JSON-LD)と、JS無効時の表示用の初期値は
 *   同じ値を手で書いてあります。料金を変えたら index.html の
 *   「data-bind」と JSON-LD の price も合わせて更新してください。
 */
window.LP_CONFIG = {
  cta: {
    // 主CTA:無料セミナー・説明会
    seminar: "https://ceokidsacademy.com/senbatsu-taimen/",
    // 副CTA:お問い合わせ(公式サイトのナビ「お問い合わせ」= /contact)
    contact: "https://ceokidsacademy.com/contact/"
  },
  price: {
    tuition: 540000,       // 受講料(円)
    monthly: 45000,        // 月あたり相当(円)
    enrollment: 15000,     // 入会金(円・税抜)
    materials: 3000        // 教材費(円・税別)
  },
  course: {
    lessons: 48,           // 全レッスン数
    perMonth: 2,           // 月あたり回数
    hours: 2,              // 1回の時間
    months: 12,            // 期間(か月)
    mentoringMonths: 6,    // 個別伴走(か月)
    capacity: 6            // 1クラスの定員
  }
};
