#!/bin/sh

set -e 

export NODE_ENV=production
npm run migrate_up_all 
npm run start