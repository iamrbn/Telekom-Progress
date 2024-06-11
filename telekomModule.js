//=======================================//
//=========== START OF MODULE ===========//
//=============== Version 1.0 ===============//


module.exports.getProgressColor = (fresh, percentage) => {
	color = '#EC7CB6'
	if (fresh){
      if (percentage <= 49) color = '#23967F'//green
      else if (percentage <= 59) color = '#FFD60A'//yellow
      else if (percentage <=84) color = '#FF9F0A'//orange
      else if (percentage >= 85) color = '#FF453A'//red
      //else if (percentage >= 85) color = '#BF5AF2'//purple
    }  //else color = '#EC7CB6'
    return color
};


module.exports.getFromAPI = async (fm, df, jsonPath) => {
	let data;
	 try {
	 	req = new Request("https://pass.telekom.de/api/service/generic/v1/status");
	 	req.headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1"};
	 	data = await req.loadJSON()
	 	console.warn("\nfetch datas from API")
	 	//console.log(JSON.stringify(data, null, 2))
	 	fm.writeString(jsonPath, JSON.stringify(data, null, 2))
	 	fresh = true
	 	sfSymbol = 'antenna.radiowaves.left.and.right'
	 	fontColor = Color.dynamic(new Color('#ea0a8e'), new Color('#ffffff'))
	} catch (error){
		console.warn(error.message + " => fetch datas from iCloud")
		fresh = false
		sfSymbol = 'wifi.exclamationmark'
		fontColor = Color.dynamic(new Color('#EC7CB6'), new Color('#EC7CB6'))
		if (!fm.isFileDownloaded(jsonPath)) await fm.downloadFileFromiCloud(jsonPath)
		data = JSON.parse(fm.readString(jsonPath), null)
		//console.log(JSON.stringify(data, null, 2))
  }

passName = (data.passName.includes(" Telekom ")) ? "DataPlan" : data.passName

if (!passName.includes('unlimited')){
    unlimited = false
    usedPercentage = data.usedPercentage
    remainingTimeStr = data.remainingTimeStr
    usedVolumeStr = data.usedVolumeStr//.replace(/,\d+/, '')
    //usedVolumeNum = data.usedVolume / 1024 / 1024 / 1024
    initialVolumeStr = data.initialVolumeStr
    initialVolumeNum = Math.abs(data.initialVolume.toFixed() / 1024 / 1024 / 1024)
    usedVolume = String(Math.round(((data.usedVolume/1024/1024/1024) + Number.EPSILON) * 100) / 100).replace(',', '.')
    initialVolume = String(Math.round((initialVolumeNum + Number.EPSILON) * 100) / 100).replace(',', '.')
    initialVolume = parseFloat(initialVolume).toFixed(2)
    //remainingVolumeNum = (data.initialVolume - data.usedVolume) / 1024 / 1024 / 1024
    //remainingVolume = String(Math.round(((data.initialVolume - data.usedVolume) / 1024 / 1024 / 1024 + Number.EPSILON) * 100) / 100).replace(',', '.')
    remainingVolumeMB = Math.abs((data.initialVolume - data.usedVolume) / 1024 / 1024).toFixed(2)
    remainungVolumeGB = Math.abs((data.initialVolume - data.usedVolume) / 1024 / 1024 / 1024).toFixed(2)
    
    lastUpdate = df.string(new Date(data.usedAt))
    nextUpdate = df.string(new Date (10800*1000+data.usedAt))

    var datas = {
    	unlimited, passName, usedPercentage, remainingTimeStr, usedVolumeStr, initialVolumeStr, initialVolumeNum, usedVolume, initialVolume, remainingVolumeMB, remainungVolumeGB, lastUpdate, nextUpdate
    	}
 } else {
     unlimited = true
     lastUpdate = df.string(new Date(data.usedAt))
     nextUpdate = df.string(new Date (10800*1000+data.usedAt))
     remainingTimeStr = data.remainingTimeStr
     remainingSeconds = data.remainingSeconds
     usedAt = data.usedAt
     var datas = {
    	passName, unlimited, lastUpdate, nextUpdate, remainingTimeStr, remainingSeconds, usedAt
    	}
     }
     
  return {fresh, sfSymbol, fontColor, datas}
};


module.exports.remainingTime = (usedTS, sec) => {
   //target = new Date(Date.now() + sec * 1000)
	return new Date(usedTS + sec * 1000)
};


//Saves Images from web
module.exports.saveImages = async (fm, dir) => {
      url = 'https://raw.githubusercontent.com/iamrbn/Telekom-Progress/main/Images/'
      imgs = ['Telekom.png']
      
      for (img of imgs){
          imgPath = fm.joinPath(dir, img)
          if (!fm.fileExists(imgPath)){
          request = new Request(url + img)
          image = await request.loadImage()
          fm.writeImage(imgPath, image)
          console.warn('Image '+ image +' saved in iCloud')
        }
      }
     };

module.exports.getSF = (ground, name, fontSize, color, sizeW, sizeH) => {

	sf = SFSymbol.named(name)
	sf.applyFont(new Font("Menlo-Regular", fontSize))
	sf.applySemiboldWeight()
	symbol = ground.addImage(sf.image)
	symbol.tintColor = color
	symbol.imageSize = new Size(sizeW, sizeH)
	symbol.centerAlignImage()
	
};


module.exports.getDailyUse = (initialVolume) => {
	 day = new Date().getDate() //current day of the month
	 currentDays = new Date(new Date().getFullYear(), new Date().getDay(), 0).getDate().toFixed(4) //number of days in the current month
     todayStatus = (initialVolume / currentDays) * day

	return todayStatus
};


