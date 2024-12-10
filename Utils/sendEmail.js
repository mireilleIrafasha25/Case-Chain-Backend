import nodemailer from 'nodemailer';

export const sendEmail = (recipient, subject, htmlBody) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Add this line to accept self-signed certificates
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        html: htmlBody, 
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err.message);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
