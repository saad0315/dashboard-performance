// const { text } = require("body-parser")
// const nodeMailer = require("nodemailer")
// const crypto = require('crypto');


// const sendEmail = async (options)=>{
//     console.log(options);
//     const generateRandomHex = (length) => {
//         return crypto.randomBytes(Math.ceil(length / 2))
//           .toString('hex') // convert to hexadecimal format
//           .slice(0, length); // trim to desired length
//       };
//     const messageId = generateRandomHex(24);
//     let transporter = nodeMailer.createTransport({
//         service: process.env.SMPT_SERVICES,
//         port : process.env.SMPT_PORT,
//         secure:true,
//         host: process.env.SMPT_SERVICES,
//         // debugger: true,
//         // logger : true,
//         auth: {
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD
//         }
//     });

//     const mailOptions = {
//         from : process.env.SMPT_MAIL, 
//         to : options.email,
//         subject : options.subject,
//         text : options.message,
//         cc: options.cc,
//         messageId: `${messageId}@bellevuepublishers.com`,
//         references: `<${messageId}@your_domain.com>`,
//         'in-reply-to': `<${messageId}@your_domain.com>`,
//         // html : options.html
//     }
//     console.log(mailOptions);
//     await transporter.sendMail(mailOptions)
    
// }

// module.exports = sendEmail 




const { text } = require("body-parser")
const nodeMailer = require("nodemailer")

const sendEmail = async (options)=>{
    let transporter = nodeMailer.createTransport({
        service: process.env.SMPT_SERVICES,
        port : process.env.SMPT_PORT,
        secure:true,
        host: process.env.SMPT_SERVICES,
        debugger: true,
        logger : true,
        auth: {
            user: options.smtp.user,
            pass: options.smtp.pass
        }
    });

    const mailOptions = {
        from : options.from, 
        to : options.email,
        subject : options.subject,
        text : options.message,
        html : options.html
    }
     
    await transporter.sendMail(mailOptions)
        
}

module.exports = sendEmail 


// const { text } = require("body-parser")
// const nodeMailer = require("nodemailer")

// const sendEmail = async (options)=>{
//     let transporter = nodeMailer.createTransport({
//         service: process.env.SMPT_SERVICES,
//         port : process.env.SMPT_PORT,
//         secure:true,
//         host: process.env.SMPT_SERVICES,
//         debugger: true,
//         logger : true,
//         auth: {
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD
//         }
//     });

//     const mailOptions = {
//         from : process.env.SMPT_MAIL, 
//         to : options.email,
//         subject : options.subject,
//         text : options.message,
//         html : options.html
//     }
     
//     await transporter.sendMail(mailOptions)
        
// }

// module.exports = sendEmail 