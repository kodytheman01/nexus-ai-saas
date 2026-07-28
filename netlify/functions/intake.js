const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { engineSlug, userInput, userEmail, name, phone, message } = data;

    const emailContent = `
      === APEX CAPITAL ADMIN INTAKE ===
      Date: ${new Date().toISOString()}
      From: ${name || "Lead"} <${userEmail || data.email || "N/A"}>
      Phone: ${phone || "N/A"}
      
      Engine/Service: ${engineSlug || "General Inquiry"}
      Input Parameters / Message:
      ${userInput || message || "No input details provided."}
    `;

    const gmailUser = process.env.GMAIL_USER || "admin@apexcapitaladmin.com";
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailPass) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "GMAIL_APP_PASSWORD is not configured" }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `"Apex Capital Intake" <${gmailUser}>`,
      to: "admin@apexcapitaladmin.com",
      subject: `[NEW INTAKE] ${engineSlug ? `Engine: ${engineSlug}` : "Website Lead"}`,
      text: emailContent,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Intake received and routed to admin@apexcapitaladmin.com",
        redirectUrl:
          process.env.INTAKE_REDIRECT_URL ||
          "https://www.signwell.com/app/templates",
      }),
    };
  } catch (err) {
    console.error("Intake Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process intake payload",
        details: err.message,
      }),
    };
  }
};
