def countNicePairs(nums):
    MOD = 10**9 + 7


    def rev(x):
        return int(str(x)[::-1])


    count = {}
    result = 0


    for num in nums:
        diff = num - rev(num)
        

        if diff in count:
            result = (result + count[diff]) % MOD
            count[diff] += 1
        else:
            count[diff] = 1

    return result


n = int(input("Enter the number of elements: "))
nums = []
for _ in range(n):
    element = int(input("Enter element: "))
    nums.append(element)
print(countNicePairs(nums))  
