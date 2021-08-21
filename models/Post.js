const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema 
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'  
  },
  text:{
    type: String , 
    required: true 
  },
  name : {
    type: String 
  },
  avatar: {
    type: String 
  },
  //everyone that likes its userid goes into the array
  likes:[
    {
      user:{
        type: Schema.Types.ObjectId,
        ref: 'user'    
      }
    }
  ],
  Comments: [
    {
      user:{
        type: Schema.Types.ObjectId,
        ref: 'user'    
      },
      text: {
        type:String,
        required:true  
      },
      name : {
        type: String 
      },
      avatar: {
        type: String 
      },
      date: {
        type:Date , 
        default : Date.now 
      }
    }
  ],
  date: {
    type:Date , 
    default : Date.now 
  }
});

module.exports = Post = mongoose.model('post',PostSchema);
