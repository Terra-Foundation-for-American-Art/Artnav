from django.conf.urls import url

from . import views

app_name = 'gallery'

urlpatterns = [
  url(r'^(?P<artwork_slug>[\w\-]+)/$', views.artmap, name='artmap'),
]
