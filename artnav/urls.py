from django.urls import include, re_path
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
	re_path(r'^$', dashboard),
  re_path(r'^artmapper/$', TemplateView.as_view(template_name='spa.html'), name='artmapper'),
	re_path(r'^api/', include(router.urls)),
	re_path(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
  re_path(r'^admin/?', admin.site.urls),
  re_path(r'^profile/', include('artnav.profiles.urls')),
  re_path(r'^accounts/', include('django.contrib.auth.urls')),
  re_path(r'^dashboard/?', include('artnav.dashboard.urls')),
  re_path(r'^collections/', include('artnav.artcollections.urls')),
  re_path(r'^art/', include('artnav.artworks.urls')),
  re_path(r'^gallery/', include('artnav.gallery.urls')),
  re_path(r'^s3-sign/$', s3SignView.as_view(), name='s3-sign'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
