from django.urls import re_path

from . import views

app_name = 'artworks'

urlpatterns = [
	re_path(r'^$', views.artworkList, name='artwork-list'),
	re_path(r'^submit-artist/$', views.handleAddArtistForm, name='submit-new-artist'),
	re_path(r'^(?P<artwork_slug>[\w\-]+)/?$', views.artwork, name='artwork-detail'),
  	re_path(r'^(?P<artwork_slug>[\w\-]+)/preview/$', views.artworkPreview, name='artwork-preview'),
	re_path(r'^(?P<artwork_slug>[\w\-]+)/add-to-collection', views.addExistingArtworkToCollection, name='artwork-add-to-collection'),
]
