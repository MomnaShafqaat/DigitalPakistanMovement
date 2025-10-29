from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/protests/', include('protests.urls')),
    # path('api/awareness/', include('awareness.urls')),
       path('api/awareness/', include('awareness.urls')),  # Add this line
    # Allauth URLs (keep them separate)
    path('accounts/', include('allauth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)