#!/bin/sh

cat << EOF > public/config.json
{
    "reactAppController": "${REACT_APP_CONTROLLER}",
    "matomoServer": "${MATOMO_SERVER}",
    "matomoSiteID": "${MATOMO_SITE_ID}"
}
EOF

if [[ $SITE_VISIBILITY == "public" ]]
then
cat << EOF > public/robots.txt
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
cat << EOF > public/robots.txt
Sitemap: ${WEB_ROOT}/sitemap-index.xml
User-agent: *
Disallow: /
EOF
fi

exec nginx -g "daemon off;"