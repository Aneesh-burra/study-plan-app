"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkoutUrl, createCustomer, hasAccess, portalUrl } from "../../lib/billing";
import { store } from "../../lib/db";
import { getUser } from "../../lib/session";
import { generateStudyPlan } from "../../lib/study-plan";

export async function createPlan(_previous, form) {
  const user = await getUser();
  if (!user) redirect("/login");
  const title = String(form.get("title") ?? "").trim();
  const material = String(form.get("material") ?? "").trim();
  const weeks = Number(form.get("weeks"));
  const hours = Number(form.get("hours"));
  if (!title || title.length > 100 || material.length < 40 || material.length > 18000 ||
      !Number.isInteger(weeks) || weeks < 1 || weeks > 12 ||
      !Number.isInteger(hours) || hours < 1 || hours > 40) {
    return { error: "Check the course name, material length, weeks, and weekly hours." };
  }
  try {
    if (!(await hasAccess(user))) return { error: "An active subscription is required." };
    if (!(await store.reserveGeneration(user.id))) {
      return { error: "You’ve reached today’s limit of 20 generations. Try again tomorrow." };
    }
    const plan = await generateStudyPlan({ material, weeks, hours });
    if (user.is_demo) return { plan };
    const id = await store.savePlan(user.id, title, plan);
    revalidatePath("/dashboard");
    return { id };
  } catch (error) {
    console.error("Study plan creation failed", error.message);
    return { error: "StudyLane couldn’t generate your plan. Please try again." };
  }
}

export async function openBilling() {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.is_demo) redirect("/dashboard");
  let url;
  try {
    if (await hasAccess(user)) {
      url = await portalUrl(user.stripe_customer_id);
    } else {
      const customerId = user.stripe_customer_id ||
        await store.setStripeCustomer(user.id, await createCustomer(user));
      url = await checkoutUrl(customerId);
    }
  } catch (error) {
    console.error("Billing failed", error.message);
    redirect("/dashboard?billing=error");
  }
  redirect(url);
}
