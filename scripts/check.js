require('dotenv').config();

const handler = require('../netlify/functions/send-email').handler;

async function main() {
  console.log('\n══════════════════════════════════════');
  console.log('  Check — Curso Uñas · Brevo + Función');
  console.log('══════════════════════════════════════\n');

  // 1 — Verificar API key
  if (!process.env.BREVO_API_KEY) {
    console.error('❌  BREVO_API_KEY no encontrada en el archivo .env');
    console.error('    Creá el archivo .env con: BREVO_API_KEY=tu_clave\n');
    process.exit(1);
  }
  console.log('✅  BREVO_API_KEY detectada');

  // 2 — Llamar a la función con datos de prueba (sin adjunto)
  console.log('📧  Enviando email de prueba a pablo95informatica@gmail.com y melibritez94@gmail.com...\n');

  const fakeEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({
      nombre:          'Test Check Script',
      email:           'pablo95informatica@gmail.com',
      telefono:        '0981 000 000',
      dni:             '1234567',
      ciudad:          'Asunción',
      fuente:          'Script de verificación',
      nivel:           'Principiante',
      comprobante:     null,
      comprobanteName: null,
    }),
  };

  try {
    const result = await handler(fakeEvent);
    const body   = JSON.parse(result.body);

    if (result.statusCode === 200) {
      console.log('✅  Email enviado correctamente.');
      console.log('    Revisá la bandeja de pablo95informatica@gmail.com y melibritez94@gmail.com\n');
    } else {
      console.error(`❌  Error ${result.statusCode}: ${body.error}`);
      if (body.detail) {
        try {
          const detail = JSON.parse(body.detail);
          console.error('    Detalle Brevo:', JSON.stringify(detail, null, 2));
        } catch {
          console.error('    Detalle:', body.detail);
        }
      }
      console.log();
      process.exit(1);
    }
  } catch (err) {
    console.error('❌  Error inesperado:', err.message, '\n');
    process.exit(1);
  }
}

main();
