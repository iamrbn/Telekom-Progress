// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: phone-square;

//+++++++ END CONFIG ZONE ++++++++
const refreshInt = 175 //in minutes
const widgetURL = 'https://pass.telekom.de'
const remainingText = "Remaining for " //de: verbleibend für ; en: remaining for ;
const usedOf = 'of X used' //de: von X verbraucht; en: of X used;
const replacer = ['.', ','] // replaces point with coma or vice versa (e.g. 2.5 => 2,5);
//+++++++ END CONFIG ZONE ++++++++

let module = importModule('/Telekom Progress/telekomModule')
let progressBgColor = Color.dynamic(new Color('#d6d6d6'), new Color('#890652'))
let top = Color.dynamic(new Color('#ffffff'), new Color('#FE329B'))
let middle = Color.dynamic(new Color('#EDEDED'), new Color('#EC1181'))
let bottom = Color.dynamic(new Color('#e8e8e8'), new Color('#E20175'))
let bgGradient = new LinearGradient()
    bgGradient.locations = [0, 0.5, 1]
    bgGradient.colors = [top, middle, bottom]
let wSize = config.widgetFamily
let fm = FileManager.iCloud()
let dir = fm.joinPath(fm.documentsDirectory(), 'Telekom Progress')
if (!fm.fileExists(dir)) fm.createDirectory(dir)
await module.saveImages(fm, dir)
let modulePath = fm.joinPath(dir, "telekomModule.js")
if (!fm.fileExists(modulePath)) await loadModule()
let jsonPath = fm.joinPath(dir, "telekomDataPlan.json")
if (!fm.fileExists(jsonPath)){w = await createIssueWidget('Can`t find datas from telekom api', 'Looks like your first run', 'turn WiFi off and run script inApp', 'bolt.trianglebadge.exclamationmark.fill'); w.presentSmall(); Script.setWidget(w)}
let df = new DateFormatter()
    df.dateFormat = "HH:mm"
let uCheck = await module.updateCheck(fm, modulePath, 1.1)
let apiDatas = await module.getFromAPI(fm, df, jsonPath)
let data = apiDatas.datas
let unlimited = apiDatas.datas.unlimited
let fontColor = apiDatas.fontColor
let sfSymbol = apiDatas.sfSymbol
let fresh = apiDatas.fresh

if (config.runsInWidget || config.runsInAccessoryWidget){
   switch (wSize){
      case "small":
        if (unlimited) w = await dayUnlimited(data)
        else w = await createWidget(data)
      break;
      
      case "medium":
        if (unlimited) w = await dayUnlimited(data)
        else w = await createWidget(data)
      break;
      
      case "accessoryCircular":
        if (unlimited) w = await createSmallLSWUnlimited(data)
        else w = await createSmallLSW(data)
      break;
      
      case "accessoryRectangular":
        if (unlimited) w = await createMediumLSWUnlimited(data)
        else w = await createMediumLSW(data)
      break;
      
      case "accessoryInline":
        if (unlimited) w = await createInlineLSWUnlimited(data)
        else w = await createInlineLSW(data)
      break;
      default: w = await createWidget(data)
    }
    Script.setWidget(w)
   } else {
    if (unlimited) w = await dayUnlimited(data)
    else w = await createWidget(data)
       w.presentSmall()
       //w = await createIssueWidget('Can`t find datas from telekom api', 'Looks like your first run', 'turn WiFi off and run script inApp', 'bolt.trianglebadge.exclamationmark.fill')         
};

// ******** CREATE INLINE LS WIDGET ********
async function createInlineLSW(data){
   let w = new ListWidget()
       w.url = widgetURL
       w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)

       img = module.getSF(w, sfSymbol, 20, Color.white(), 20, 20)
       txt = w.addText(`${data.usedPercentage}% ${data.usedVolume}/${data.initialVolumeStr}`)
   
  return w
};
// *** CREATE INLINE LS WIDGET UNLIMITED ***
async function createInlineLSWUnlimited(data){
   let w = new ListWidget()
       w.url = widgetURL
       w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)

       img = module.getSF(w, 'infinity', 20, Color.white(), 20, 20)
       wTimer = w.addDate(module.remainingTime(data.usedAt, data.remainingSeconds))
       wTimer.applyTimerStyle()
   
  return w
};


