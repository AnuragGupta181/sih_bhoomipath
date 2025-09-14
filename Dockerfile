# Use Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy backend code
COPY backend/ /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Start Gunicorn
CMD ["gunicorn", "server:app", "--bind", "0.0.0.0:${PORT}"]
