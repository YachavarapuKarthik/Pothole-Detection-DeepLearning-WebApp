start = 1
for i in range(1, 5):
    for j in range(i):
        print(start, end=" ")
        if j==i-1 :
            start +=1
        else:
            start +=2
    print()
