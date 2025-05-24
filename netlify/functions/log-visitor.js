// netlify/functions/log-visitor.js

export async function handler(event, context) {
  try {
    const data = JSON.parse(event.body);

    const response = await fetch("https://script.google.com/macros/s/AKfycby8NGDCekI2558b4TOjzADqgU6xDkbrAnZShZ757SD6Cxa5iIe4zay7uzGeK5O279B0/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "visit",
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        page: data.page,
        referrer: data.referrer,
        userAgent: data.userAgent,
      }),
    });

    const text = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", backend: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: error.message }),
    };
  }
}
