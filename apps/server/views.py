from django.shortcuts import render


def four_oh_four(request):
    return render(request, '404.html')
