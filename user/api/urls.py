from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from user.api.views import RegisterUserAPI, ChangePasswordAPI, GetUserIdAndNameAPI

urlpatterns = [
    path('api/v1/register/', RegisterUserAPI.as_view()),
    path('api/v1/login/', obtain_auth_token),
    path('api/v1/changepassword/', ChangePasswordAPI.as_view()),
    path('api/v1/getid/', GetUserIdAndNameAPI.as_view()),
]