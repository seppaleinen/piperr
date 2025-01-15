FROM python:alpine AS base

ENV PYTHONUNBUFFERED=1
ENV TZ=Europe/Stockholm
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN mkdir /install
WORKDIR /install

RUN \
 apk update && \
 apk add --no-cache tzdata uv

ADD pyproject.toml .

RUN uv pip install -r pyproject.toml --system

ADD . /install

ENTRYPOINT ["hypercorn"]
CMD ["agent:asgi_app", "--bind", "0.0.0.0:8000"]
