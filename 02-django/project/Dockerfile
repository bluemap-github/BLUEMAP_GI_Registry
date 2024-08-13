FROM python:3.9.13

WORKDIR /usr/src/app

COPY . .

RUN pip install -r req.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000