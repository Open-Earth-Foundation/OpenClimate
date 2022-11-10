CONTAINER_ALREADY_STARTED="/CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
    touch $CONTAINER_ALREADY_STARTED
    echo "-- First container startup --"
    bash -c "./scripts/wait-for-it.sh localhost:3100 -s -t 60 -- npm run first-time-setup"
else
    echo "-- Not first container startup --"
    printenv command
fi
