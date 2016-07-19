const router = require('express').Router;



router.get('/:folderName/files/:fileName/:extension', (req, res, next) => {
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

router.put('/:folderName/files/:fileName/:extension', (req, res, next) => {
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

router.get('', (req, res, next) => {
  var foldersToSend = [];
  fs.readdir('app', (err, list) => {
    console.log(list);
    if (err) { console.log(err); }
    if (list) {
      list.forEach((item) => {
        if (isFolder(item)) {
          foldersToSend
          .push({
            name: item,
            type: 'folder'
          });
        } else {
          foldersToSend
          .push({
            name: item,
            type: 'file'
          });
        }
      });
      res.send({
        status: true,
        items: foldersToSend
      });
    }
  });
});

router.post('', (req, res, next) => {
  const newItemType = req.body.type;
  const itemName = req.body.name;
  const itemExt = req.body.extension ? req.body.extension : null;
  const parentFolder = req.body.parent;
  if (newItemType === 'folder') {
    console.log(`${__dirname}/${parentFolder}/${itemName}`);
    fs.mkdir(`${__dirname}/${parentFolder}/${itemName}`, (err) => {
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
    fs.writeFile(`${__dirname}/${parentFolder}/${itemName}${itemExt}`, '', (err) => {
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

router.get('/:name', (req, res, next) => {
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

router.delete('/:name', (req, res, next) => {
  const itemName = req.params.name;
  const itemType = req.query.type;
  res.send({
    status: true,
    data: itemType
  });
});

module.exports = router;