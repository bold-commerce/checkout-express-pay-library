#!/usr/bin/env bash

set -ex

cd "$( dirname "${BASH_SOURCE[0]}" )"/..

version=$1

if [ -z "$version" ]; then
  echo "You must specify the version, i.e. './bump-fe.sh 0.51.2'"
  exit 1
fi

git checkout main
git pull
git checkout -b "bump-v${version}"

yarn remove @boldcommerce/checkout-frontend-library

yarn add --peer "@boldcommerce/checkout-frontend-library@${version}"

yarn add "@boldcommerce/checkout-frontend-library@${version}"

git add yarn.lock package.json

git commit -m "Bump Frontend lib version to ${version}"

git push
