function onSubmit(e) {
  Logger.clear();
  Logger.log("application received")

  var items = e.response.getItemResponses();
  var formData = {};
  
  for (i in items){
    formData[items[i].getItem().getTitle()] = items[i].getResponse();
  }
  
  var url = "https://seraphapplicationautomation.azurewebsites.net/api/seraphapplicationautomation";
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(formData)
  };
  
  Logger.log("constructed request body: " + JSON.stringify(response));
  Logger.log("sending request to " + url);6
  var response = UrlFetchApp.fetch(url, options);
  Logger.log("response received: " + JSON.stringify(response.getContentText()));
}
