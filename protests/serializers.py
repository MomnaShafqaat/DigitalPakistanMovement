from rest_framework import serializers
from .models import Protest, Support
from django.utils import timezone

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
    
    def validate(self, attrs):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError('Authentication required.')

        user = request.user
        if getattr(user, 'role', None) != 'organizer':
            raise serializers.ValidationError('Only organizers can create protests.')

        missing_fields = []
        required_profile_fields = ['city', 'phone_number', 'bio']
        for field in required_profile_fields:
            if not getattr(user, field, None):
                missing_fields.append(field)
        if missing_fields:
            raise serializers.ValidationError({
                'profile': f"Please complete your profile before creating a protest. Missing: {', '.join(missing_fields)}"
            })

        # Ensure start is before end and in the future
        start = attrs.get('start_datetime')
        end = attrs.get('end_datetime')
        if start and end and start >= end:
            raise serializers.ValidationError({'end_datetime': 'End time must be after start time.'})
        if start and start < timezone.now():
            raise serializers.ValidationError({'start_datetime': 'Start time must be in the future.'})
        return attrs

    def create(self, validated_data):
        validated_data['organizer'] = self.context['request'].user
        # Default organizer contact from profile if not provided
        if not validated_data.get('organizer_contact'):
            validated_data['organizer_contact'] = validated_data['organizer'].phone_number or ''
        return super().create(validated_data)

class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = '__all__'
        read_only_fields = ('user',)