import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import passport from "passport";
dotenv.config();


export const createUser = async (req, res) => {
  try {
    const user = new User({ ...req.body, isVerified: false });
        
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user.save().then(user => res.json(user)).catch(err => res.json({ msg: `DUPLICATE ERROR.`, err }));
      });
    });
    console.log(user);
    //const data = await user.save();
    //res.status(200).json({ msg: `SUCCESS.`, data });
  } catch (err) {
    res.status(400).json({ msg: `ERROR: ${err}` });
  }
};

export const loginUser = async (req, res) => {

  let errors = {};
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user

    console.log(req.body.email);
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name }; // Create JWT Payload
        console.log(payload);
        // Sign Token
        jwt.sign(
          payload,
          process.env.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });

            //console.log(keys.secretOrKey);
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });

};




export const deleteUser = async (req, res) => {
  try {
    console.log();
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: `Successfully deleted user`, user });
  } catch (err) {
    res.status(400).json({ msg: `ERROR: ${err}` });
  }
};

//@route GET /user/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ msg: `SUCCESS.`, user });
  } catch (err) {
    res.status(400).json({ msg: `ERROR: ${err}` });
    console.log(err);
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ msg: `SUCCESS.`, user });
  } catch (err) {
    res.status(400).json({ msg: `ERROR: ${err}` });
    console.log(err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    console.log(user);
    res.status(200).json({ msg: `Succesfully updated user.`, user });
  } catch (err) {
    res.status(400).json({ msg: `ERROR: ${err}` });
  }
};