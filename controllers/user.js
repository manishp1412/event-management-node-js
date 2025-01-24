const User = require("../models/user");
const {setUser} = require('../services/auth');
async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User Not Found" });
  }
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  const { id } = req?.params;
  const body = req.body;
  await User.findByIdAndUpdate(id, body);
  return res.json({ status: "Success" });
}

async function handleDeleteUserById(req, res) {
  const { id } = req?.params;
  await User.findByIdAndDelete(id);
  return res.json({ status: "Success" });
}


async function handleSignup(req, res) {
  const body = req.body;
  console.log('signup body ', JSON.stringify(req.body));
  if (
    !body ||
    !body.full_name ||
    !body.email ||
    !body.phone_number ||
    !body.password ||
    !body.role 
  ) {
    return res.status(400).json({ error: "All fields are required to proceed for signup" });
  }
  if (body.role !== 'Organizer' && body.role !== 'Participant') {
    return res.status(400).json({ error: "Role must be either 'Organizer' or 'Participant'" });
  }
  const users = await User.find({});
  const isEmailExist = users.find(e => (e.email === body.email));
  const isPhoneExist = users.find(e => (e.phone_number === body.phone_number));
  if(isEmailExist) {
    return res.status(404).json({error: 'Email already exist'});
  }
  if(isPhoneExist) {
    return res.status(404).json({error: 'Phone number already exist'});
  }
  const result = await User.create({
    full_name: body.full_name,
    email: body.email,
    phone_number: body.phone_number,
    password: body.password,
    role: body.role
  });
  console.log("created user ", result);
  return res.status(201).json({ msg: "success", id: result._id });
}

async function handleLogin(req, res) {
  res.clearCookie("uid");
  const body = req.body;
  const {email, password} = body;
  const user = await User.findOne({email, password});
  if(!user) {
    return res.status(404).json({error: 'Invalid email or password'});
  }
  const token = setUser(user);
  console.log('token ', token);
  res.cookie("uid", token);
  return res.status(201).json({ msg: "success", token, user: user.toObject() });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleSignup,
  handleLogin
};
