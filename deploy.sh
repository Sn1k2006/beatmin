#!/bin/bash
yarn version --new-version patch && \
yarn build && \
VERSION=`cat package.json | jq -r '.version'` && \
rsync -av --delete ./build/. user@srv.monetize.club:member/ && \
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/8acd13a13989880b861187cca308d627/purge_cache" -H "Authorization: Bearer AS01TbNsZ9CJhTOLRa39ranloigi1eYVXIOgi1Xv" -H "Content-Type:application/json" --data '{"purge_everything":true}' && \
curl -X GET "https://app.monetize.club/version/${VERSION}" && \
printf "\n\nDone in ${SECONDS} sec.\n"
