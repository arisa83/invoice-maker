# 請求書つくる君

シンプルで美しい請求書をブラウザ上で作成・PDF保存できるWebアプリケーションです。

## ✨ 特徴
- **リアルタイムプレビュー**: 入力した内容が即座にプレビューに反映されます。
- **PDF保存**: ボタン一つでA4サイズのPDFとしてダウンロードできます。
- **レスポンシブ対応**: PCでもスマホでも快適に操作できます。
- **データ保持**: ブラウザを閉じても入力内容が消えません（ローカルストレージ使用）。

## 🚀 ローカルでの実行方法
ご自身のパソコンで動かす場合の手順です。

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   表示されるURL（例: `http://localhost:5174`）をブラウザで開いてください。

## 🌐 ネット上への公開方法 (推奨: Vercel)
最も簡単かつ無料で公開できる **Vercel** を使う方法がおすすめです。

### 手順
1. **GitHubにコードをアップロード**
   - このプロジェクトをGitHubのリポジトリにプッシュします。

2. **Vercelに登録・連携**
   - [Vercel](https://vercel.com) にアクセスし、GitHubアカウントでログインします。

3. **プロジェクトのインポート**
   - "Add New" -> "Project" をクリック。
   - 先ほどアップロードしたGitHubリポジトリを選択して "Import" をクリック。

4. **デプロイ**
   - 設定は自動で認識されるため、そのまま "Deploy" ボタンをクリックします。
   - 1分ほどで公開URLが発行され、誰でもアクセスできるようになります。

## 🔥 Firebase Hosting での公開方法
Firebaseを使って公開したい場合の手順です。

1. **ツールのインストール**
   ```bash
   npm install -g firebase-tools
   ```

2. **ログイン**
   ```bash
   firebase login
   ```
   ブラウザが開くので、Googleアカウントでログインします。

3. **初期設定**
   ```bash
   firebase init hosting
   ```
   質問には以下のように答えてください：
   - **New project** を選択（または既存プロジェクト）
   - What do you want to use as your public directory? -> `invoice-maker` (元のdistフォルダの名前を変えた場合) または `dist` と入力
   - Configure as a single-page app? -> `y` (Yes)
   - Set up automatic builds and deploys with GitHub? -> `n` (No, 手動でやる場合)

4. **デプロイ（公開）**
   ```bash
   npm run build
   firebase deploy
   ```
   これで公開完了です！次回からは変更後に `npm run build && firebase deploy` を実行するだけで更新できます。

## 📦 もっと簡単！Netlify Drop での公開方法 (推奨)
コマンド操作が不要で、ファイルをドラッグ＆ドロップするだけで公開できる方法です。

1. **ビルド（公開用ファイルの作成）**
   ご自身のPCで以下のコマンドを実行します。
   ```bash
   npm run build
   ```
   すると、プロジェクトフォルダ内に `dist` というフォルダが作成されます（これを `invoice-maker` という名前に変更してもOKです）。

2. **アップロード**
   [Netlify Drop](https://app.netlify.com/drop) にアクセスします。
   画面上のエリアに、フォルダ（`dist` や `invoice-maker`）をそのままドラッグ＆ドロップします。

3. **完了**
   これだけで公開完了です！発行されたURLですぐにアクセスできます。

## 🔄 公開後の更新手順
サービスの内容を修正したり、機能を追加したい場合の手順です。

1. **ローカルで修正**
   - コードを編集し、`npm run dev` で動作確認します。

2. **GitHubへプッシュ**
   - 変更内容をGitHubにコミット＆プッシュします。
   ```bash
   git add .
   git commit -m "機能追加: 〇〇を変更"
   git push origin main
   ```

3. **自動更新**
   - GitHubへのプッシュを検知して、Vercelが**自動的に新しいバージョンをデプロイ**してくれます。
   - 追加の操作は不要です。数分後には公開サイトが更新されます。

## 💡 その他のカスタマイズ
### アフィリエイトリンクの設置
将来的にアフィリエイトリンクやバナーを設置したい場合は、以下のファイルを編集することで可能です。
- **場所**: `src/App.tsx` (画面全体のレイアウト) や `src/components/InvoiceForm.tsx` (編集画面) など。
- **方法**: 通常の `<a href="...">` タグやバナー画像を配置するだけです。
