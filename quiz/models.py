from django.db import models
from users.models import Cours

# Create your models here.



class Questions(models.Model):
    question = models.CharField(max_length=100)

    option1 = models.CharField(max_length=100)
    option2 = models.CharField(max_length=100)
    option3 = models.CharField(max_length=100)
    option4 = models.CharField(max_length=100)


    reponse = models.CharField(max_length=100)
    cours = models.ForeignKey(Cours, on_delete=models.PROTECT)
   

    def __str__(self) :
       return self.question

    class Meta:
        verbose_name = "Questions"
        verbose_name_plural = "Questions"