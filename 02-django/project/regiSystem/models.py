from django.db import models

class Shape(models.Model):
    color = models.CharField(max_length=50)

    class Meta:
        abstract = True

class Rectangle(Shape):
    width = models.FloatField()
    height = models.FloatField()

class Circle(Shape):
    radius = models.FloatField()

class ExampleModel(models.Model):
    circle= models.ForeignKey(Circle, on_delete=models.CASCADE)