tarball=$(npm list --depth 0 | sed 's/@/-/g; s/ .*/.tgz/g; 1q;');
mkdir package;
tar -xzf $tarball -C package;
cp -r dist/* package;
zip -@r package;
rm -rf dist package
rm $tarball