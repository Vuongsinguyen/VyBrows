import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const { ZOHO_USER, ZOHO_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: { user: ZOHO_USER, pass: ZOHO_PASS }
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  if (!ZOHO_USER || !ZOHO_PASS)
    return { statusCode: 500, body: JSON.stringify({ success:false, error:'Env missing' }) };

  let data: any = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch { return { statusCode:400, body: JSON.stringify({ success:false, error:'Bad JSON' }) }; }

  const { name='', email='', phone='', service='', message='' } = data;

  const plain = [
    'New Contact Form Submission',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    'Message:',
    message
  ].join('\n');

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Service:</b> ${service}</p>
    <p><b>Message:</b><br>${String(message).replace(/\n/g,'<br>')}</p>
    <p style="margin-top:18px;font-size:12px;color:#666">Sent from website form.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"VyBrows Contact" <${ZOHO_USER}>`,
  // Gửi trực tiếp tới Gmail theo yêu cầu
  to: 'vuongsi.nguyen@gmail.com',
  // Nếu muốn vẫn nhận bản sao nội bộ, bật dòng dưới:
  // bcc: 'contact@vybrows-academy.com',
      replyTo: email || ZOHO_USER,
      subject: `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`,
      text: plain,
      html,
      headers: {
        'List-Unsubscribe': `<mailto:${ZOHO_USER}>`,
        'X-Source': 'vybrows-form'
      }
    });
    console.log('Accepted:', info.accepted, 'Rejected:', info.rejected);
    return { statusCode:200, body: JSON.stringify({ success:true }) };
  } catch (e:any) {
    console.error('Send error:', e?.response || e?.message || e);
    return { statusCode:500, body: JSON.stringify({ success:false, error: e?.message || 'Send failed' }) };
  }
};

<script>
(function() {
  function showToast(msg, type = 'info') {
    let wrap = document.getElementById('toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast-item ' + (type === 'error' ? 'error' : (type === 'success' ? 'success' : ''));
    el.role = 'status';
    el.innerText = msg;
    wrap.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 4000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Prefill từ query params
    const params = new URLSearchParams(location.search);
    ['name','email','phone','service','message'].forEach(k => {
      const v = params.get(k);
      if (!v) return;
      const field = form.querySelector('[name="'+k+'"]');
      if (field) field.value = v;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.sending === '1') return; // chặn double submit
      form.dataset.sending = '1';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
      }

      showToast('Đang gửi...', 'info');

      const fd = new FormData(form);
      const payload = {};
      fd.forEach((val, key) => payload[key] = String(val));

      try {
        const res = await fetch('/.netlify/functions/sendMail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        let result = {};
        try { result = await res.json(); } catch {}

        if (res.ok && result.success) {
          showToast('✅ Gửi thành công!', 'success');
          form.reset();
        } else {
          showToast('❌ Gửi thất bại: ' + (result.error || res.status + ' Error'), 'error');
        }
      } catch (err) {
        showToast('❌ Lỗi mạng (không gửi được)', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
        }
        delete form.dataset.sending;
      }
    });
  });
})();
</script>