#!/usr/bin/env bash
set -euo pipefail

base="problems/_by-level"

# key|New Name pairs (portable without bash associative arrays)
MAP="
crmsystemm|CRM System
futurereadinglistm|Future Reading List
postingapplication1m|Posting Application
simplecloudstorage2m|Simple Cloud Storage (L2)
taskmanagementsystem|Task Management System

librarymanagementsystem|Library Management System
pokebowlrestaurant|Pokebowl Restaurant
simplecloudstorage3m|Simple Cloud Storage (L3)
taskmanagementsystem2m|Task Management System (L2)
workhoursregister|Work Hours Register

inmemorydatabase|In-Memory Database
simplebankingsystem1m|Simple Banking System
taskmanagementsystem3m|Task Management System (L3)
"
for level in junior mid senior; do
  for d in "$base/$level"/*; do
    [ -d "$d" ] || continue
    key="$(basename "$d")"
    new="$(printf "%s" "$MAP" | awk -F'|' -v k="$key" '$1==k{print $2}')"
    if [ -n "$new" ]; then
      git mv "$d" "$base/$level/$new"
    fi
  done
done

echo "Renamed folders to readable titles."
