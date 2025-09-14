FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Copy backend
COPY backend/ /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Railway sets $PORT automatically
ENV PORT=8000

# Start gunicorn, binding to Railway's $PORT
CMD ["sh", "-c", "gunicorn server:app --bind 0.0.0.0:${PORT}"]
