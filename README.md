# wikiQ

- このアプリはwikipediaからランダム検索で記事を持ってきて、内容のタイトルを答えるアプリです。

### dev構成
```
	local	 -	nodejs	
		↓↑	
	docker -	mysql(ランキング、ユーザーデータ）	
		     -	nginx
```

### prod構成(想定)
```
	docker - nginx	
			↓（リバースプロキシ）	
	docker -	nodejs
			↓↑	
	docker -	mysql(ランキング、ユーザーデータ）
```

### 開発時
```
#webpack nodejs/srcを監視
npm run watch

#nodejs (todo:foreverに)
cd data/nodejs && node app.js
```

###
```
todo:
- node起動をforeverに
- room機能
- room_id毎に多人数でsocketを分ける
- ランキング
- wikipedia記事のparseの改善
- テスト
```

### その他
```
・開発をdockerで構成しないのはwebpackなどのhot reloadやfile watchに適していないため。
```