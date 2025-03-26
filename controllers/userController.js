const User = require("../models/user");
const {setUser} = require('../services/auth');
const sendResponse = require("../utils/sendResponse");
const bcrypt = require('bcrypt');

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({}).select('-password -__v');
  return sendResponse(res, {
    data: allDbUsers
  });
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    sendResponse(res, {
      status: 404,
      success: false,
      error: 'User Not Found'
    });
  }
  return sendResponse(res, {
    message: 'User fetched successfully',
    data: user
  });
}


async function handleUpdateUserById(req, res) {
  const { id } = req?.params;
  const body = req.body;
  await User.findByIdAndUpdate(id, body);
  return sendResponse(res, {
    message: 'User updated successfully',
  });
}

async function handleDeleteUserById(req, res) {
  const { id } = req?.params;
  await User.findByIdAndDelete(id);
  return sendResponse(res, {
    message: 'User deleted successfully',
  });
}

async function handleApproveOrDeclineUser(req, res) {
  try {
    const { id } = req.params;
    const { approved } = req.body; // true for approval, false for decline

    // Validate input
    if (typeof approved !== "boolean") {
      return sendResponse(res, {
        status: 400,
        success: false,
        error: "Invalid request. 'approved' must be true or false.",
      });
    }

    // Find and update user approval status
    const user = await User.findByIdAndUpdate(id, { status: approved ? 'Approve' : 'Decline' }, { new: true });
    
    if (!user) {
      return sendResponse(res, {
        status: 404,
        success: false,
        error: "User not found.",
      });
    }

    return sendResponse(res, {
      success: true,
      message: `User has been ${approved ? "approved" : "Declined"} successfully.`,
      data: user,
    });
  } catch (error) {
    console.error("Approval Error:", error);
    return sendResponse(res, {
      status: 500,
      success: false,
      error: "Something went wrong. Please try again later.",
    });
  }
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
    return sendResponse(res, {
      status: 400,
      success: false,
      error: 'All fields are required to proceed for signup'
    });
  }
  if (body.role !== 'Organizer' && body.role !== 'Participant') {
    return sendResponse(res, {
      status: 400,
      success: false,
      error: "Role must be either 'Organizer' or 'Participant'"
    });
  }
  const users = await User.find({});
  const isEmailExist = users.find(e => (e.email === body.email));
  const isPhoneExist = users.find(e => (e.phone_number === body.phone_number));
  if(isEmailExist) {
    return sendResponse(res, {
      status: 404,
      success: false,
      error: 'Email already exist'
    });
  }
  if(isPhoneExist) {
    return sendResponse(res, {
      status: 404,
      success: false,
      error: 'Phone number already exist'
    });
  }
  
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const result = await User.create({
    full_name: body.full_name,
    email: body.email,
    phone_number: body.phone_number,
    password: hashedPassword, // Save the hashed password
    role: body.role
  });
  return sendResponse(res, {
    status: 201,
    message: 'User created successfully',
    data: {id: result._id}
  });
}

async function handleLogin(req, res) {
  res.clearCookie("uid");
  const body = req.body;
  const {email, password} = body;
  const user = await User.findOne({email});
  if(!user) {
    return sendResponse(res, {
      status: 404,
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Compare the provided password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return sendResponse(res, {
      status: 404,
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Check if user is approved
  if (user.status != 'Approve') {
    return sendResponse(res, {
      status: 403,
      success: false,
      error: "Your account is pending approval. Please wait for an organizer's approval.",
    });
  }


  const token = setUser(user);
  res.cookie("uid", token);
  return sendResponse(res, {
    data: {token, user: user.toObject()}
  });
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleApproveOrDeclineUser,
  handleSignup,
  handleLogin
};
