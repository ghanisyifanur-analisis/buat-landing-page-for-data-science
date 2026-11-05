# Multi-stage production Dockerfile for Data Science Model Inference Service
FROM python:3.11-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-warn-script-location -r requirements.txt

# Final lightweight runner stage
FROM python:3.11-slim as runner

WORKDIR /app

# Create non-root user for security hardening
RUN groupadd -g 10001 dsgroup && \
    useradd -u 10001 -g dsgroup -m dsuser

COPY --from=builder /root/.local /home/dsuser/.local
COPY --chown=dsuser:dsgroup . /app

ENV PATH=/home/dsuser/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PORT=8080

USER 10001:10001

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["python", "-m", "http.server", "8080"]
