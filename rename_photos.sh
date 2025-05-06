#!/usr/bin/env bash
# rename_photos.sh

set -euo pipefail

PHOTO_DIR="photos"
cd "$PHOTO_DIR"

shopt -s nocaseglob       # 让 *.jpg 同时匹配 .jpg .JPG .Jpeg 等
exts=("*.jpeg" "*.jpg")   # 支持的后缀

max_num=0
for f in [0-9][0-9][0-9][0-9].jpeg; do
  [[ -e "$f" ]] || continue
  n="${f%%.jpeg}"
  (( n > max_num )) && max_num=$n
done

temp_suffix=".tmp_rename"
to_rename=()

for pattern in "${exts[@]}"; do
  for f in $pattern; do
    [[ -e "$f" ]] || continue
    if [[ "$f" =~ ^[0-9]{4}\.jpe?g$ ]]; then
      continue                
    fi
    mv "$f" "${f}${temp_suffix}" 
    to_rename+=("${f}${temp_suffix}")
  done
done

for tmp in "${to_rename[@]}"; do
  printf -v new_name "%04d.jpeg" $(( ++max_num ))
  mv "$tmp" "$new_name"
  echo "Renamed $tmp -> $new_name"
done

echo "Done. Total photos renamed: ${#to_rename[@]}"
# to run:
# chmod +x rename_photos.sh
# ./rename_photos.sh