const ACCOUNTS_BASE = 'https://accounts.zoho.in';
const API_BASE = 'https://www.zohoapis.in/books/v3';

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
  });

  const res = await fetch(`${ACCOUNTS_BASE}/oauth/v2/token?${params}`, { method: 'POST' });
  const json = await res.json();

  if (!json.access_token) {
    throw new Error(`Zoho token error: ${JSON.stringify(json)}`);
  }

  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return tokenCache.token;
}

function apiUrl(path: string): string {
  const sep = path.includes('?') ? '&' : '?';
  return `${API_BASE}${path}${sep}organization_id=${process.env.ZOHO_ORG_ID}`;
}

async function authHeader(): Promise<{ Authorization: string }> {
  return { Authorization: `Zoho-oauthtoken ${await getAccessToken()}` };
}

async function zohoGet(path: string) {
  const res = await fetch(apiUrl(path), { headers: await authHeader(), cache: 'no-store' });
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Zoho GET ${path} → ${JSON.stringify(json)}`);
  return json;
}

async function zohoPost(path: string, body: object) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { ...(await authHeader()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Zoho POST ${path} → ${JSON.stringify(json)}`);
  return json;
}

async function zohoPut(path: string, body: object) {
  const res = await fetch(apiUrl(path), {
    method: 'PUT',
    headers: { ...(await authHeader()), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.code !== 0) throw new Error(`Zoho PUT ${path} → ${JSON.stringify(json)}`);
  return json;
}

export interface SOLineItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface SODetails {
  soId: string;
  soNumber: string;
  customerName: string;
  deliveryDate: string;
  lineItems: SOLineItem[];
}

export async function getSalesOrderByNumber(soNumber: string): Promise<SODetails | null> {
  const list = await zohoGet(`/salesorders?salesorder_number=${encodeURIComponent(soNumber)}`);
  const orders = list.salesorders ?? [];
  if (orders.length === 0) return null;

  const detail = await zohoGet(`/salesorders/${orders[0].salesorder_id}`);
  const so = detail.salesorder;

  return {
    soId: so.salesorder_id,
    soNumber: so.salesorder_number,
    customerName: so.customer_name,
    deliveryDate: so.delivery_date || so.shipment_date || so.date || '',
    lineItems: (so.line_items ?? []).map((item: Record<string, unknown>) => ({
      name: String(item.name ?? item.item_name ?? ''),
      quantity: Number(item.quantity ?? 0),
      unit: String(item.unit ?? 'pcs'),
    })),
  };
}

export async function addSOComment(soId: string, description: string): Promise<void> {
  await zohoPost(`/salesorders/${soId}/comments`, {
    description,
    show_comment_to_clients: false,
  });
}

export async function updateSODeliveryStatus(soId: string, status: string): Promise<void> {
  await zohoPut(`/salesorders/${soId}`, {
    custom_fields: [{ label: 'Delivery Status', value: status }],
  });
}
