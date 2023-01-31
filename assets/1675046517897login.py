#!/data/data/com.termux/files/usr/bin/env python

from getpass import getpass
import os

count = 1
while count > 0:
    count = count-1
    password = getpass("Your password: ")

    if password == 'jns123':
         os.system("clear")
    else:
         print("Password Invalid")
         count = 1
         os.system("clear")
