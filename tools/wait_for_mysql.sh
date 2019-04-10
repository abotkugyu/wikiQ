#!/bin/bash

set -e

host="$1"
user="$2"
pass="$3"
port="$4"
cmd="${@:5}"

echo "Waiting for mysql"
until mysql -h"$host" -P"$port" -u"$user" -p"$pass" &> /dev/null
do
  echo "."
  sleep 1
done

echo -e "\nmysql ready"

exec $cmd
