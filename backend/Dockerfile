########################
# Stage 1 - Builder
########################
FROM python:3.11-slim as builder

# Set workdir
WORKDIR /app

# Install build deps (needed for compiling heavy libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first
COPY requirements.txt .

# Replace GPU TensorFlow with CPU version (smaller)
RUN sed -i 's/^tensorflow==/tensorflow-cpu==/' requirements.txt || true

# Install all dependencies here
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt


########################
# Stage 2 - Runtime
########################
FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Install only runtime system libs (for OpenCV, matplotlib, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy your app code
COPY . .

# Expose port
EXPOSE 8000

# Start Gunicorn (optimized for small servers)
CMD ["gunicorn", "--bind=0.0.0.0:8000", "--workers=2", "--threads=2", "--timeout=120", "server:app"]
