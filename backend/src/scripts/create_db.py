"""
Create database script (for MySQL/MariaDB)
"""
import pymysql

connection = pymysql.connect(host='localhost', user='root', password='')
try:
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS restaurant_db")
    connection.commit()
    print("Database 'restaurant_db' ensured.")
finally:
    connection.close()

