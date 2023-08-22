from django.urls import re_path

from . import views
 
app_name = 'institutions'

# urlpatterns = [
# 	url(r'^$', views.artworkList, name='artwork-list'),
# 	url(r'^submit-artist/$', views.handleAddArtistForm, name='submit-new-artist'),
# 	url(r'^(?P<artwork_slug>[\w\-]+)/', views.artwork, name='artwork-detail'),
# 	# url(r'^$', views.artworkList, name='artwork-list'),
# 	# artform-artist
# ]