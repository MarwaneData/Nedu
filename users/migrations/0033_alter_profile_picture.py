# Generated by Django 4.0.4 on 2022-06-20 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0032_alter_profile_nom_alter_profile_prenom'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='picture',
            field=models.ImageField(blank=True, null=True, upload_to='users_picture'),
        ),
    ]