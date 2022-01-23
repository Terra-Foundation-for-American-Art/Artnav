from django.conf.urls import url

from . import views

app_name = 'artworks'

urlpatterns = [
	url(r'^$', views.artworkList, name='artwork-list'),
	url(r'^submit-artist/$', views.handleAddArtistForm, name='submit-new-artist'),
	url(r'^(?P<artwork_slug>[\w\-]+)/?$', views.artwork, name='artwork-detail'),
  	url(r'^(?P<artwork_slug>[\w\-]+)/preview/$', views.artworkPreview, name='artwork-preview'),
	url(r'^(?P<artwork_slug>[\w\-]+)/add-to-collection', views.addExistingArtworkToCollection, name='artwork-add-to-collection'),
	# url(r'^$', views.artworkList, name='artwork-list'),
	# artform-artist
]
