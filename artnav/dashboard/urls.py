from django.urls import re_path

from . import views
 
app_name = 'dashboard'

urlpatterns = [
	re_path(r'^$', views.dashboard, name='dashboard'),
	re_path(r'^add-artwork/$', views.handleAddArtwork, name='add-new-artwork'),
	re_path(r'^add-artist/$', views.handleAddArtistForm, name='add-new-artist')
]