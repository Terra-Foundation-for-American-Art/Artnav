from django.conf.urls import url

from . import views
 
app_name = 'artcollections'

urlpatterns = [
	url(r'^$', views.collectionList, name='collection-list'),
	url(r'^(?P<collection_slug>[\w\-]+)/$', views.collection, name='collection'),
	url(r'^(?P<collection_slug>[\w\-]+)/add-artwork/$', views.handleAddArtwork, name='add-new-artwork'),
	url(r'^(?P<collection_slug>[\w\-]+)/add-artist/$', views.handleAddArtist, name='add-new-artist'),	
]