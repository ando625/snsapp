# backend/python/sentiment.py
import sys
import io

#文字化け対策（標準出力をUTF-8に固定する）
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_sentiment(text):
    positive_words = ["嬉しい", "楽しい", "最高", "幸せ", "やった", "大好き", "面白い", "うれしい", "たのしい"]
    negative_words = ["悲しい", "辛い", "最悪", "嫌い", "疲れた", "ダメ", "しんどい", "ムリ"]

    score = 50
    
    # 文章の中に単語が含まれているかチェック
    for word in positive_words:
        if word in text:
            score += 10
    for word in negative_words:
        if word in text:
            score -= 10

    # 0〜100の間に収める
    return max(0, min(100, score))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # 🪄 Laravelから届いた文字を読み込む
        input_text = sys.argv[1]
        result = analyze_sentiment(input_text)
        print(result)
    else:
        print(50)
        
