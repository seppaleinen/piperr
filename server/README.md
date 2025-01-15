# Server

```bash
# Install stuff
uv pip install -r pyproject.toml

# Run server locally
hypercorn main:asgi_app --bind 0.0.0.0:8000 --reload

hypercorn agent:asgi_app --bind 0.0.0.0:8000 --reload
```