#!/usr/bin/env bash
# rename_photos.sh - Rename photos as 0001.jpeg, 0002.jpeg in a shuffled order based on hash

set -euo pipefail

PHOTO_DIR="photos"
cd "$PHOTO_DIR"

shopt -s nocaseglob

exts=("*.jpg" "*.jpeg")
temp_suffix=".tmp_rename"

# Step 1: Collect files
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

# Step 2: Temporarily rename to avoid overwrite
for f in "${all_files[@]}"; do
  mv "$f" "$f$temp_suffix"
done

# Step 3: Sort by md5 hash of original filename
sorted_files=()
for f in *"$temp_suffix"; do
  hash=$(echo "$f" | md5)  # macOS uses `md5`, not `md5sum`
  sorted_files+=("$hash $f")
done

IFS=$'\n' sorted_files_sorted=($(printf "%s\n" "${sorted_files[@]}" | sort))
unset IFS

# Step 4: Rename based on sorted order
i=1
for line in "${sorted_files_sorted[@]}"; do
  f=$(echo "$line" | cut -d' ' -f2-)
  printf -v new_name "%04d.jpeg" "$i"
  mv "$f" "$new_name"
  echo "Renamed $f -> $new_name"
  ((i++))
done

echo "Done. Total photos renamed: $((i - 1))"

# to run this script:

# chmod +x rename_photos.sh
# ./rename_photos.sh