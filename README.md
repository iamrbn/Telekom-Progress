# <img src=https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/61/2c/01/612c0188-2033-1815-0ee9-52c8641184a5/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.png  width="25"> Telekom Progress Widget 
![](https://img.shields.io/badge/dynamic/json?color=EC1181&style=plastic&label=Version&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fiamrbn%2FTelekom-Progress%2Fmain%2FTelekom-Progress.json "Hi there 👋 I'm always up to date")

Another [Scriptable](https://scriptable.app) widget that displays your data plan from the telekom-API on your home & lock screen[^1]

## OVERVIEW
<img title=Thumbnail Homescreen src=/Images/widgetsThumbnail.png  width="1000">    
<img title=Thumbnail Lockscreen src=/Images/lockscreenThumbnail.png  width="1000">

## FEATURES

### Widget Sizes
- Homescreen
  - Small
  - Medium
- Lockscreen
  - Inline
  - Circular
  - Recatngular


### Light- & Darkmode
Light- & Darkmode is only available fot the homescreen widgets.


### Not Connected (WiFi)
All widgets have an indicator that shows your connection that was present during the last run.
Internet or Cellular. This means how fresh your datas are.    
The Wifi symbol <img title=wifi.exclamationmark src=/Images/wifi.exclamationmark.png  width="20"> means, your datas are from the last run in cellular network.    
This Cellular symbol <img title=wifi.exclamationmark src=/Images/antenna.radiowaves.left.and.right.png  width="21"> means your datas are fresh and live from the API.     
Its also reduces the widget opacity if you connected via WiFi.


### Unlimited
If you have booked an 24h unlimited dataplan, this will also be displayed in the widget.   
A timer is also displayed showing your remaining time.


### Progress Bar
The Rectangular-Lockscreen and the Homescreen widget shows a prograss bar which displays your current consumption.    
The Circular-Lockscreen widget shows it as a Circular Progress.     
On the left it shows your used Datavolume and on the rigt it shows what is remaining.


### Requirement Indicator
This small indicator in the progress bar shows you your consumption limit. this tells you whether you have reached your requirement or not. 


### Update Footer
The widget footer shows three timestamps.    
_1st_: Last update in the API    
_2nd_: Last run of the widget with Wifi or Cellular    
_3th_: Next Update in the API


### Selfupdate Function
The script updates itself[^2]


## Configuration
Set your widget parameter
``` javascript
const refreshInt = 60 //in minutes
const widgetURL = 'https://pass.telekom.de'
const remainingText = "Remaining for " //de: verbleibend für ; en: remaining for ;
const usedOf = 'of X used' //de: von X verbraucht; en: of X used;
const replacer = ['.', ','] // replaces point with coma or vice versa (e.g. 2.5 => 2,5);
```


## ON THE FIRST RUN
It downloads following files from the github repo and saves it in the "Telekom Progress" directory.
```
iCloud Drive/
├─ Scriptable/
│  ├─ Telekom Progress/
│  │  ├─ telekomModule.js
│  │  ├─ Telekom.png
│  │  ├─ telekomDataPlan.json
```


### Example Content Of The API
``` JSON
{
  "passName": "Your Telekom data plan",
  "usedVolumeStr": "3.95 GB",
  "hasOffers": true,
  "remainingSeconds": 1426444,
  "remainingTimeStr": "16 days 12 hours",
  "usedAt": 1718358344000,
  "validityPeriod": 2,
  "usedPercentage": 40,
  "title": "",
  "initialVolume": 10737418240,
  "initialVolumeStr": "10 GB",
  "passType": 103,
  "nextUpdate": 10800,
  "subscriptions": [
    "speedon",
    "roamLikeHome",
    "tns"
  ],
  "usedVolume": 4241800089,
  "passStage": 1,
  "sessionState": 0
}
```

---

<p align="center">
  <a href="https://reddit.com/user/iamrbn/">
    <img title="Follow Me On Reddit @iamrbn" src="https://github.com/iamrbn/slack-status/blob/5fef0d438bd47bb8524e1b65679c8153ec30e165/Images/Badges/reddit_black_iamrbn.png" width="150"/>
  </a>
   <a href="https://bsky.app/profile/iamrbn.bsky.social">
    <img title="Follow Me On Bluesky @iamrbn.bsky.social" src="https://github.com/iamrbn/slack-status/blob/main/Images/Badges/badge_bluesky.png" width="165"/>
  </a>
  <a href="https://mastodon.social/@iamrbn">     
  <img title="Follow Me On Mastodon iamrbn@mail.de@mastodon.socail" src="https://github.com/iamrbn/slack-status/blob/1e67e1ea969b791a36ebb71142ec8719594e1e8d/Images/Badges/mastodon_black.png" width="190"/>   
  </a>
  <a href="https://twitter.com/iamrbn_/">
    <img title="Follow Me On Twitter @iamrbn_" src="https://github.com/iamrbn/slack-status/blob/ae62582b728c2e2ad8ea6a55cc7729cf71bfaeab/Images/Badges/twitter_black.png" width="155"/>
    </a>
</p>

<br>

[^1]:Over the years I have used many different scriptable-telekom-widgets. At some point I started to build my own and used parts from the other widgets.
So if you find parts of your code in mine, contact me and I will add you to my credits.
[^2]:[Ground Function](https://github.com/mvan231/Scriptable#updater-mechanism-code-example "GitHub Repo") is written by the amazing [@mvan231](https://mastodon.social/@mvan231 "Mastodon")

