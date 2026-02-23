import { client, sender } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emails.templates.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode,
      ),
      category: "Email Verification",
    });
    console.log(response);
  } catch (err) {
    console.log("Error sending the verification mail", err);
    throw new Error("Error sending the verification mail", err);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    client
      .send({
        from: sender,
        to: recipient,
        subject: "Welcome To ZM Shop",
        template_uuid: "d32c99dc-20b6-48c3-8e44-c51a141f9d0d",
        template_variables: {
          company_info_name: "ZM Shop",
          name: name,
        },
      })
      .then(console.log, console.error);
  } catch (err) {
    throw new Error("Failed sending Welcome Email", err);
  }
};

export const sendResetPasswordEmail = async (email, name, url) => {
  const recipients = [{ email }];

  try {
    client
      .send({
        from: sender,
        to: recipients,
        subject: "Reset Password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
          "{resetURL}",
          url,
        ).replace("{name}", name),
      })
      .then(console.log, console.error);
  } catch (err) {
    throw new Error("Failed sending reset password Email", err);
  }
};
