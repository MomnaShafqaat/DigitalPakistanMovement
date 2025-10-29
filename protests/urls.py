from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProtestListView.as_view(), name='protest-list'),
    path('<int:pk>/', views.ProtestDetailView.as_view(), name='protest-detail'),
    path('<int:protest_id>/support/', views.support_protest, name='support-protest'),
]