function onSubmit(e) {
  Logger.clear();
  Logger.log("application received")

  var items = e.response.getItemResponses();
  var formData = {};
  
  for (i in items){
    formData[items[i].getItem().getTitle()] = items[i].getResponse();
  }
  
  var url = "https://func-applicationautomation-centralus-001.azurewebsites.net/api/applicationautomation";
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(formData)
  };
  
  Logger.log("constructed request body: " + JSON.stringify(response));
  Logger.log("sending request to " + url);
  
  var response = null
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("response received: " + JSON.stringify(response.getContentText()));
  }
  catch (err) {
    if (("" + err).indexOf("Timeout") > -1) {
      Logger.log("Timeout occured. This is expected due to remote headless browser operations");
    }
    else {
      throw err
    }
  }  
}
