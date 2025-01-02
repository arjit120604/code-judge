##user_code
if __name__ == "__main__":
    n = int(input())
    arr = list(map(int, input().split()))
    n = int(input())
    brr = list(map(int, input().split()))
    result = maxElement(arr, brr)
    print(result)