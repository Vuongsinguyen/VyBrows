import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const {
  ZOHO_USER,
  ZOHO_PASS,
  ZOHO_SMTP_HOST = 'smtppro.zoho.com'
} = process.env;

function createTransport(port465 = true) {
  return nodemailer.createTransport({
    host: ZOHO_SMTP_HOST,
    port: port465 ? 465 : 587,
    secure: port465,
    auth: { user: ZOHO_USER, pass: ZOHO_PASS }
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST')
    return { statusCode:405, body:'Method Not Allowed' };

  if (!ZOHO_USER || !ZOHO_PASS)
    return { statusCode:500, body: JSON.stringify({ success:false, error:'Env missing' }) };

  let data:any = {};
  try { data = JSON.parse(event.body || '{}'); }
  catch { return { statusCode:400, body: JSON.stringify({ success:false, error:'Bad JSON' }) }; }

  const { name='', email='', phone='', service='', message='' } = data;

  let transporter = createTransport(true);
  try {
    await transporter.verify();
  } catch {
    transporter = createTransport(false);
    try { await transporter.verify(); }
    catch {
      return { statusCode:500, body: JSON.stringify({
        success:false,
        error:'SMTP auth failed (kiểm tra App Password / host / env)'
      }) };
    }
  }

  const subject = `Contact Form: ${service || 'General'} - ${name || 'Visitor'}`;
  const text = [
    'New Contact Form Submission',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    'Message:',
    message
  ].join('\n');
  const html = text.replace(/\n/g,'<br>');

  try {
    const info = await transporter.sendMail({
      from: `"VyBrows Contact" <${ZOHO_USER}>`,
      to: 'contact@vybrows-academy.com',   // Zoho hộp thư chính (Zoho đã tự CC Gmail bằng rule)
      replyTo: email || ZOHO_USER,
      subject,
      text,
      html
    });
    console.log('Accepted:', info.accepted, 'Rejected:', info.rejected);
    return { statusCode:200, body: JSON.stringify({ success:true }) };
  } catch (e:any) {
    const raw = e?.message || '';
    return { statusCode:500, body: JSON.stringify({
      success:false,
      error:/535/i.test(raw)?'SMTP auth failed (App Password sai / chưa cập nhật)':raw
    }) };
  }
};

<script>
(function(){
  function showStatus(msg,type){
    const box=document.getElementById('formStatus');
    if(!box) return;
    box.className='';
    box.classList.add('show', type==='error'?'error':(type==='success'?'success':''));
    box.textContent=msg;
    setTimeout(()=>{ if(type==='success') box.classList.remove('show'); },4000);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('contactForm');
    if(!form) return;
    const btn=form.querySelector('button[type="submit"]');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(form.dataset.sending==='1') return;
      form.dataset.sending='1';
      btn.disabled=true; const old=btn.textContent; btn.textContent='Sending...';
      showStatus('Đang gửi...','info');
      const fd=new FormData(form); const payload:any={}; fd.forEach((v,k)=>payload[k]=String(v));
      try{
        const r=await fetch('/.netlify/functions/sendMail',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
        let j={}; try{ j=await r.json(); }catch{}
        if(r.ok && (j as any).success){
          showStatus('✅ Gửi thành công!','success');
          form.reset();
        } else {
          showStatus('❌ Gửi thất bại: '+((j as any).error||r.status),'error');
        }
      }catch{
        showStatus('❌ Lỗi mạng','error');
      }finally{
        btn.disabled=false; btn.textContent=old;
        delete form.dataset.sending;
      }
    });
  });
})();
</script>