from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import BlogPost, Comment, Like
from .serializers import BlogPostSerializer, CommentSerializer, LikeSerializer

class BlogPostListView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_serializer_context(self):
        return {'request': self.request}

class BlogPostDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Comment.objects.filter(
            blog_post_id=self.kwargs['blog_post_id'],
            is_approved=True
        )
    
    def get_serializer_context(self):
        return {'request': self.request}

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_blog_post(request, blog_post_id):
    try:
        blog_post = BlogPost.objects.get(id=blog_post_id)
        like, created = Like.objects.get_or_create(
            user=request.user,
            blog_post=blog_post
        )
        if created:
            return Response({'message': 'Post liked successfully'})
        else:
            like.delete()
            return Response({'message': 'Post like removed'})
    except BlogPost.DoesNotExist:
        return Response({'error': 'Blog post not found'}, status=404)