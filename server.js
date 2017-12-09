const express = require('express');
const app = express();
app.use(express.static('public'));
let server;

function runServer() {

return new Promise((resolve, reject) => {
	server = app.listen(8080, () => {
	        console.log(`Your app is listening on port 8080`);
	        resolve();
	      }) 
			.on('error', err => {
        	reject(err);
      });

  // return new Promise((resolve, reject) => {
  //   mongoose.connect(databaseUrl, err => {
  //     console.log(databaseUrl);
  //     if (err) {
  //       return reject(err);
  //     }
  //     server = app.listen(port, () => {
  //       console.log(`Your app is listening on port ${port}`);
  //       resolve();
  //     })
  //     .on('error', err => {
  //       mongoose.disconnect();
  //       reject(err);
  //     });
  //   });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
	return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
	
  // return mongoose.disconnect().then(() => {
  //    return new Promise((resolve, reject) => {
  //      console.log('Closing server');
  //      server.close(err => {
  //          if (err) {
  //              return reject(err);
  //          }
  //          resolve();
  //      });
  //    });
  // });
}

if (require.main === module) { 
  runServer().catch(err => console.error(err)); 
}

module.exports = { app, runServer, closeServer};