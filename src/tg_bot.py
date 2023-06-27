import requests
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import time

YOUTUBE_API_KEY = 'AIzaSyC55l0bbjFgI2hMgQfTc9p1PZmEsxyZI08'
YOUTUBE_CHANNEL_ID =  'UCiLr3Ld--4JlLUNBoboBrkg'
def get_latest_video():
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    request = youtube.search().list(part='snippet', channelId=YOUTUBE_CHANNEL_ID, maxResults=1, order='date')
    response = request.execute()
    
    if 'items' in response:
        video = response['items'][0]
        video_id = video['id']['videoId']
        video_title = video['snippet']['title']
        video_url = f'https://www.youtube.com/watch?v={video_id}'
        return video_url
    
    return None

previous_video_url = None

while True:
    latest_video_url = get_latest_video()
    
    if latest_video_url and latest_video_url != previous_video_url:
        payload = {'latest_video_url': latest_video_url}
        try:
            response = requests.post('http://localhost:3000/videos/', json=payload)
            if response.status_code == 200:
                print("успішно відправлено до проекту")
            else:
                print("Не вдалося відправити")
        except requests.exceptions.RequestException as e:
            print("Помилка під час відправлення ", e)
        

        previous_video_url = latest_video_url
    
    time.sleep(3600 * 6)