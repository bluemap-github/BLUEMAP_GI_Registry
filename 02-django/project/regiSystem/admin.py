from django.contrib import admin
from .models import ExampleModel, Circle, Rectangle
# Register your models here.


admin.site.register(ExampleModel)
admin.site.register(Circle)
admin.site.register(Rectangle)