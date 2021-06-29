# KB Parser - Stahování plateb z Komerční Banky, parsování emailových notifikací.

This script is for parsing email notifications about payments from Komercni Banka, since they don't have simple API to programatically fetch those data.

Example implementation:
1) Deploy this script to cloud, e.g. Google Cloud Functions. Get your function url.
2) Set up email notifications in your KB account.
3) Create script which will watch for new emails from KB in your inbox, send their text content to deployed cloud function and save result where you need. Integromat is good for that.

Integromat script example:

![image](https://user-images.githubusercontent.com/59233911/123763813-76028b80-d8c4-11eb-800d-a7c0e05c3d15.png)
