from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'role', 'city', 'bio', 'phone_number',
            'organization_name', 'contact_person', 'cause_focus', 'mission',
            'organization_role_type', 'previous_activities',
            'profile_image', 'banner_image',
            'facebook_url', 'twitter_url', 'instagram_url', 'website_url',
            'responsible_person', 'undertaking_agreed'
        )
        read_only_fields = ('id', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, required=False, default='user')
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'city', 'phone_number', 'role')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        # Remove password2 from validated data
        validated_data.pop('password2')
        
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            city=validated_data.get('city', ''),
            phone_number=validated_data.get('phone_number', '')
        )
        # Set role if provided (defaults to 'user')
        role = validated_data.get('role')
        if role:
            user.role = role
            user.save(update_fields=['role'])
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to login with provided credentials.')
        else:
            raise serializers.ValidationError('Must include username and password.')
        
        return data