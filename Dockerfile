FROM python:3.11-slim
WORKDIR /app
COPY backend/ /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["gunicorn", "server:app", "--bind", "0.0.0.0:${PORT}"]
