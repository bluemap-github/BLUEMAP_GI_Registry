FROM python:latest

WORKDIR /usr/src/app

COPY . .

RUN pip install -r req.txt

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "S100Registry.wsgi:application"]

EXPOSE 8000
