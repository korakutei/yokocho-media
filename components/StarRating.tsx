// 横丁詳細ページの「こんな過ごし方に向いている」指標(5段階)の表示用。
// 横丁カードからは星評価を外した(改善指示書「星評価はやらない」)ため、VenueExplorerから独立させている。
export default function StarRating({ value }: { value: number }) {
  return (
    <span className="venue-star-rating" aria-label={`交流度 5段階中${value}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "star-filled" : "star-empty"}>
          ★
        </span>
      ))}
    </span>
  );
}
