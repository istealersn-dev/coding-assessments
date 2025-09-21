#!/usr/bin/env bash
set -euo pipefail

base="problems"
mkdir -p "$base/_by-level/junior" "$base/_by-level/mid" "$base/_by-level/senior"

move() { [ -d "$base/$1" ] && mkdir -p "$base/_by-level/$2" && git mv "$base/$1" "$base/_by-level/$2/" || true; }

# Junior (1–3 years): straightforward CRUD/UI basics, simple logic
move futurereadinglistm junior
move crmsystemm junior
move taskmanagementsystem junior
move simplecloudstorage2m junior

# Mid (3–6 years): deeper state, multiple levels, moderate complexity
move taskmanagementsystem2m mid
move simplecloudstorage3m mid
move librarymanagementsystem mid
move pokebowlrestaurant mid
move workhoursregister mid

# Senior (6+ years): data modeling, edge cases, scalability/robustness
move inmemorydatabase senior
move simplebankingsystem1m senior
move taskmanagementsystem3m senior

echo "Categorization complete under $base/_by-level/{junior,mid,senior}"

