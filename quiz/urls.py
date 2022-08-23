from django.urls import path
from . import views


urlpatterns = [

    path('welcome/<str:pk>/', views.welcome, name='welcome'),
    path('quiz/<str:pk>/', views.quiz, name='quiz'),
    path('result/<str:pk>/', views.result, name='result'),
    path('saveans/', views.saveans, name='saveans'),

]