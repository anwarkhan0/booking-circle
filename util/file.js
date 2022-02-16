const fs = require('fs');
const path = require('path');

const delImg = (name) => {
  
  try{
    imgPath = path.join(__dirname, "../files/uploads/" + name);
    fs.unlink(imgPath, (err)=> {
      if (err) throw 'Something went wrong while deleting file.';
    });
    console.log('image deleted');
    return true;
  }catch(err){
    // console.log(err);
    return false;
  }
  
};

const delMultImages = (names) => {
  
  try {
    const imgDirectory = path.join(__dirname, "../files/uploads/");
    names.map((name) => {
      imgPath = imgDirectory + name;
      fs.unlink(imgPath, (err) => {
        if (err) throw new Error();
      });
    });
    console.log("gallery deleted");
    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};

module.exports = {
    delImg,
    delMultImages
 }