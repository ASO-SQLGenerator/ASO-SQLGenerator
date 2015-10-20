#!/bin/bash
set -e
rm -rf public || exit 0;
mkdir public

npm run release

cd public

git init
git add .
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@github.com/ASO-SQLGenerator/ASO-SQLGenerator.github.io.git" master:master > /dev/null 2>&1