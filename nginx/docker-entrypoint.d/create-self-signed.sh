#/bin/sh

if [ ! -f /etc/nginx/ssl/my-site.com.crt ]; then
	openssl req -newkey rsa:2048 -nodes -keyout /etc/nginx/ssl/my-site.com.key -x509 -days 365 -out /etc/nginx/ssl/my-site.com.crt -subj "/C=US/ST=EXAMPLE/L=EXAMPLE/O=EXAMPLE/OU=/CN=EXAMPLE/emailAddress=example@example.org"
fi


