#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
src_dir="$root_dir/Code Problems"
dst_dir="$root_dir/problems"
templates_dir="$root_dir/templates"

mkdir -p "$dst_dir" "$templates_dir"

slugify() {
  # to lowercase, replace spaces/underscores with dashes, remove non-alphanum/dash
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[ _]+/-/g; s/[^a-z0-9-]+//g; s/-+/-/g; s/^-|-$//g'
}

move_problem() {
  local src_folder="$1"
  local base_name
  base_name="$(basename "$src_folder")"
  local slug
  slug="$(slugify "$base_name")"
  local target="$dst_dir/$slug"

  mkdir -p "$target"
  # Move markdown and solution files preserving names
  find "$src_folder" -maxdepth 1 -type f -print0 | while IFS= read -r -d '' f; do
    mv "$f" "$target/"
  done
}

if [ -d "$src_dir" ]; then
  find "$src_dir" -mindepth 1 -maxdepth 1 -type d -print0 | while IFS= read -r -d '' d; do
    move_problem "$d"
  done
  # Remove the original container directory if empty after move
  rmdir "$src_dir" 2>/dev/null || true
fi

# Copy the interview template into templates
cp -f "$root_dir/INTERVIEW_README_TEMPLATE.md" "$templates_dir/INTERVIEW_README_TEMPLATE.md"

echo "Restructure complete. Problems in: $dst_dir, template in: $templates_dir"
