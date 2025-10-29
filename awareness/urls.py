from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.BlogPostListView.as_view(), name='blogpost-list'),
    path('posts/<int:pk>/', views.BlogPostDetailView.as_view(), name='blogpost-detail'),
    path('posts/<int:blog_post_id>/comments/', views.CommentListView.as_view(), name='comment-list'),
    path('posts/<int:blog_post_id>/like/', views.like_blog_post, name='like-blogpost'),
]