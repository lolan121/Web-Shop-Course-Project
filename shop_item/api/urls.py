from django.urls import path

from shop_item.api.views import ShopItemListAPI, UserShopItemsAPI, ChangePriceApi, CreateShopItemAPI, BuyShopItemsAPI

urlpatterns = [
    path('api/v1/shopitems/', ShopItemListAPI.as_view()),
    path('api/v1/useritems/', UserShopItemsAPI.as_view()),
    path('api/v1/changeprice/', ChangePriceApi.as_view()),
    path('api/v1/newitem/', CreateShopItemAPI.as_view()),
    path('api/v1/buyitems/', BuyShopItemsAPI.as_view()),
]