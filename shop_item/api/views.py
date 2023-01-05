from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from shop_item.api.serializers import ShopItemSerializer, PriceChangeSerializer, CreateItemSerializer, \
    PurchaseItemsSerializer, SearchStringSerializer
from shop_item.models import ShopItem
from django.core.mail import send_mail


class ShopItemPaginator(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10

# API for getting all items in the webshop (using pagination)
class ShopItemListAPI(GenericAPIView):
    pagination_class = ShopItemPaginator

    def post(self, request):
        serializer = SearchStringSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        shopItems = ShopItem.objects.filter((Q(title__contains=data["searchQuery"]) | Q(description__contains=data["searchQuery"])), buyer=None).order_by("-created_date")
        page = self.paginate_queryset(shopItems)

        if page:
            serializer = ShopItemSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            return Response({})

# API for getting all items (selling/sold/bought) of an authenticated user
class UserShopItemsAPI(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def get(self, request):
        user = request.user
        shopItems = ShopItem.objects.filter(Q(seller=user.id) | Q(buyer=user.id))
        serializer = ShopItemSerializer(shopItems, many=True)

        return Response(serializer.data)

# API for creating a shop item
class CreateShopItemAPI(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def post(self, request):
        serializer = CreateItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user = request.user

        newShopItem = ShopItem(
            title=data["title"],
            description=data["description"],
            price=data["price"],
            seller=user
        )

        newShopItem.save()

        serializer = ShopItemSerializer(newShopItem)

        return Response(serializer.data)



# API for changing the price of a shop item
class ChangePriceApi(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [TokenAuthentication, ]

    def put(self, request):
        serializer = PriceChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        shopItem = ShopItem.objects.get(id=data["id"])
        user = request.user

        if(user.id != shopItem.seller.id):
            print("Unauthorized action attempt for changing price of item")
            return Response({"message": "Cannot change price of separate user"})
        if(shopItem.buyer != None):
            print("Cannot change price of sold item")
            return Response({"message": "Cannot change price of sold item"})

        shopItem.price = data["price"]
        shopItem.save()

        return Response({"message": "Successfully updated price"})

# API for purchasing items for sale
class BuyShopItemsAPI(GenericAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    authentication_classes = [TokenAuthentication, ]

    def put(self, request):
        serializer = PurchaseItemsSerializer(many=True, data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user

        # Check the items sent from the client against the same items in the db, if there are inconsistencies
        # (price and buyer) send back the latest instance of the item to the client with up-to-date information.
        #
        # Also make sure that a user cannot purchase their own items for sale.

        basketIsValid = True
        updatedItems = []
        items = []
        for entry in data:
            print("Processing item with id: " + entry["id"])
            newestItemVersion = ShopItem.objects.get(id=entry["id"])
            items.append(newestItemVersion)
            if (newestItemVersion.price != entry["price"]):
                print("Inconsistency in price for item with id : " + entry["id"])
                updatedItems.append(newestItemVersion)
                basketIsValid = False
            elif (newestItemVersion.buyer != None):
                print("The following item has already been purchased with id : " + entry["id"])
                updatedItems.append(newestItemVersion)
                basketIsValid = False
            elif (user.id == newestItemVersion.seller.id):
                print("User with id " + str(user.id) + " cannot purchase their own item with id:" + entry["id"])
                updatedItems.append(newestItemVersion)
                basketIsValid = False

        if (basketIsValid):
            for item in items:
                item.buyer = user
                item.save()
                send_mail(
                    'You sold an item',
                    'Your item ' + item.title + ' has been sold!',
                    'host@example.com',
                    [item.seller.email],
                    fail_silently=False,
                )
                send_mail(
                    'You bought an item',
                    'The item ' + item.title + ' is now yours!',
                    'host@example.com',
                    [user.email],
                    fail_silently=False,
                )
            return Response({"purchaseCompleted": True})
        else:
            serializer = ShopItemSerializer(updatedItems, many=True)

            return Response(serializer.data)