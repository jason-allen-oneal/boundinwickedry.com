import mysql.connector
import urllib.request

def downloadImage(image):
  if image != '':
    folder = "/var/www/biw/public/images/shop/"
    file = folder + image
    url = "https://www.sextoydistributing.com/Merchant2/graphics/00000001/" + image
    print(url)
    with open(file, 'wb') as handle:
      urllib.request.urlretrieve(url, image.lower())

db = mysql.connector.connect(
  host="localhost",
  user="jason",
  password="P455w3rd3d!123",
  database="biw"
)

cursor = db.cursor()
cursor.execute("SELECT * FROM Item")
result = cursor.fetchall()
items = list()
for x in result:
  items.insert(len(items), x[6])

for img in items:
  downloadImage(img)