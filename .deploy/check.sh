#!/bin/sh 

UPSTREAM=${1:-'origin/master'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "$(date +%FT%T) Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "$(date +%FT%T) Need to pull"
    git pull
#    docker-compose -f ./api/docker-compose.yml up --build -d
elif [ $REMOTE = $BASE ]; then
    echo "$(date +%FT%T) Need to push"
else
    echo "$(date +%FT%T) Diverged"
fi

