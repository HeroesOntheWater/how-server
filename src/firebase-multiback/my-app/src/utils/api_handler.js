import request from 'superagent';

class ApiHandler {

  static makeRequest(token, app, version, beginDate, endDate) {

    var baseUrl = "http://localhost:8080/backup?token=" + token;
    baseUrl += "&app=" + app + "&version=" + version + "&fromDate=" + beginDate + "&toDate=" + endDate;

    return request.get(baseUrl).then((res) => {

          if (res.body.length === 0) {
            alert("No files for given time period.");
            return res.body
          }
          return res.body
        }, (err)=>{
          if(err) {
              alert('Error', err);
              return;
            }
        });
    }

    static downloadAll(token, app, version, timestamp) {
      var url = "http://localhost:8080/backup/download?token=" + token + "&app=" + app +
        "&version=" + version + "&timestamp=" + timestamp;
        request.get(url).end((err, res) => {
            if (err) {
                console.log('Error', err);
            } else {
                window.open(url);
            }
        });
    }

    static downloadFile(token, app, version, timestamp) {
      var url = "http://localhost:8080/backup/download?token=" + token + "&app=" + app +
      "&version=" + version + "&timestamp=" + timestamp;
      request.get(url).end((err, res) => {
            if (err) {
                console.log('Error', err);
            } else {
                window.open(url);
            }
        });
    }
}

export default ApiHandler;
