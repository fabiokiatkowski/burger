FROM tomcat
MAINTAINER Fabio Kiatkowski <xolla@xolla.com.br>
COPY /build/ /usr/local/tomcat/webapps/burger
RUN chmod 775 -R /usr/local/tomcat/webapps