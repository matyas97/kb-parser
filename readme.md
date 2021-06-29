# KB Parser

This script is for parsing email notifications about payments from Komercni Banka, since they don't have simple API to programatically fetch those data.

Example implementation:
1) Deploy this script to cloud. E.g. Google Cloud Functions. Get your function url.
2) Set up email notifications in your KB account.
3) Create script which will watch for new emails from KB in your inbox, send their text content to deployed cloud function and save result where you need. Integromat is good for that.