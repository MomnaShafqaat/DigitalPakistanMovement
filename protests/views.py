from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Protest, Support
from .serializers import ProtestSerializer, SupportSerializer

class ProtestListView(generics.ListCreateAPIView):
    queryset = Protest.objects.filter(status='approved')
    serializer_class = ProtestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['city', 'cause', 'status']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_serializer_context(self):
        return {'request': self.request}

class ProtestDetailView(generics.RetrieveAPIView):
    queryset = Protest.objects.all()
    serializer_class = ProtestSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        return {'request': self.request}

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def support_protest(request, protest_id):
    try:
        protest = Protest.objects.get(id=protest_id)
        support, created = Support.objects.get_or_create(
            user=request.user,
            protest=protest
        )
        if created:
            return Response({'message': 'Protest supported successfully'})
        else:
            support.delete()
            return Response({'message': 'Protest support removed'})
    except Protest.DoesNotExist:
        return Response({'error': 'Protest not found'}, status=404)