#!/bin/sh

export OUTPUT_DIR=$1

cat << EOF > ${OUTPUT_DIR}/config.json
{
    "reactAppController": "${REACT_APP_CONTROLLER}",
    "matomoServer": "${MATOMO_SERVER}",
    "matomoSiteID": "${MATOMO_SITE_ID}"
}
EOF

if [[ "${SITE_VISIBILITY}" == "public" ]]
then
cat << EOF > ${OUTPUT_DIR}/robots.txt
Sitemap: ${WEB_ROOT}/sitemap-index.xml
User-agent: *
Disallow: /account/

User-agent: *
Disallow: /admin/

User-agent: *
Disallow: /nested-accounts/

User-agent: *
Allow: /
EOF
else
cat << EOF > ${OUTPUT_DIR}/robots.txt
Sitemap: ${WEB_ROOT}/sitemap-index.xml
User-agent: *
Disallow: /
EOF
fi

exec nginx -g "daemon off;"