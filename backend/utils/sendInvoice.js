

const { text } = require("body-parser")
const nodeMailer = require("nodemailer")

const sendInvoice = async (options)=>{
    let transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICES,
        port : process.env.SMPT_PORT,
        secure:true,
        host: process.env.SMPT_SERVICES,
        debugger: true,
        logger : true,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    });

    const mailOptions = {
        from : process.env.SMPT_MAIL, 
        to : options.email,
        subject : options.subject,
        text : options.message,
        html : options.html
    }
     
    await transporter.sendMail(mailOptions)
        
}

module.exports = sendInvoice 