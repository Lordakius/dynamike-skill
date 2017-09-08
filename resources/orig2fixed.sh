#!/usr/bin/env bash

echo "#"
echo "# usage: run this script beside the orig/ and fixed/ folders!"
echo "#"

echo "1. cleanup fixed folder"
rm -rf fixed/*

echo "2. docker pull"
docker pull jrottenberg/ffmpeg

echo "2. docker run"
for filename in orig/*.MP3; do
  echo "processing $filename"
  target=fixed/$(basename "$filename")
  target2=${target// /_} #replace spaces with underscores
  echo "target $target2"
  #exit 1
  docker run -v `pwd`:`pwd` -w `pwd` jrottenberg/ffmpeg -i "$filename" -ar 16k -b:a 48k "$target2"
done
