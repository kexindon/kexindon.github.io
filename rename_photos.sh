#!/usr/bin/env bash
# rename_photos.sh - Shuffle and rename all photos to 0001.jpeg, 0002.jpeg, ...

set -euo pipefail

PHOTO_DIR="photos"
cd "$PHOTO_DIR"

shopt -s nocaseglob

exts=("*.jpg" "*.jpeg")
temp_suffix=".tmp_rename"

all_files=()
for pattern in "${exts[@]}"; do
  for f in $pattern; do
    [[ -f "$f" ]] && all_files+=("$f")
  done
done

if [[ ${#all_files[@]} -eq 0 ]]; then
  echo "No image files found."
  exit 0
fi

shuffled=($(printf '%s\n' "${all_files[@]}" | gshuf))

for f in "${shuffled[@]}"; do
  mv "$f" "${f}${temp_suffix}"
done

i=1
for f in *${temp_suffix}; do
  printf -v new_name "%04d.jpeg" "$i"
  mv "$f" "$new_name"
  echo "Renamed $f -> $new_name"
  ((i++))
done

echo "Done. Total photos renamed: $((i - 1))"


# to run this script:

# chmod +x rename_photos.sh
# ./rename_photos.sh