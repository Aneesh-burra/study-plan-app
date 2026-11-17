async function stripe(path, params, idempotencyKey) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  const response = await fetch("https://api.stripe.com/v1/" + path, {
    method: params ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + key,
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: params ? new URLSearchParams(params) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Stripe request failed (" + response.status + ")");
  return response.json();
}

export async function hasAccess(user) {
  if (user.is_demo) return true;
  if (!user.stripe_customer_id) return false;
  const { data } = await stripe("subscriptions?limit=100&customer=" + encodeURIComponent(user.stripe_customer_id));
  return data.some(({ status }) => status === "active" || status === "trialing");
}

export async function createCustomer(user) {
  const customer = await stripe("customers", {
    email: user.email,
    "metadata[user_id]": user.id,
  }, "studylane-customer-" + user.id);
  return customer.id;
}

function dashboardUrl() {
  const origin = process.env.APP_URL || (process.env.VERCEL_URL && "https://" + process.env.VERCEL_URL);
  if (!origin) throw new Error("APP_URL is not configured");
  return new URL("/dashboard", origin).href;
}

export async function checkoutUrl(customerId) {
  const price = process.env.STRIPE_PRICE_ID;
  if (!price) throw new Error("STRIPE_PRICE_ID is not configured");
  const { data } = await stripe("checkout/sessions?status=open&limit=1&customer=" + encodeURIComponent(customerId));
  if (data[0]?.url) return data[0].url;
  const dashboard = dashboardUrl();
  const session = await stripe("checkout/sessions", {
    mode: "subscription",
    customer: customerId,
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: dashboard + "?billing=success",
    cancel_url: dashboard,
  }, "studylane-checkout-" + customerId + "-" + Math.floor(Date.now() / 60000));
  return session.url;
}

export async function portalUrl(customerId) {
  const session = await stripe("billing_portal/sessions", {
    customer: customerId,
    return_url: dashboardUrl(),
  });
  return session.url;
}
