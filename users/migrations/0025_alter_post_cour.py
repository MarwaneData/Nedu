# Generated by Django 4.0.4 on 2022-06-06 11:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0024_delete_forum'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='cour',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.cours'),
        ),
    ]
