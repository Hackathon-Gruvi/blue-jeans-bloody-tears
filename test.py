import csv
import urllib, json
from urllib.parse import urlencode
from urllib.request import urlopen

INPUT_FILE = 'input/mismatched_titles_sample.csv'
OUTPUT_FILE = 'output/mismatched_titles_result.csv'
URL = 'http://localhost:5000/api/match?'

write_to_csv = []

with open(INPUT_FILE, newline='') as csvfile:
    csvreader = csv.reader(csvfile, delimiter=',', quotechar='|')
    
    for item in csvreader:
        
        line = []
        line.append(item[0])
        url = URL + urlencode({'q' : item[0] })
        
        print("Requesting [" + item[0] + "]  " + url )
        response = urlopen(url)

        data = json.loads(response.read())

        for result in data:
            print(result.get('imdb_id') + "   " + str(result.get('factor')))
            line.append(result.get('imdb_id'))
            line.append(result.get('factor'))
        write_to_csv.append(line)
            
    
with open(OUTPUT_FILE, 'w', newline='') as file:
    writer = csv.writer(file)
    print(write_to_csv)
    writer.writerows(write_to_csv)