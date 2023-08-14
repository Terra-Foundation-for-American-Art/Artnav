from django.urls import re_path

from . import views

app_name = 'gallery'

urlpatterns = [
  re_path(r'^(?P<artwork_slug>[\w\-]+)/?$', views.artmap, name='artmap'),
]
