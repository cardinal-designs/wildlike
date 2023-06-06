#!/bin/bash

# set git hooks path to our source controlled directory
#git config core.hooksPath .githooks

# .env boilerplate
read -r -d '' env_boilerplate <<- EOM
URL=ylang2-3.myshopify.com
PASSWORD=XXXXXXXXXXXXXXXXXXXXXXX
THEME_ID=XXXXXXXXXXXX
EOM

# create boilerplate .env file
if ! test -f ".env"; then
  echo "$env_boilerplate" > ".env"
fi