// ******** CREATE ROUNDED LS WIDGET *********
async function createSmallLSW(data){
   let w = new ListWidget()
       w.url = widgetURL
       w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
      
   let padding = 5 * 3.1
   let stack = w.addStack()
       stack.size = new Size(57, 57)
       stack.spacing = -3
       stack.backgroundImage = await module.createCircle(data.usedPercentage, data.initialVolume)
       stack.centerAlignContent()
       stack.layoutVertically()
       stack.setPadding(0, 17, 5, 0)
   
   let img = module.getSF(stack, sfSymbol, 100, fontColor, 21, 21)

   let txt = stack.addText(data.usedPercentage+"%")
       txt.font = Font.lightRoundedSystemFont(12)
       txt.lineLimit = 1
       txt.minimumScaleFactor = 0.7
   
   return w
};
// ******** CREATE ROUNDED LS WIDGET UNLIMITED ********
async function createSmallLSWUnlimited(data){
   let w = new ListWidget()
       w.url = widgetURL
       w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
       w.addAccessoryWidgetBackground = true
       w.addSpacer()
    
   let img = module.getSF(w, 'infinity', 100, Color.white(), 30, 30)

       w.addSpacer(-10)
    
   let wTimer = w.addDate(module.remainingTime(data.usedAt, data.remainingSeconds))
       wTimer.font = new Font("Menlo-Bold",10)
       wTimer.minimumScaleFactor = 0.5
       wTimer.lineLimit = 1
       wTimer.applyTimerStyle()
       wTimer.centerAlignText()
    
       w.addSpacer()
   
   return w
};

