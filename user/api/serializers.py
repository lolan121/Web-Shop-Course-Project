from rest_framework import serializers

class RegisterUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    oldPassword = serializers.CharField(required=True, write_only=True)
    newPassword = serializers.CharField(required=True, write_only=True)