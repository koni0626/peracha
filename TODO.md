# TODO

- [x] 通常ユーザーのメッセージ投稿レート制限

## MVP Core

- [x] FastAPIプロジェクトの作成
- [x] ヘルスチェックAPI
- [x] Next.jsプロジェクトの作成
- [x] `.env.example` の作成
- [x] Alembic初期マイグレーション
- [x] ユーザー登録 / ログイン
- [x] ルーム作成
- [x] ルームメッセージ保存
- [x] WebSocketで `message.created` を配信
- [x] フロントエンドでメッセージをリアルタイム反映
- [x] ルーム招待API
- [x] 招待トークン受け入れ
- [x] 招待中一覧 / 権限選択 / 取り消し
- [x] メッセージ投稿の冪等性
- [x] WebSocket再接続時の差分取得
- [x] WebSocket再接続時の差分取得の強化
- [x] WebSocket接続数制限 / typingイベント制限

## AI Facilitator

- [x] 曖昧語辞書
- [x] ルールベース診断
- [x] `POST /api/diagnoses`
- [x] `diagnosis.completed` イベント
- [x] 関連候補提示
- [x] ルーム内の文脈検索API / UI
- [x] 動的フォーム生成
- [x] タスク候補生成
- [x] OpenAI API連携
- [x] 診断履歴画面
- [x] 改善文のクリップボードコピー

## Later

- [x] 外部エージェントREST API
- [x] 外部エージェント作業依頼API
- [x] タスク作成 / 一覧 / 更新API
- [x] タスクイベント `task.created` / `task.updated`
- [x] APIクライアント作成
- [x] APIトークン発行 / 失効
- [x] 外部APIスコープ判定
- [x] 外部API監査ログ
- [x] Webhook
- [x] 今ここボード
- [x] 今ここボード生成提案
- [x] 論点ケア
- [x] Redis Pub/Subによる複数サーバー対応
- [x] 添付資料リンクの送信 / 表示 / 外部API連携
- [x] ログアウト
- [x] 招待URLの自動入力
- [x] SMTP設定時の招待メール送信
- [x] ルームメンバー一覧API / UI
- [x] ルームメンバー権限変更 / 削除
- [x] 動的フォーム回答による再診断
- [x] 改善文の下書き反映
- [x] 主要API回帰テストのpytest化
- [x] FastAPI lifespan移行
- [x] 画面からのタスクステータス更新 / 進捗メモ保存
- [x] 外部APIレート制限
- [x] AI診断のタスク候補からのタスク作成