// ******** CREATE RECTANGULAR LS WIDGET ********
async function createMediumLSW(data){
   let sf = SFSymbol.named(sfSymbol)
       sf.applyFont(Font.regularSystemFont(15))
       sf.tintColor = Color.white()
      
   let w = new ListWidget()
       w.url = widgetURL
       w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)

   let headerStack = w.addStack()
       headerStack.centerAlignContent()
       headerStack.spacing = 4
      
   let img = headerStack.addImage(sf.image)
       img.imageSize = new Size(15, 15)
   
   let hTitle = headerStack.addText(data.passName)
       hTitle.font = Font.semiboldSystemFont(11)
       hTitle.textColor = Color.white()
       hTitle.minimumScaleFactor = 0.8
       hTitle.lineLimit = 1
      
   let hSubtitle = headerStack.addText(data.remainingTimeStr)
       hSubtitle.font = new Font("Menlo-Regular",6)
       hSubtitle.minimumScaleFactor = 0.8
       hSubtitle.lineLimit = 1
       hSubtitle.textOpacity = 0.7
   
       w.addSpacer(2)
   
   let progressStack = w.addStack()
       progressStack.addImage(await module.createProgress(toString(wSize), data.initialVolume, new Color('#00000080'), "#FFFFFF", 200, 7, data.usedVolume, 4, 5))
       
       w.addSpacer(1)
   let volumeStack = w.addStack()
   let remainingVolumeX = data.remainungVolumeGB + " GB"
   if (data.usedVolumeStr.includes("MB")) remainingVolumeX = data.remainungVolumeMB + " MB"
  
   let line4L = volumeStack.addText(data.usedVolumeStr.replace(replacer[0], replacer[1]))
       line4L.font = new Font("Menlo-Regular", 6)
      
       volumeStack.addSpacer()
      
   let line4R = volumeStack.addText(remainingVolumeX.replace(replacer[0], replacer[1]))//initialVolumeStr
       line4R.font = new Font("Menlo-Regular", 6)

   let percentage = w.addText(data.usedPercentage + "%")
       percentage.font = new Font("Menlo-Bold", 16)
       percentage.shadowColor = Color.black()
       percentage.shadowOffset = new Point(7, 1)
       percentage.shadowRadius = 5
       percentage.centerAlignText(); 
   
   return w
};
// ******** CREATE RECTANGULAR LS WIDGET UNLIMITED ********
async function createMediumLSWUnlimited(data){
  let w = new ListWidget()
      w.url = widgetURL
      //w.addAccessoryWidgetBackground = true
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
     
   if (uCheck.needUpdate){
      ud = w.addText(`Update ${uCheck.uC.version} Available!`)
      ud.font = Font.mediumMonospacedSystemFont(11)
      ud.textColor = Color.green()
}
      
  let bgStack = w.addStack()
      //bgStack.layoutVertically()
      bgStack.centerAlignContent()
      bgStack.backgroundColor = new Color('#D5D7DC1a')
      bgStack.size = new Size(140, 57)
      bgStack.setPadding(0, 10, 0, 0)
      bgStack.cornerRadius = 10
      bgStack.borderColor = Color.white()
      bgStack.borderWidth = 3
      bgStack.spacing = -10
  
  let img = module.getSF(bgStack, 'infinity', 100, fontColor, 30, 30)
      
      //bgStack.addSpacer()
      
  let wTimer = bgStack.addDate(module.remainingTime(data.usedAt, data.remainingSeconds))
      wTimer.applyTimerStyle()
      wTimer.centerAlignText()
      wTimer.font = new Font('Menlo', 15)
      wTimer.shadowColor = fontColor
      wTimer.shadowOffset = new Point(1, 4)
      wTimer.shadowRadius = 3
      wTimer.textOpacity = (5)
   
   return w
};

  
// +++++++++++++ CREATE WIDGET +++++++++++++
async function createWidget(data){
  let w = new ListWidget()
      w.url = widgetURL
      w.setPadding(10, 9, 2, 9);
      w.backgroundGradient = bgGradient
      w.refreshAfterDate = new Date(Date.now() + 1000*60*refreshInt)
      
  let headerStack = w.addStack();
      headerStack.centerAlignContent();
    
  let appIcon = headerStack.addImage(await module.getImageFor(fm, dir, "Telekom"))
      appIcon.imageSize = new Size(15, 15)
      appIcon.tintColor = fontColor
    
      headerStack.addSpacer(7)
   
  let line1 = headerStack.addText(data.passName)
      line1.font = new Font('Menlo', 17)
      line1.minimumScaleFactor = 0.6
      line1.lineLimit = 1
      line1.textColor = fontColor
      line1.leftAlignText()
    
      headerStack.addSpacer()

  //let uCheck = await updateCheck(scriptVersion)
  if (uCheck.needUpdate){
      udd = w.addText(`Update ${uCheck.uC.version} Available!`)
      udd.font = Font.mediumMonospacedSystemFont(11)
      udd.textColor = Color.green()
      }

      w.addSpacer(5);

  let line2 = w.addText(data.usedPercentage + "%")
      line2.font = new Font("Menlo-Bold", 50)
      line2.minimumScaleFactor = 0.8
      line2.textColor = fontColor
      line2.centerAlignText()
    
      w.addSpacer(-10)
        
  let line3 = w.addText(usedOf.replace('X', data.initialVolumeStr))
      line3.font = new Font("Menlo-Regular", 8)
      line3.textColor = fontColor
      line3.centerAlignText()
    
      w.addSpacer(7)
    
  let progressStack = w.addStack()
  

  switch (wSize){
      case "medium": progressStack.addImage(module.createProgress(wSize, data.initialVolume, progressBgColor, module.getProgressColor(fresh, data.usedPercentage), 400, 15, data.usedVolume, 6, 7))
      break;
      default: progressStack.addImage(module.createProgress(wSize, data.initialVolume, progressBgColor, module.getProgressColor(fresh, data.usedPercentage), 125, 7, data.usedVolume, 4, 5))//62043b, 760547
   }
  
      w.addSpacer(1)
  
  let volumeStack = w.addStack()
  
  let remainingVolumeX = data.remainungVolumeGB + " GB"
  if (data.usedVolumeStr.includes("MB")) remainingVolumeX = data.remainungVolumeMB + " MB"
  
  let line4L = volumeStack.addText(data.usedVolumeStr.replace(replacer[0], replacer[1]))
      line4L.font = new Font("Menlo-Regular", 8)
      line4L.textColor = fontColor
    
      volumeStack.addSpacer()

  let line4R = volumeStack.addText(remainingVolumeX.replace(replacer[0], replacer[1]))
      line4R.font = new Font("Menlo-Regular", 8)
      line4R.textColor = fontColor
      
      w.addSpacer(5)

  let line5 = w.addText(remainingText + data.remainingTimeStr)
      line5.font = new Font("Menlo", 8)
      line5.lineLimit = 1
      line5.textColor = fontColor
      line5.minimumScaleFactor = 0.7
      line5.textOpacity = 0.7
      line5.centerAlignText()
    
      w.addSpacer()
    
  let footerStack = w.addStack()
      footerStack.bottomAlignContent()
      footerStack.spacing = 3
       
      footerStack.addSpacer()
    
      df.useShortTimeStyle()
  let timeStamp = footerStack.addText(data.lastUpdate + ' > ' + df.string(new Date()))
      timeStamp.font = new Font("Menlo-Regular", 7)
      timeStamp.centerAlignText()
      timeStamp.textColor = fontColor
      timeStamp.textOpacity = 0.5
      
  let symbol = footerStack.addImage(SFSymbol.named(sfSymbol).image)
      symbol.imageSize = new Size(9, 9)
      symbol.imageOpacity = 0.5
      symbol.tintColor = fontColor
      symbol.centerAlignImage()
      
  let nextUD = footerStack.addText('> '+data.nextUpdate)
      nextUD.font = new Font("Menlo-Regular", 7)
      nextUD.textColor = fontColor
      nextUD.centerAlignText()
      nextUD.textOpacity = 0.5

      footerStack.addSpacer()
  
return w
};


