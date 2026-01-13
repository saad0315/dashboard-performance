const nodemailer = require("nodemailer");

const emailSend = async (options) => {
  // Create Nodemailer transporter using environment variables
  let transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICES, // e.g., 'gmail'
    port: parseInt(process.env.SMPT_PORT), // Ensure port is a number (e.g., 465)
    secure: true, // Use true for port 465 (SSL/TLS)
    host: process.env.SMPT_SERVICES, // Should be the SMTP host (e.g., 'smtp.gmail.com')
    debugger: true, // Enable debug output
    logger: true, // Enable logging for debugging
    auth: {
      user: process.env.PULP_SMTP_USER, // Use environment variable for SMTP user
      pass: process.env.PULP_SMTP_PASS, // Use environment variable for SMTP password
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.SMPT_FROM || "Forgot Password", // Fallback to options.from if needed
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || undefined, // Include HTML if provided, otherwise undefined
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = emailSend;