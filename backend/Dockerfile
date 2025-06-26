FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run DB setup before the server
CMD ["sh", "-c", "python init_db.py && flask run --host=0.0.0.0"]

ENTRYPOINT ["sh", "entrypoint.sh"]
