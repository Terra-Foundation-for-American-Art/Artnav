from django.conf.urls import url

from . import views
 
app_name = 'dashboard'

urlpatterns = [
	url(r'^$', views.dashboard, name='dashboard'),
	url(r'^add-artwork/$', views.handleAddArtwork, name='add-new-artwork'),
	url(r'^add-artist/$', views.handleAddArtistForm, name='add-new-artist')
]