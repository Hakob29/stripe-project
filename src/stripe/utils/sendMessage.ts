import * as nodemailer from "nodemailer";


export function sendMessage(email: string, text: string){
    const transport =  nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "hakobyan29001@gmail.com",
            pass: "jflrbfrymejqkeif"
        }
    })
    const mailOption = {
        from: "hakobyan29001@gmail.com",
        to:   email,
        subject: "About Paymont...",
        text: text
    }
    transport.sendMail(mailOption, () => {
        console.log("Message send...");
    })
}