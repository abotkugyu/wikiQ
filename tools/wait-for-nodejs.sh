#!/bin/bash

echo "Waiting for nodejs"
until ping nodejs >/dev/null 2>&1;
do 
  echo "."
  sleep 1
done

echo -e "\nnodejs ready"
