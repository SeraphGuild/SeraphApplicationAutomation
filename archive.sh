#!/bin/bash
tarball=$(npm list --depth 0 | sed 's/@/-/g; s/ .*/.tgz/g; 1q;')
mkdir package
tar -xzf $tarball
cp -r dist/* package
# pushd package
# zip -rq ../package.zip ./*
# popd
# rm -rf dist package $tarball