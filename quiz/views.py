from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required
from users.models import Cours

# Create your views here.

lst = []
anslist = []



def welcome(request,pk):
    lst.clear()
    anslist.clear()
    answers = Questions.objects.filter(cours_id=pk)
    for i in answers:
        anslist.append(i.reponse)

    cours = Cours.objects.get(id=pk)
    questions = Questions.objects.filter(cours_id=pk)
    context ={
       'questions': questions,
        'cours':cours
    }
    return render(request, 'quiz/welcome.html',context)

@login_required
def quiz(request,pk):
    
    cours = Cours.objects.get(id=pk)
    questions = Questions.objects.filter(cours_id=pk)
    paginator = Paginator(questions,1)
    try:
        page = int(request.GET.get('page','1'))
    except:
        page =1

    try:
        question_av = paginator.page(page)
    except(EmptyPage,InvalidPage):
        question_av = paginator.page(paginator.num_pages)

    contexte ={
        'questions':questions ,
        'questions_av':question_av,
        'cours':cours,
     
    }
    return render(request, 'quiz/quiz.html',contexte)


def result(request,pk):
    cours = Cours.objects.get(id=pk)
    questions = Questions.objects.filter(cours_id=pk)
    score = 0
    for i in range(len(lst)):
        if lst[i] == anslist[i]:
            score +=1

    contexte = {
        'score':score,
        'cours':cours,
        'questions':questions,
    }
    return render(request, 'quiz/result.html',contexte)


def saveans(request):
    ans = request.GET['ans']
    lst.append(ans)

