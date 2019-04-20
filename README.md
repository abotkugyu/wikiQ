# wikiQ

### shuld npm & docker

### constitution
```
# docker 
run nginx nodejs mysql

# nodejs
data/nodejs/app.jp
↓
data/nodejs/view/build

# mysql
data/mysql
#default auth info (need mysql client)
mysql -hmysql -uroot -proot -p3306

# nginx
not use
```

```
develop
	local	-	nodejs	
			↓↑	
	docker 	-	mysql(ランキング、ユーザーデータ）	
		    -	nginx	

product				
	docker 	-	nginx	
			↓（リバースプロキシ）	
		    -	nodejs
			↓↑	
		    -	mysql(ランキング、ユーザーデータ）
```