from django.urls import re_path

from . import views
 
app_name = 'profiles'

urlpatterns = [
	re_path(r'^$', views.profile, name='user-profile'),
]