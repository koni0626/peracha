# ペラチャ

**言いたいことを、伝わる一枚へ。**

ペラチャは、AIによる文章改善とペライチ画像生成を備えたリアルタイム業務チャットです。曖昧な依頼や報告を送信前に整え、受信者の確認コストと手戻りを減らします。

## 主な機能

- ユーザー登録・ログイン
- ルーム作成、招待、メンバー管理
- WebSocketによるリアルタイムチャット
- AIによる文章改善と不足情報の確認
- ペライチ画像の生成・添付送信
- スレッド、スタンプ、ファイル共有
- タスク、ノート、業務テーブル

## 技術構成

| ディレクトリ | 内容 |
| --- | --- |
| `backend/` | Python、FastAPI、SQLAlchemy、SQLite、WebSocket |
| `frontend/` | Next.js、React、TypeScript |
| `docs/` | 要件定義書、基本設計書、製品画像 |

## 開発環境

- Python 3.11以上
- Node.js 20以上
- npm

### Backend

```powershell
cd backend
Copy-Item .env.example .env
python -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

OpenAI連携を利用する場合は、`backend/.env` の `OPENAI_API_KEY` を設定してください。ローカルDBは初回起動時に `backend/sapiens_chat.db` として作成されます。

ヘルスチェック:

```powershell
Invoke-RestMethod http://localhost:8000/api/health
```

### Frontend

別のPowerShellを開いて実行します。

```powershell
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## テスト

Backend:

```powershell
cd backend
.\.venv\Scripts\python -m pytest
```

Frontend:

```powershell
cd frontend
npm run typecheck
```

## 環境変数と秘密情報

`.env`、`.env.local`、SQLite DB、アップロードファイルはGitの管理対象外です。実際のAPIキーやシークレットをコミットしないでください。
