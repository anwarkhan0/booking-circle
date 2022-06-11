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
    console.log(err);
    return false;
  }
  
};

const delMultImages = (names) => {
  
  try {
    const pathDir = path.join(__dirname, "../files/uploads/");
    let success;
    names.forEach((name) => {
      success = false;
      imgFullPath = pathDir + name;
      fs.unlink(imgFullPath, (err) => {
        if (err) {
          throw err;
        }else{
          success = true;
        }
      });
    });

    if(success){
      return true;
    }else{
      return false;
    }
    
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
    delImg,
    delMultImages
 }