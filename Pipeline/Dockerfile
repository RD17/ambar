FROM python:3.6.6-stretch

RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    imagemagick \
    libleptonica-dev \
    tesseract-ocr \
    tesseract-ocr-dev \
    libtesseract3 \
    libtesseract-dev \
    tesseract-ocr-eng \
    tesseract-ocr-rus \
    tesseract-ocr-ita \
    tesseract-ocr-deu \
    tesseract-ocr-fra \
    tesseract-ocr-spa \
    tesseract-ocr-nld \
    tesseract-ocr-pol \
    default-jre \
    default-jdk \
    readpst
    
# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install git+git://github.com/kivy/pyjnius.git

RUN mv jars/* /usr/lib/jvm/default-java/jre/lib/ext/

RUN mkdir /pst-temp

ENV JAVA_HOME /usr/lib/jvm/default-java

CMD python ./pipeline.py

HEALTHCHECK --interval=5s --timeout=30s --retries=50 \
  CMD if (pidof -x python > /dev/null) then (exit 0) else (exit 1) fi