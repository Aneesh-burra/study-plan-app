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

export async function getBillingState(user) {
  if (user.is_demo) return { paid: true, canManage: false };
  if (!user.stripe_customer_id) return { paid: false, canManage: false };
  const price = process.env.STRIPE_PRICE_ID;
  if (!price) throw new Error("STRIPE_PRICE_ID is not configured");
  const { data, has_more: hasMore } = await stripe(
    "subscriptions?status=all&limit=100&customer=" + encodeURIComponent(user.stripe_customer_id)
  );
  if (hasMore) throw new Error("Subscription history exceeds supported limit");
  const matching = data.filter(subscription =>
    subscription.items.data.some(item => item.price.id === price)
  );
  const paid = matching.some(({ status }) => status === "active" || status === "trialing");
  const canManage = paid || matching.some(({ status }) =>
    status === "past_due" || status === "unpaid" || status === "paused"
  );
  return { paid, canManage };
}

export async function hasAccess(user) {
  return (await getBillingState(user)).paid;
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
  const configuredPrice = await stripe("prices/" + encodeURIComponent(price));
  if (!configuredPrice.active || configuredPrice.currency !== "usd" ||
      configuredPrice.unit_amount !== 700 || configuredPrice.recurring?.interval !== "month" ||
      configuredPrice.recurring?.interval_count !== 1) {
    throw new Error("Stripe price must be active and charge $7 USD per month");
  }
  const { data } = await stripe("checkout/sessions?status=open&limit=100&customer=" + encodeURIComponent(customerId));
  const openSession = data.find(session => session.mode === "subscription" && session.metadata?.price_id === price);
  if (openSession?.url) return openSession.url;
  const dashboard = dashboardUrl();
  const session = await stripe("checkout/sessions", {
    mode: "subscription",
    customer: customerId,
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    "metadata[price_id]": price,
    success_url: dashboard + "?billing=success",
    cancel_url: dashboard + "?billing=canceled",
  }, "studylane-checkout-" + customerId + "-" + price + "-" + Math.floor(Date.now() / 60000));
  return session.url;
}

export async function portalUrl(customerId) {
  const session = await stripe("billing_portal/sessions", {
    customer: customerId,
    return_url: dashboardUrl(),
  });
  return session.url;
}
