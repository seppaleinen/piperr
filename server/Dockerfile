FROM python:alpine AS base

ENV PYTHONUNBUFFERED=1
ENV TZ=Europe/Stockholm
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN mkdir /install
WORKDIR /install

RUN \
 apk update && \
 apk add --no-cache tzdata

ADD requirements.txt .

RUN pip3 install -r requirements.txt

ADD . /install

ENTRYPOINT ["python3", "-m"]
CMD ["flask", "--app", "main.py", "run", "--host=0.0.0.0"]
