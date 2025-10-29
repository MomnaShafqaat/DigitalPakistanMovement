from rest_framework import serializers
from .models import Protest, Support

class ProtestSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    supporter_count = serializers.SerializerMethodField()
    is_supported = serializers.SerializerMethodField()
    
    class Meta:
        model = Protest
        fields = '__all__'
        read_only_fields = ('organizer', 'status', 'is_verified', 'views_count')
    
    def get_supporter_count(self, obj):
        return obj.supports.count()
    
    def get_is_supported(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Support.objects.filter(protest=obj, user=request.user).exists()
        return False
    
    def create(self, validated_data):
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)

class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = '__all__'
        read_only_fields = ('user',)