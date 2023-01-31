# import os 
# import sys

# pythonParamsInpt = sys.argv
# length = len(pythonParamsInpt) - 1
# fileCompile = pythonParamsInpt[length]

# os.system("javac " + fileCompile)
# os.system("java " + fileCompile)


import os 
import sys

pythonParamsInpt = sys.argv
length = len(pythonParamsInpt) - 1
fileCompile = pythonParamsInpt[length]

# os.system("javac " + fileCompile)
# os.system("java " + fileCompile)

tes = os.system("javac " + fileCompile)

if (tes == 0) :
    os.system("java " + fileCompile)
else :
    print("Gagal compile bro...")