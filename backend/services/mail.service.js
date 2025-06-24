require("dotenv").config();
const nodemailer = require("nodemailer");
const { logger } = require("../utils/logger");
const { ErrorHandler } = require("../helpers/error");

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD, // Use app password for Gmail
      },
    });
    return transporter;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

const url =
  process.env.NODE_ENV === "production"
    ? "https://pern-store.netlify.app"
    : "http://localhost:3000";

const signupMail = async (to, name) => {
  try {
    const message = {
      from: process.env.SMTP_FROM || "pernstore.shop@gmail.com",
      to,
      subject: "Welcome to PERN Store",
      html: `
        <p style="text-align: center;"><strong><span style="font-size: 17px;">Thank you for joining us 😃</span></strong></p>
        <p style='box-sizing: inherit; margin: 0px 0px 26px; padding: 0px; border: 0px; font-size: 19px !important; vertical-align: baseline; background: transparent; text-size-adjust: none; font-weight: 300 !important; line-height: 30px !important; color: rgb(12, 15, 51); font-family: "IBM Plex Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'>Dear ${name}
        <br><br>
        Welcome to PERN Store! We're excited to have you on board. Start exploring our amazing products and enjoy your shopping experience.
        <br><br>
        <a href="${url}>Continue shopping</a></p>
        <p style='box-sizing: inherit; margin: 0px 0px 26px; padding: 0px; border: 0px; font-size: 19px !important; vertical-align: baseline; background: transparent; text-size-adjust: none; font-weight: 300 !important; line-height: 30px !important; color: rgb(12, 15, 51); font-family: "IBM Plex Sans", sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;'><br></p>  
      `,
    };

    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(message);
  } catch (error) {
    logger.error(error);
  }
};

const forgotPasswordMail = async (token, email) => {
  try {
    const message = {
      from: process.env.SMTP_FROM || "pernstore.shop@gmail.com",
      to: email,
      subject: "Forgot Password",
      html: `
        <p>To reset your password, please click the link below.
          <a 
            href="${url}/reset-password?token=${encodeURIComponent(
        token
      )}&email=${email}"
          >
          <br/>
          Reset Password
          </a></p>
        <p>
          <b>Note that this link will expire in the next one(1) hour.</b>
        </p>`,
    };

    const emailTransporter = await createTransporter();
    return await emailTransporter.sendMail(message);
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler(500, error.message);
  }
};

const resetPasswordMail = async (email) => {
  try {
    const message = {
      from: process.env.SMTP_FROM || "pernstore.shop@gmail.com",
      to: email,
      subject: "Password Reset Successful",
      html: "<p>Your password has been changed successfully.</p>",
    };

    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(message);
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler(500, error.message);
  }
};

const sendDiscountNotificationMail = async (to, name, products) => {
  try {
    const productsList = products.map(product => {
      const discountedPrice = product.price * (1 - product.discount_percentage / 100);
      return `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; display: flex; align-items: center;">
          <div style="flex-shrink: 0; margin-right: 15px;">
            <img src="${product.image_url}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
          </div>
          <div style="flex-grow: 1;">
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">${product.name}</h3>
            <p style="margin: 5px 0; color: #666; font-size: 14px; line-height: 1.4;">${product.description.substring(0, 100)}...</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
              <div>
                <span style="text-decoration: line-through; color: #999; font-size: 14px;">Rs ${product.price.toFixed(2)}</span>
                <span style="color: #e74c3c; font-weight: bold; font-size: 18px; margin-left: 10px;">Rs ${discountedPrice.toFixed(2)}</span>
              </div>
              <span style="background: #e74c3c; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                ${product.discount_percentage}% OFF
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const message = {
      from: process.env.SMTP_FROM || "pernstore.shop@gmail.com",
      to,
      subject: "🔥 Hot Deals Alert! Products on Sale",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e74c3c; margin: 0;">🔥 SALE ALERT! 🔥</h1>
            <p style="color: #666; font-size: 16px;">Don't miss out on these amazing deals!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Hi ${name},</h2>
            <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
              We've got some fantastic products on sale just for you! Check out these amazing discounts below:
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            ${productsList}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Shop Now
            </a>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="color: #666; font-size: 14px; margin: 0; text-align: center;">
              <strong>Hurry!</strong> These deals won't last forever. Sale ends soon!
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              You received this email because you're subscribed to our sale notifications.<br>
              To unsubscribe, please contact our support team.
            </p>
          </div>
        </div>
      `,
    };

    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(message);
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler(500, error.message);
  }
};

module.exports = {
  signupMail,
  resetPasswordMail,
  forgotPasswordMail,
  sendDiscountNotificationMail,
};
