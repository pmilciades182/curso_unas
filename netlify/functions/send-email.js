exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      nombre, email, telefono, dni,
      ciudad, fuente, nivel, comprobante, comprobanteName,
    } = JSON.parse(event.body);

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#831843,#e91e8c);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:24px;">💅 Nueva Inscripción al Curso</h1>
        </div>
        <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="color:#1a1a2e;margin-bottom:20px;">Datos de la alumna</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;width:150px;font-size:14px;">Nombre completo</td>
              <td style="padding:10px 0;font-weight:600;">${nombre}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;font-size:14px;">Email</td>
              <td style="padding:10px 0;font-weight:600;">${email}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;font-size:14px;">Teléfono</td>
              <td style="padding:10px 0;font-weight:600;">${telefono}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;font-size:14px;">DNI</td>
              <td style="padding:10px 0;font-weight:600;">${dni}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;font-size:14px;">Ciudad</td>
              <td style="padding:10px 0;font-weight:600;">${ciudad || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 0;color:#6b7280;font-size:14px;">Nivel de experiencia</td>
              <td style="padding:10px 0;font-weight:600;">${nivel || '—'}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:14px;">¿Cómo nos conoció?</td>
              <td style="padding:10px 0;font-weight:600;">${fuente || '—'}</td>
            </tr>
          </table>
          <div style="margin-top:24px;background:#fce7f3;border-radius:8px;padding:14px;font-size:13px;color:#9d174d;">
            📎 El comprobante de transferencia se adjunta en este correo.
          </div>
          <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
            Este correo fue generado automáticamente desde el formulario de inscripción del curso online de uñas.
          </p>
        </div>
      </div>
    `;

    const payload = {
      sender: { name: 'Inscripciones Curso Uñas', email: 'pablo95informatica@gmail.com' },
      to: [
        { email: 'pablo95informatica@gmail.com', name: 'Admin' },
        { email: 'melibritez94@gmail.com', name: 'Melissa' },
      ],
      subject: `💅 Nueva inscripción: ${nombre} — Curso Online de Uñas`,
      htmlContent,
      replyTo: { email, name: nombre },
    };

    if (comprobante) {
      payload.attachment = [{ content: comprobante, name: comprobanteName || 'comprobante.jpg' }];
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Brevo error:', errText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al enviar email', detail: errText }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
