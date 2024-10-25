FROM python:3.13-slim

WORKDIR /usr/src/app

COPY req.txt .

RUN pip install --no-cache-dir -r req.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "S100Registry.wsgi:application"]

EXPOSE 8000
