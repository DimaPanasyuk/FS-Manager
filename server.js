const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
const isFolder = require('./server/utils/isFolder');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/api/check/:name', (req, res, next) => {
  fs.readdir(`${__dirname}/app/${req.params.name}`, (err, files) => {
    console.log(files);
    if (err) console.log(err);
    if (files.length) {
      res.send({
        status: true,
        content: true
      });
    } else {
      res.send({
        status: true,
        content: false
      });
    }
  });
});


app.get('/api/folders/:folderName/files/:fileName/:extension', (req, res, next) => {
  const folderName = req.params.folderName;
  const fileName = req.params.fileName;
  const extension = req.params.extension;
  fs.readFile(`${__dirname}/${folderName}/${fileName}.${extension}`, (err, data) => {
    if (err) console.log(err);
    if (data) {
      res.send({
        status: true,
        file: {
          name: fileName,
          content: data.toString()
        }
      });
    }
  });
});

app.put('/api/folders/:folderName/files/:fileName/:extension', (req, res, next) => {
  const folderName = req.params.folderName;
  const fileName = req.params.fileName;
  const extension = req.params.extension;
  const fileData = req.body.newContent;

  fs.writeFile(`${__dirname}/${folderName}/${fileName}.${extension}`, fileData, (err, data) => {
    if (err) console.log(err);
    if (!err) {
      res.send({
        status: true
      });
    }
  });
});

app.get('/api/items', (req, res, next) => {
  var foldersToSend = [];
  const folderPath = `${__dirname}/app`;
  fs.readdir('app', (err, list) => {
    console.log(list);
    if (err) { console.log(err); }
    if (list) {
      list.forEach((item) => {
        if (isFolder(item)) {
          foldersToSend
          .push({
            name: item,
            type: 'folder',
            path: `${folderPath}/${item}`
          });
        } else {
          foldersToSend
          .push({
            name: item,
            type: 'file',
            path: `${folderPath}/${item}`
          });
        }
      });
      res.send({
        status: true,
        rootPath: `${__dirname}/app`,
        items: foldersToSend
      });
    }
  });
});

app.post('/api/items', (req, res, next) => {
  const itemType = req.body.type;
  const itemName = req.body.name;
  const itemExt = req.body.extension ? req.body.extension : null;
  const itemPath = req.body.folderPath; 
  if (itemType === 'folder') {
    console.log(`${itemPath}`);
    fs.mkdir(`${itemPath}/${itemName}`, (err) => {
      if (err) {
        res.send({
          status: false,
          message: 'Such folder exists'
        });
      } else {
        res.send({
          status: true
        });
      }
    });
  } else {
    fs.writeFile(`${itemPath}/${itemName}${itemExt}`, '', (err) => {
      if (err) {
        res.send({
          status: false
        });
      } else {
        res.send({
          status: true
        });
      }
    });
  }
});

app.get('/api/folders/:name', (req, res, next) => {
  const dirPath = `${__dirname}/app/${req.params.name}`;
  var dataToSend = [];
  fs.exists(dirPath, (exists) => {
    if (exists) {
      fs.readdir(dirPath, (err, items) => {
        if (err) console.log(err);
        if (!items.length) {
          res.send({
            status: true,
            items: 0
          });
        } else {
          items.forEach((item) => {
            if (isFolder(item)) {
              dataToSend.push({
                name: item,
                type: 'folder'
              });
            } else {
              dataToSend.push({
                name: item,
                type: 'file'
              });
            }
          });
          res.send({
            status: true,
            items: dataToSend 
          });
        }
      });
    }
  });
});

app.delete('/api/folders/:name', (req, res, next) => {
  const itemName = req.params.name;
  const itemExt = (req.query.ext) ? req.query.ext : null;
  const itemType = req.query.type;
  const parentFolder = req.query.parent;
  if (itemType === 'folder') {
    fs.rmdir(`${__dirname}/${parentFolder}/${itemName}`, (err) => {
      if (err) {
        res.send({
          status: false,
          message: err.toString()
        });
      } else {
        res.send({
          status: true
        });
      }
    });
  } else {
    fs.unlink(`${__dirname}/${parentFolder}/${itemName}.${itemExt}`, (err) => {
      if (err) {
        res.send({
          status: false,
          message: err.toString()
        });
      } else {
        res.send({
          status: true
        });
      }
    });
  }
});

app.use('/app', express.static('./public/app'));
app.get('*', (req, res, next) => {
  res.sendFile(`${__dirname}/server/views/index.html`);
});

app.listen(3000);