FROM nginx:latest

ARG BASE_API_URL
ARG TERMS_URL

COPY ./dist/zscore_console/browser /usr/share/nginx/html
COPY ./docker/nginx.conf  /etc/nginx/conf.d/default.conf

COPY ./docker/entrypoint.sh /usr/local/app/entrypoint.sh
COPY ./docker/generate-config.sh /usr/local/app/generate-config.sh

RUN chmod +x /usr/local/app/entrypoint.sh
RUN chmod +x /usr/local/app/generate-config.sh

EXPOSE 80
ENTRYPOINT [ "/usr/local/app/entrypoint.sh" ]
