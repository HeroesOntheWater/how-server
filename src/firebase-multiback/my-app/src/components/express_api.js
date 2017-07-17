import request from 'superagent';
import React from 'react';

const ExpressApi = (props) => {
  const url = 'http://localhost:8080/backup/apps?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MDAyNDE5MjF9.qEPsG9m07luztQiLOvL5Ym1lIZY1tsbmSbXjhcMP5Hk';
  var response;
  request.get(url)
    .end((err, res) => {
      if(!err && res) {
        return <h1>yes</h1>;
      } else {
        return <h1>no</h1>
      }
    }
  );

  return <h1>Val</h1>
}

export default ExpressApi;