module.exports.createCircle = async  (value, indicator) => {
  if (value > 1) value /= 100
  if (value < 0) value = 0
  if (value > 1) value = 1
  
  	 day = new Date().getDate()//day of the current month
     dailyUse = (initialVolume / new Date(new Date().getFullYear(), new Date().getDay(), 0).getDate()).toFixed(4)
     todayStatus = dailyUse * day

  let webView = new WebView()
  await webView.loadHTML('<canvas id="c"></canvas>')

  let base64 = await webView.evaluateJavaScript(
    `
     //set variables
     let colour = "#FFFFFF",
     background = "#000000",
     size = 57 * 3,
     lineWidth = 5 * 3,
     percent = ${ value * 100 },
     indicatorValue = ${ indicator };
     
     //create canvas ground
     let canvas = document.getElementById('c'),
     c = canvas.getContext('2d');
	 canvas.width = size;
	 canvas.height = size;
     posX = canvas.width / 2,
	 posY = canvas.height / 2,
     onePercent = 360 / 100,
     result = onePercent * ${ value * 100 };
	 c.lineCap = 'round';
	 
	 //draw background circle
	 c.beginPath();
	 c.arc( posX, posY, ( size - lineWidth - 1 ) / 2, ( Math.PI / 180 ) * 270, ( Math.PI / 180 ) * ( 270 + 360 ) );
	 c.strokeStyle = background;
	 c.lineWidth = lineWidth;
	 c.stroke();
	 
	 //draw the progress bar
	 c.beginPath();
	 c.strokeStyle = colour;
	 c.lineWidth = lineWidth;
	 c.arc( posX, posY, ( size - lineWidth - 1 ) / 2, ( Math.PI / 180 ) * 270, ( Math.PI / 180 ) * ( 270 + result ) );
	 c.stroke();
	 
	 //calc position of status indicator
	 indicatorAngle = ( 270 + 360 * indicatorValue ) * ( Math.PI / 100 );
	 indicatorLength = ( size - lineWidth - 1 ) / 2;
	 lineOffset = 5; //length of progress indicator
	 
	 //draw status indicator
	 c.beginPath();
	 c.strokeStyle = 'green';
	 c.lineWidth = 7;
	 c.moveTo(
	 	posX + Math.cos( indicatorAngle ) * ( indicatorLength - lineOffset ),
	 	posY + Math.sin( indicatorAngle ) * ( indicatorLength - lineOffset )
	 );
	 c.lineTo(
     	posX + Math.cos( indicatorAngle ) * ( indicatorLength + lineOffset ),
     	posY + Math.sin( indicatorAngle ) * ( indicatorLength + lineOffset )
	 );
	 c.stroke();
	 
    completion(canvas.toDataURL().replace("data:image/png;base64,",""))`,
    true
  );
  
  return Image.fromData(Data.fromBase64String(base64))
};


//Loads images from iCloud
module.exports.getImageFor = async (fm, dir, name) => {
  imgPath = fm.joinPath(dir, name + ".png")
  await fm.downloadFileFromiCloud(imgPath)
 return await fm.readImage(imgPath)
};


//Create progress bar
module.exports.createProgress = (indicator, bgColor, fillColor, width, height, value, c1, c2) => {
  let context = new DrawContext()
      context.size = new Size(width, height)  
      context.opaque = false
      context.respectScreenScale = true
      context.setFillColor(bgColor)
  
  let path = new Path()
      path.addRoundedRect(new Rect(0, 0, width, height), c1, c2)
      context.addPath(path)
      context.fillPath()
      context.setFillColor(new Color(fillColor))
  
  let path1 = new Path()
  let path1width = (width * value) / initialVolume > width ? width : (width * value) / initialVolume
      //console.log({path1width})
      path1.addRoundedRect(new Rect(0, 0, path1width, height), c1, c2)
      context.setTextAlignedCenter()
      context.addPath(path1)  
      context.fillPath()
        
  let path2 = new Path()
  let path2width = (width * indicator) / initialVolume > width ? width : (width * indicator) / initialVolume
      //console.log({path2width})
      path2.addRect(new Rect(path2width, 0, 1.5, height))
      context.addPath(path2) 
      context.setFillColor(Color.white()) 
      context.fillPath()

return context.getImage()
};


//Checks if's there an server update on GitHub available
module.exports.updateCheck = async (fm, modulePath, version) => {
  url = 'https://raw.githubusercontent.com/iamrbn/Telekom-Progress/main/'
  endpoints = ['Telekom-Progress.js', 'telekomModule.js']
  
    let uC;
    try {
      updateCheck = new Request(url+endpoints[0]+'on')
      uC = await updateCheck.loadJSON()
    } catch (e){
        return log(e)
    }

  needUpdate = false
  if (uC.version > version){
      needUpdate = true
    if (config.runsInApp){
      //console.error(`New Server Version ${uC.version} Available`)
          newAlert = new Alert()
          newAlert.title = `New Server Version ${uC.version} Available!`
          newAlert.addAction("OK")
          newAlert.addDestructiveAction("Later")
          newAlert.message="Changes:\n" + uC.notes + "\n\nOK starts the download from GitHub\n More informations about the update changes go to the GitHub Repo"
      if (await newAlert.present() == 0){
        	reqCode = new Request(url+endpoints[0])
        	updatedCode = await reqCode.loadString()
        	pathCode = fm.joinPath(fm.documentsDirectory(), `${Script.name()}.js`)
        	fm.writeString(pathCode, updatedCode)
        	reqModule = new Request(url+endpoints[1])
        	moduleFile = await reqModule.loadString()
        	fm.writeString(modulePath, moduleFile)
        	throw new Error("Update Complete!")
      }
    }
  } else log("\n>> SCRIPT IS UP TO DATE!")
  
  return {uC, needUpdate}
};


//=========================================//
//============== END OF MODULE ============//
//=========================================//
