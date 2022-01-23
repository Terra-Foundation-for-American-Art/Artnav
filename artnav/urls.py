from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin

from django.views.generic import TemplateView

from rest_framework import routers

from artnav.dashboard.views import dashboard, RecentArtworksViewSet, RecentCollectionsViewSet, AllArtworksViewSet, AllCollectionsViewSet
from artnav.artworks.views import ArtistViewSet, ArtworkViewSet, ArtPointViewSet, s3SignView
from artnav.artcollections.views import ArtCollectionViewSet
from artnav.profiles.views import UserViewSet


router = routers.DefaultRouter()
# ro_router = routers.SimpleRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'art', ArtworkViewSet)
router.register(r'points', ArtPointViewSet)
router.register(r'artcollections', ArtCollectionViewSet)
router.register(r'recent-artwork', RecentArtworksViewSet, 'recent-artwork')
router.register(r'recent-collections', RecentCollectionsViewSet, 'recent-collections')
router.register(r'users', UserViewSet)
router.register(r'all-artwork', AllArtworksViewSet, 'all-artwork')
router.register(r'all-collections', AllCollectionsViewSet, 'all-collections')

urlpatterns = [
	url(r'^$', dashboard),
  url(r'^artmapper/$', TemplateView.as_view(template_name='spa.html'), name='artmapper'),
	url(r'^api/', include(router.urls)),
	url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
  url(r'^admin/?', admin.site.urls),
  url(r'^profile/', include('artnav.profiles.urls')),
  url(r'^accounts/', include('django.contrib.auth.urls')),
  url(r'^dashboard/?', include('artnav.dashboard.urls')),
  url(r'^collections/', include('artnav.artcollections.urls')),
  url(r'^art/', include('artnav.artworks.urls')),
  url(r'^gallery/', include('artnav.gallery.urls')),
  url(r'^s3-sign/$', s3SignView.as_view(), name='s3-sign'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
