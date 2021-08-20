const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education'); 

// Load profile Model 
const Profile = require('../../models/Profile');
//Load User model
const User = require('../../models/User');


// @route   GET api/profile/test
// @desc    Tests profile route 
// @access  public 
router.get('/test' , (req,res) => res.json({ msg : "Profiles Works"}));

// @route   GET api/profile
// @desc    Get current users profile
// @access  private 
router.get('/',passport.authenticate('jwt' , {session : false }) , (req,res) => {
  const errors = {};
  profile.findOne({ user: req.user.id })
    .populate('user',['name' , 'avatar'])
    .then(profile => { 
      if(!profile){
        erros.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }    
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    get all profiles
// @access  public
router.get('/all' , (req,res) => {
  const errors = {} ;

  profile.find()
  .populate('user',['name' , 'avatar'])
  .then(profiles => {
    if(!profiles) {
      erros.noprofile = 'There are no profiles';
      return res.status(404).json(errors);
    }
    res.json(profiles);
  })
  .catch(err => res.status(404).json({profile : 'There are no profiles '})
  );
});


// @route   GET api/profile/handle/:handle
// @desc    get profile by handle 
// @access  public

router.get('/handle/:handle' , (req,res) => {
  profile.findOne({ handle : req.params.handle })
    .populate('user' , ['name' , 'avatar'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    get profile by user ID
// @access  public

router.get('/user/:user_id' , (req,res) => {
  profile.findOne({ user : req.params.user_id })
    .populate('user' , ['name' , 'avatar'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({profile : 'There is no profile for this user '}));
});


// @route   POST api/profile
// @desc    Create or Edit User Profile
// @access  private 
router.post('/',passport.authenticate('jwt' , {session : false }) , (req,res) => {

  const { errors , isValid } = validateProfileInput(req.body);

  // Check Validation
  if(!isValid){
    //Return ans errors with 400 status 
    return res.status(400).json(errors);
  }


  // Get fields 
  const ProfileFields = {};
  ProfileFields.user = req.user.id ;      // this includes name 
  //if it was send then set it to profile handle 
  if(req.body.handle) ProfileFields.handle = req.body.handle ;
  if(req.body.company) ProfileFields.company = req.body.company ;
  if(req.body.website) ProfileFields.website = req.body.website ;
  if(req.body.location) ProfileFields.location = req.body.location ;
  if(req.body.bio) ProfileFields.bio = req.body.bio ;
  if(req.body.status) ProfileFields.status = req.body.status ;
  if(req.body.githubusername) ProfileFields.githubusername = req.body.githubusername ;
  // Skills = split into array 
  //splitting at , to give array 
  if(typeof req.body.skills !== 'undefined'){
    ProfileFields.skilss = req.body.skills.split(',');
  }
  // Social 
  ProfileFields.social = {};
  if(req.body.youtube) ProfileFields.social.youtube = req.body.youtube;  // yt ki trh aayega aur social youtube mein set 
  if(req.body.twitter) ProfileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) ProfileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) ProfileFields.social.linkedin = req.body.linkedin;
  if(req.body.instagram) ProfileFields.social.instagram = req.body.instagram;

  // agar profile ni hai to bnao 
  Profile.findOne({ user: req.user.id})
    .then(profile => {
      if(profile){
        //update 
        Profile.findByIdAndUpdate(
          { user : req.user.id } , 
          { $set: ProfileFields} , 
          { new : true}
          )
          .then(profile => res.json(profile));
      } else {
        //Create 

        // Check if handle exists
        profile.findOne({ handle : ProfileFields.handle }).then(profile => {
          if(profile){
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save Profile 
          new Profile(ProfileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile 
// @access  Private 
router.post('/experience' , passport.authenticate('jwt' , { session : false }) , (req, res) => {

  const { errors , isValid } = validateExperienceInput(req.body);

  // Check Validation
  if(!isValid){
    //Return ans errors with 400 status 
    return res.status(400).json(errors);
  }
  profile.findOne({user : req.user.id})
    .then(profile => {
      const newExp = {
        title : req.body.title ,
        company : req.body.company , 
        location : req.body.location,
        from : req.body.from , 
        to : req.body.to , 
        current : req.body.current , 
        description : req.body.description
      }

      // Add to exp Array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    })
});

// @route   POST api/profile/education
// @desc    Add education to profile 
// @access  Private 
router.post('/education' , passport.authenticate('jwt' , { session : false }) , (req, res) => {

  const { errors , isValid } = validateEducationInput(req.body);

  // Check Validation
  if(!isValid){
    //Return ans errors with 400 status 
    return res.status(400).json(errors);
  }
  profile.findOne({user : req.user.id})
    .then(profile => {
      const newEdu = {
        school : req.body.school ,
        degree : req.body.degree , 
        fieldofstudy : req.body.fieldofstudy,
        from : req.body.from , 
        to : req.body.to , 
        current : req.body.current , 
        description : req.body.description
      }

      // Add to exp Array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    })
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile 
// @access  Private 
router.post('/experience/:exp_id' , passport.authenticate('jwt' , { session : false }) , (req, res) => {

  profile.findOne({user : req.user.id})
    .then(profile => {
      // get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

        // splice out of array 
        profile.experience.splice(removeIndex , 1);

        // Save 
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile 
// @access  Private 
router.post('/education/:edu_id' , passport.authenticate('jwt' , { session : false }) , (req, res) => {

  profile.findOne({user : req.user.id})
    .then(profile => {
      // get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

        // splice out of array 
        profile.education.splice(removeIndex , 1);

        // Save 
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private 
router.post('/' , passport.authenticate('jwt' , { session : false }) , (req, res) => {
  profile.findOneAndRemove({ user : req.user.user_id})
    .then(() => {
      User.findOneAndRemove({ _id : req.user.id })
        .then( () => res.json({ success : true }));
    });

});


 module.exports = router ;       
