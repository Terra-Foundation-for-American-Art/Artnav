from django.urls import re_path

from . import views
 
app_name = 'artcollections'

urlpatterns = [
	re_path(r'^$', views.collectionList, name='collection-list'),
	re_path(r'^(?P<collection_slug>[\w\-]+)/$', views.collection, name='collection'),
	re_path(r'^(?P<collection_slug>[\w\-]+)/add-artwork/$', views.handleAddArtwork, name='add-new-artwork'),
	re_path(r'^(?P<collection_slug>[\w\-]+)/add-artist/$', views.handleAddArtist, name='add-new-artist'),	
]