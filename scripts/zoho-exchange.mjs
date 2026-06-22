// Usage: node scripts/zoho-exchange.mjs <auth_code>
const code = process.argv[2];
if (!code) { console.error('Usage: node scripts/zoho-exchange.mjs <auth_code>'); process.exit(1); }

const res = await fetch('https://accounts.zoho.in/oauth/v2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: '1000.V6FXP64UQWUGH5P8K9NHYEJXT0T8CD',
    client_secret: 'bbd561288506dfa4cd01a7006c54ab2f162e342f7a',
    code,
  }),
});
console.log(await res.text());
