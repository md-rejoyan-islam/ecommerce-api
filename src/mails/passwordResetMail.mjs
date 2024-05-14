import nodemailer from "nodemailer";
import createError from "http-errors";
import {
  clientURL,
  emailPass,
  emailUser,
  smtpHost,
  smtpPort,
} from "../app/secret.mjs";
import { logger } from "../helper/logger.mjs";

const transport = nodemailer.createTransport({
  host: smtpHost, // host name
  port: smtpPort, // host port number
  auth: {
    user: emailUser, // email address
    pass: emailPass, // email password
  },
});

const sendPasswordResetMail = async (emailData) => {
  try {
    const { resetToken } = emailData;
    const mailInfo = {
      from: `"Ecommerce App" <${emailUser}>`, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: `
            <body style="background-color: #fff; min-height: 100%">
    <div style="width: fit-content; padding: 30px; margin: auto">
      <div
        class="main-container"
        style="
          width: 400px;
          background-color: #f3f4f47d;
          padding: 20px;
          border-radius: 5px;
        "
      >
        <div class="mail-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="60"
            height="60"
            x="0"
            y="0"
            viewBox="0 0 512 511"
            style="margin: auto; display: block"
          >
            <g>
              <path
                fill="#c4e2f2"
                d="M512 44.457v275.844c0 24.523-19.895 44.418-44.43 44.418H44.418C19.883 364.719 0 344.824 0 320.3V44.457C0 20.187 19.676.5 43.95.5h424.093C492.313.5 512 20.188 512 44.457zm0 0"
                opacity="1"
                data-original="#c4e2f2"
                class=""
              ></path>
              <path
                fill="#2d303b"
                d="m359.266 423.988-103.27 23.532-103.277-23.532 14.148-59.265 84.742-31.16 93.508 31.16 4.578 19.183zm0 0"
                opacity="1"
                data-original="#2d303b"
              ></path>
              <path
                fill="#3c3f4d"
                d="M512 315.066v5.223c0 24.535-19.895 44.43-44.43 44.43H44.418C19.883 364.719 0 344.824 0 320.289v-5.223zM359.266 423.988H201.309l9.57-40.082h138.816zm0 0"
                opacity="1"
                data-original="#3c3f4d"
              ></path>
              <path
                fill="#2d303b"
                d="M420.129 456.984v14.075H91.867v-14.075c0-18.222 14.774-32.996 32.996-32.996h262.27c18.222 0 32.996 14.774 32.996 32.996zm0 0"
                opacity="1"
                data-original="#2d303b"
              ></path>
              <path
                fill="#83b2c6"
                d="M457.258 364.719H225.406l11.356-109.336h209.136zm0 0"
                opacity="1"
                data-original="#83b2c6"
              ></path>
              <path
                fill="#1f81a3"
                d="m239.375 132.207-2.738 20.895-8.766 66.761c-1.578 12.024-11.816 21.012-23.95 21.012H99.286c-12.129 0-22.37-8.988-23.95-21.012l-11.503-87.656 87.773-23.512zm0 0"
                opacity="1"
                data-original="#1f81a3"
              ></path>
              <path
                fill="#2c92bf"
                d="m236.637 153.102-8.766 66.761c-1.578 12.024-11.816 21.012-23.95 21.012h-71.198c-12.133 0-22.371-8.988-23.95-21.012l-5.941-45.246c-1.496-11.398 7.379-21.515 18.875-21.515zm0 0"
                opacity="1"
                data-original="#2c92bf"
              ></path>
              <path
                fill="#1f81a3"
                d="M251.39 108.57v12.79c0 5.988-4.855 10.847-10.843 10.847H62.664c-5.988 0-10.848-4.86-10.848-10.848V108.57c0-5.988 4.86-10.847 10.848-10.847h177.883c5.988 0 10.844 4.859 10.844 10.847zm0 0"
                opacity="1"
                data-original="#1f81a3"
              ></path>
              <path
                fill="#2c92bf"
                d="M251.39 108.57v12.79c0 5.988-4.855 10.847-10.843 10.847h-136.09c-5.984 0-10.844-4.86-10.844-10.848V108.57c0-5.988 4.86-10.847 10.844-10.847h136.09c5.988 0 10.844 4.859 10.844 10.847zm0 0"
                opacity="1"
                data-original="#2c92bf"
              ></path>
              <path
                fill="#3c3f4d"
                d="M151.605 48.613c-9.812 0-17.765 7.953-17.765 17.762v84.637c0 9.812 7.953 17.765 17.765 17.765 9.81 0 17.762-7.953 17.762-17.765V66.375c0-9.809-7.953-17.762-17.762-17.762zm0 0"
                opacity="1"
                data-original="#3c3f4d"
              ></path>
              <path
                fill="#2d303b"
                d="M456.215 364.719H224.359l5.153-49.653h221.55zm0 0"
                opacity="1"
                data-original="#2d303b"
              ></path>
              <path
                fill="#ff491f"
                d="M459.48 255.379H250.348l-26.645 256.434h262.422zm0 0"
                opacity="1"
                data-original="#ff491f"
              ></path>
              <path
                fill="#ffe14d"
                d="M336.797 338.293H191.426l-18.52 173.52H355.32zm0 0"
                opacity="1"
                data-original="#ffe14d"
              ></path>
              <path
                fill="#ffffff"
                d="M411.336 288.293a7.836 7.836 0 0 1-7.84-7.836v-51.715c0-26.793-21.793-48.586-48.582-48.586-26.793 0-48.586 21.797-48.586 48.586v51.715a7.835 7.835 0 0 1-7.836 7.836 7.835 7.835 0 0 1-7.836-7.836v-51.715c0-35.433 28.824-64.258 64.258-64.258 35.43 0 64.258 28.825 64.258 64.258v51.715a7.835 7.835 0 0 1-7.836 7.836zm0 0"
                opacity="1"
                data-original="#ffffff"
              ></path>
              <path
                fill="#3c3f4d"
                d="M264.113 445.164c-22.902 0-41.535-18.633-41.535-41.535v-33.695a7.839 7.839 0 0 1 15.676 0v33.695c0 14.258 11.601 25.86 25.86 25.86 14.261 0 25.859-11.598 25.859-25.86v-33.695c0-4.329 3.507-7.836 7.836-7.836s7.836 3.507 7.836 7.836v33.695c0 22.902-18.63 41.535-41.532 41.535zm0 0"
                opacity="1"
                data-original="#3c3f4d"
              ></path>
              <path
                fill="#ff491f"
                d="M330.078 87.945h-33.437c-4.329 0-7.836-3.507-7.836-7.836s3.507-7.836 7.836-7.836h33.437c4.328 0 7.836 3.508 7.836 7.836s-3.508 7.836-7.836 7.836zm0 0"
                opacity="1"
                data-original="#ff491f"
              ></path>
              <path
                fill="#3c3f4d"
                d="M473.227 87.945H364.559c-4.329 0-7.836-3.507-7.836-7.836s3.507-7.836 7.836-7.836h108.668a7.836 7.836 0 1 1 0 15.672zm0 0"
                opacity="1"
                data-original="#3c3f4d"
              ></path>
              <path
                fill="#ff491f"
                d="M330.078 124.52h-33.437a7.839 7.839 0 0 1 0-15.676h33.437a7.839 7.839 0 0 1 0 15.676zm0 0"
                opacity="1"
                data-original="#ff491f"
              ></path>
              <path
                fill="#3c3f4d"
                d="M473.227 124.52H364.559a7.839 7.839 0 0 1 0-15.676h108.668a7.836 7.836 0 0 1 7.84 7.836 7.842 7.842 0 0 1-7.84 7.84zm0 0"
                opacity="1"
                data-original="#3c3f4d"
              ></path>
            </g>
          </svg>

          <hr
            style="
              color: gray;
              background-color: #cfcbcb;
              height: 1px;
              border: none;
              margin: 0;
              padding: 0;
            "
          />
        </div>
        <div class="mail-body" style="font-size: 20px">
          <p
            style="
              margin: 0;
              padding: 8px 4px;
              font-weight: 600;
              text-align: center;
            "
          >
            Welcome to E-commerce App
          </p>
          <p style="font-size: 17px">
            To reset password, please click the button below.
          </p>
          <div style="text-align: center">
            <a
              href="${clientURL}/api/v1/auth/activate/${resetToken}"
              target="_blank"
              style="
                background-color: #5e57da;
                color: #fff;
                padding: 6px 10px;
                text-decoration: none;
                border-radius: 5px;
                margin: auto;
                font-size: 18px;
              "
              >Reset Password</a
            >
          </div>
          <p style="text-align: center"></p>
          <p style="margin: 0; padding: 2px; font-size: 17px">
            The link expired in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  </body>
     `,
    };

    const info = await transport.sendMail(mailInfo);
    logger.info("Message sent: %s", info.messageId);
  } catch (error) {
    errorLogger.error(error);
    // console.log("Message sent failed!");
    throw createError(500, "Failed to send email");
  }
};

export default sendPasswordResetMail;
