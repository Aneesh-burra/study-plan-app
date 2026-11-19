"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkoutUrl, createCustomer, getBillingState, hasAccess, portalUrl } from "../../lib/billing";
import { store } from "../../lib/db";
import { getUser } from "../../lib/session";
import { generateStudyPlan } from "../../lib/study-plan";
import { planIdPattern, planTasks, reviewItems } from "../../lib/plan-progress";
import { samplePlan } from "../../lib/sample-plan";

class MaterialError extends Error {}

async function readMaterial(form, field) {
  const text = String(form.get(field) ?? "").trim();
  const file = form.get(field + "File");
  if (!file?.size) return { text, pdf: null };
  if (file.size > 1024 * 1024) throw new MaterialError("Each uploaded file must be 1 MB or smaller.");
  if (/\.(txt|md)$/i.test(file.name)) return { text: [text, (await file.text()).trim()].filter(Boolean).join("\n\n"), pdf: null };
  if (/\.pdf$/i.test(file.name)) {
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.subarray(0, 5).toString() === "%PDF-") return { text, pdf: bytes.toString("base64") };
  }
  throw new MaterialError("Choose a valid PDF, TXT, or Markdown file.");
}

export async function createPlan(_previous, form) {
  const user = await getUser();
  if (!user) redirect("/login");
  const title = String(form.get("title") ?? "").trim();
  const weeks = Number(form.get("weeks"));
  const hours = Number(form.get("hours"));
  if (!title || title.length > 100 || !Number.isInteger(weeks) || weeks < 1 || weeks > 12 ||
      !Number.isInteger(hours) || hours < 1 || hours > 40) {
    return { error: "Check the course name, number of weeks, and weekly hours." };
  }
  let id;
  try {
    if (!(await hasAccess(user))) return { error: "An active subscription is required." };
    const syllabus = await readMaterial(form, "syllabus");
    const notes = await readMaterial(form, "notes");
    const length = syllabus.text.length + notes.text.length;
    if (length > 24000 || (length < 40 && !syllabus.pdf && !notes.pdf)) {
      return { error: "Add at least 40 characters of material or upload a PDF. Keep pasted text under 24,000 characters total." };
    }
    if (!(await store.reserveGeneration(user.id))) return { error: "You’ve reached today’s limit of 20 generations." };
    const previous = (await store.listPlans(user)).filter(plan => plan.title.toLowerCase() === title.toLowerCase());
    const history = {
      completed: previous.flatMap(plan => planTasks(plan.content).filter(task => plan.completed_tasks[task.key]).map(task => task.title)).slice(0, 15),
      missed: previous.flatMap(plan => reviewItems(plan).map(item => item.question)).slice(0, 10),
    };
    const plan = await generateStudyPlan({
      title, syllabus: syllabus.text, notes: notes.text, syllabusPdf: syllabus.pdf, notesPdf: notes.pdf, weeks, hours, history,
    });
    id = await store.savePlan(user, title, plan);
  } catch (error) {
    if (error instanceof MaterialError) return { error: error.message };
    console.error("Study plan creation failed", error.code ?? error.message);
    return { error: "StudyLane couldn’t generate your plan. Please try again." };
  }
  revalidatePath("/dashboard");
  redirect("/dashboard?plan=" + id + "#course");
}

export async function loadSample() {
  const user = await getUser();
  if (!user) redirect("/login");
  if (!user.is_demo) redirect("/dashboard");
  const id = await store.savePlan(user, "Engineering Statics · Sample", samplePlan(), true);
  revalidatePath("/dashboard");
  redirect(id ? "/dashboard?plan=" + id : "/dashboard");
}

export async function updateProgress(_previous, form) {
  const user = await getUser();
  if (!user) redirect("/login");
  const id = form.get("plan");
  const field = form.get("field");
  const key = form.get("key");
  const marked = form.get("marked");
  if (typeof id !== "string" || !planIdPattern.test(id) || typeof key !== "string" ||
      !["task", "quiz"].includes(field) || !["true", "false"].includes(marked)) return { error: "Invalid progress update." };
  try {
    const plan = await store.getPlan(user, id);
    if (!plan) return { error: "This study plan is unavailable." };
    const exists = field === "task" ? planTasks(plan.content).some(task => task.key === key)
      : plan.content.quiz?.some((_question, index) => key === "quiz-" + index);
    if (!exists || !(await store.setProgress(user, id, field, key, marked === "true"))) return { error: "This item is unavailable." };
    revalidatePath("/dashboard");
    return { error: "" };
  } catch (error) {
    console.error("Progress update failed", error.code ?? error.name);
    return { error: "Progress couldn’t be saved. Try again." };
  }
}

export async function openBilling() {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.is_demo) redirect("/dashboard");
  let url;
  try {
    if ((await getBillingState(user)).canManage) {
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
