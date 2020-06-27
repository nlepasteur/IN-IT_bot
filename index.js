const express = require('express');

const app = express();

app.use(express.json());

require('./backend/server/routes/dialogFlowRoutes')(app);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));

//   const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT);
console.log(`Server is listening on port ${PORT}`);
console.log('process.env.PORT: ', process.env.PORT);
// console.log('PATH: ', path);