// +++++++++++++ UNLIMITED +++++++++++++
async function dayUnlimited(data){
  let w = new ListWidget()
      w.url = widgetURL
      w.setPadding(15, 5, 5, 5)
      w.backgroundGradient = bgGradient
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)
  
  let headerStack = w.addStack()
      headerStack.centerAlignContent()
    
  let appIcon = headerStack.addImage(await module.getImageFor(fm, dir, "Telekom"))
      appIcon.imageSize = new Size(15, 15)
      appIcon.tintColor = fontColor
    
      headerStack.addSpacer(4)
   
  let wTitle = headerStack.addText(data.passName)
      wTitle.font = new Font('Menlo', 15)
      wTitle.minimumScaleFactor = 0.7
      wTitle.lineLimit = 1
      wTitle.textColor = fontColor
    
      headerStack.addSpacer()
      
   if (uCheck.needUpdate){
      udd = w.addText(`Update ${uCheck.uC.version} Available!`)
      udd.font = Font.mediumMonospacedSystemFont(11)
      udd.textColor = Color.green()
      }

      w.addSpacer()
  
      img = module.getSF(w, 'infinity', 100, fontColor, 90, 50)
      
      w.addSpacer()
      
  let txtStr = w.addText(remainingText)
      txtStr.font = font = new Font('Menlo', 10)
      txtStr.textColor = fontColor
      txtStr.centerAlignText()
      
  let timerStack = w.addStack()
      
  let wTimer = w.addDate(module.remainingTime(data.usedAt, data.remainingSeconds))
      wTimer.applyTimerStyle()
      wTimer.centerAlignText()
      wTimer.font = font = new Font('Menlo', 18)
      wTimer.shadowColor = fontColor
      wTimer.shadowOffset = new Point(1, 4)
      wTimer.shadowRadius = 3
      wTimer.textOpacity = (5)
      
      w.addSpacer()
      
      
  let footerStack = w.addStack()
      footerStack.bottomAlignContent()
      footerStack.spacing = 3
       
      footerStack.addSpacer()
    
      df.useShortTimeStyle()
  let timeStamp = footerStack.addText(data.lastUpdate + ' > ' + df.string(new Date()))
      timeStamp.font = new Font("Menlo-Regular", 7)
      timeStamp.centerAlignText()
      timeStamp.textColor = fontColor
      timeStamp.textOpacity = 0.5
      
  let symbol = footerStack.addImage(SFSymbol.named(sfSymbol).image)
      symbol.imageSize = new Size(9, 9)
      symbol.imageOpacity = 0.5
      symbol.tintColor = fontColor
      symbol.centerAlignImage()
      
  let nextUD = footerStack.addText('> '+data.nextUpdate)
      nextUD.font = new Font("Menlo-Regular", 7)
      nextUD.textColor = fontColor
      nextUD.centerAlignText()
      nextUD.textOpacity = 0.5

      footerStack.addSpacer()
      
return w
};


async function createIssueWidget(title, subtitle, body, sf){
  let w = new ListWidget()
      w.setPadding(15, 5, 5, 5)
      w.backgroundGradient = bgGradient
      w.refreshAfterDate = new Date(Date.now()+1000*60*refreshInt)

      module.getSF(w, sf, 100, Color.white(), 40, 40)
      
      w.addSpacer(5)
    
      wTitle = w.addText(title)
      wTitle.font = new Font("Menlo-Regular", 12)
      wTitle.centerAlignText()
    
      wSubtitle = w.addText(subtitle)
      wSubtitle.font = new Font("Menlo-Regular", 11)
      wSubtitle.centerAlignText()
      
      wBody = w.addText(body)
      wBody.font = new Font("Menlo-Regular", 10)
      wBody.centerAlignText()
 
  return w 
};


async function loadModule(){
   req = new Request('https://raw.githubusercontent.com/iamrbn/Telekom-Progress/main/telekomModule.js')
   moduleFile = await req.loadString()
   fm.writeString(modulePath, moduleFile)
   console.warn('loaded telekomModule.js file from github')
};


//=======================================//
//============ END OF MODULE ============//
//=======================================//
