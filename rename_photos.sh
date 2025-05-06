#!/usr/bin/env bash
# rename_photos.sh

set -euo pipefail

PHOTO_DIR="photos"
cd "$PHOTO_DIR"

max_num=0
for f in [0-9][0-9][0-9][0-9].jpeg; do
  [[ -e "$f" ]] || continue
  num="${f%%.jpeg}"
  (( num > max_num )) && max_num=$num
done

temp_suffix=".tmp_rename"
to_rename=()

for f in *.jpeg; do
  if [[ "$f" =~ ^[0-9]{4}\.jpeg$ ]]; then
    continue
  fi
  mv "$f" "${f}${temp_suffix}"
  to_rename+=("${f}${temp_suffix}")
done

for tmp in "${to_rename[@]}"; do
  printf -v new_name "%04d.jpeg" $(( ++max_num ))
  mv "$tmp" "$new_name"
  echo "Renamed $tmp -> $new_name"
done

# to run:
# chmod +x rename_photos.sh
# ./rename_photos.sh