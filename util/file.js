const fs = require('fs');
const path = require('path');

const delImg = (name) => {
  
  imgPath = path.join(__dirname, "../files/uploads/" + name);
  let flag = false;
  fs.unlink(imgPath, (err) => {
    if (err) throw 'Something went wrong while deleting file.';
    console.log('image deleted');
    flag = true;
  });

  if(flag){
    return true;
  }else{
    return false;
  }
  
};

const delMultImages = (images) => {

  const pathDir = path.join(__dirname, "../files/uploads/");

  let len = images.length;
  images.forEach(image => {
    fs.unlink(pathDir + image, (err) => {
      if (err) console.log(err);
      len--;
    })
  })

  if (len === 0) {
    console.log('all files deleted');
    return true;
  } else {
    return false;
  }
};

module.exports = {
    delImg,
    delMultImages
 }