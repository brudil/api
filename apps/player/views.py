from django.shortcuts import render


def player(request):
    return render(request, 'player/entry.html')
