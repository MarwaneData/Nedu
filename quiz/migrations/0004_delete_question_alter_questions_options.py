# Generated by Django 4.0.4 on 2022-06-23 16:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0003_questions'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Question',
        ),
        migrations.AlterModelOptions(
            name='questions',
            options={'verbose_name': 'Questions', 'verbose_name_plural': 'Questions'},
        ),
    ]