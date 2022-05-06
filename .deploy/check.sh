#!/bin/bash
#
# Helps redeploy services when there are git remote changes
#
# @example: sudo ./check.sh origin/master --force

FETCH=$(git fetch)
UPSTREAM=${1:-'origin/master'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $BASE ] || [ "$2" = "--force"]; then
    echo "$(date +%FT%T) Need to pull"
    git pull
    docker-compose -f ${BASH_SOURCE%/*}/api/docker-compose.yml up --build -d
elif [ $LOCAL = $REMOTE ]; then
    echo "$(date +%FT%T) Up-to-date"
elif [ $REMOTE = $BASE ]; then
    echo "$(date +%FT%T) Need to push"
else
    echo "$(date +%FT%T) Diverged"
fi

