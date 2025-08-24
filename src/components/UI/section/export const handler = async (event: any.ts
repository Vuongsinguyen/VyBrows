export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const token = body.turnstileToken as string | undefined;
    if (!token) return { statusCode: 400, body: JSON.stringify({ success:false, error:'Missing captcha token' }) };

    const secret = process.env.TURNSTILE_SECRET_KEY!;
    const ipHeader = event.headers['x-forwarded-for'];
    const ip = Array.isArray(ipHeader) ? ipHeader[0] : (ipHeader || '');

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip })
    }).then(r => r.json());

    if (!verifyRes?.success) {
      return { statusCode: 400, body: JSON.stringify({ success:false, error:'Captcha failed' }) };
    }

    // TODO: gửi email (SMTP, SendGrid, Resend, v.v.)
    return { statusCode: 200, body: JSON.stringify({ success:true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ success:false, error:'Server error' }) };
  }
};