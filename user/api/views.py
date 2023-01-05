from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from user.api.serializers import RegisterUserSerializer, ChangePasswordSerializer


class RegisterUserAPI(GenericAPIView):

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        newUser = User.objects.create_user(username=data["username"], email=data["email"], password=data["password"])
        Token.objects.create(user=newUser)

        return Response({"message": "User created"})

class ChangePasswordAPI(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user = request.user
        print("User pass: " + str(user.check_password(data["oldPassword"])))

        if (user.check_password(data["oldPassword"])):
            user.set_password(data["newPassword"])
            user.save()
            return Response({"message": "Password changed"})
        else:
            return Response({"message": "Wrong old password"})




class GetUserIdAndNameAPI(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def get(self, request):
        user = request.user
        return Response({"userId": user.id, "username": user.username})


