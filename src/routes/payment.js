const { sendEmail } = require('../helpers');
const Key = require('../models/key');
const { generateStrongPassword } = require('../shared/helpers');
require('dotenv').config();

const payment = async (req, res) => {
  try {
    const {email} = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'All payment fields are required' 
      });
    }

    const code = await generateStrongPassword(5);
    
    const newKey = new Key({
      key: code,
      active: true,
      email: email
    });
    await newKey.save();
    
    await sendEmail({
      email,
      code,
      subject: "Your creation key."
    });

    return res.json({
      success: true,
      code: code
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed in server"
    });
  }
};

module.exports = { payment };