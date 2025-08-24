"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function sanitizeInput(input: string): string {
  // Remove HTML tags
  const withoutTags = input.replace(/<\/?[^>]+(>|$)/g, "");
  // Trim whitespace
  return withoutTags.trim();
}

type Step =
  | "jobQuestion"
  | "jobCongrats"
  | "feedback"
  | "visaMM"
  | "visaNoMM"
  | "visaType"
  | "doneCongrats"
  | "visaTypeNoSupport"
  | "visaTypeNoMMYes"
  | "visaTypeNoMMNo"
  | "doneNoSupport"
  | "downsellOffer"
  | "downsellAccepted"
  | "downsellReason"
  | "downsellReasonMain"
  | "reasonTooExpensive"
  | "reasonPlatform"
  | "reasonJobs"
  | "reasonNotMove"
  | "reasonOther"
  | "doneCancel";

export default function CancelFlowPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("jobQuestion");

  // Local form state for jobCongrats
  const [answers, setAnswers] = useState({
    foundWithMM: "",
    rolesApplied: "",
    companiesEmailed: "",
    companiesInterviewed: "",
  });

  const [feedback, setFeedback] = useState("");

  const [visaAnswer, setVisaAnswer] = useState("");

  const allAnswered = Object.values(answers).every(Boolean);

  const [visaNoMMAnswer, setVisaNoMMAnswer] = useState("");

  const [visaType, setVisaType] = useState("");

  const [visaTypeNoSupport, setVisaTypeNoSupport] = useState("");

  const [mainReason, setMainReason] = useState("");

  const [reasonError, setReasonError] = useState(false);

  const [maxPrice, setMaxPrice] = useState("");

  const [priceError, setPriceError] = useState("");

  const [platformFeedback, setPlatformFeedback] = useState("");

  const [platformError, setPlatformError] = useState(false);

  const [jobsFeedback, setJobsFeedback] = useState("");

  const [decidedFeedback, setDecidedFeedback] = useState("");

  const [otherFeedback, setOtherFeedback] = useState("");

  const [variant, setVariant] = useState<"A" | "B" | null>(null);

  const [loadingVariant, setLoadingVariant] = useState(true);

  async function finalizeCancellation({
    reason,
    accepted_downsell,
    stayOnPage = false, // 👈 new flag
  }: {
    reason: string;
    accepted_downsell: boolean;
    stayOnPage?: boolean;
  }) {
    try {
      const res = await fetch("/cancel/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "550e8400-e29b-41d4-a716-446655440003", // replace with actual user
          reason,
          accepted_downsell,
        }),
      });

      if (!res.ok) throw new Error("Failed to finalize cancellation");

      const data = await res.json();
      if (data.success) {
        if (stayOnPage) {
          // 👇 instead of Step 21, send user home
          router.push("/");
        } else {
          // 👇 only Step 16–20 go here
          setStep("doneCancel");
        }
      } else {
        alert("Something went wrong saving cancellation.");
      }
    } catch (e) {
      console.error("Finalize cancel error:", e);
      alert("Could not finalize cancellation. Please try again.");
    }
  }

  useEffect(() => {
    async function fetchVariant() {
      try {
        const res = await fetch("/cancel/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "550e8400-e29b-41d4-a716-446655440003", // user1@example.com
          }),
          // ⚠️ replace with real user id
        });
        if (!res.ok) throw new Error("Failed to fetch variant");
        const data = await res.json();
        setVariant(data.variant);
      } catch (e) {
        console.error("Variant fetch failed", e);
      } finally {
        setLoadingVariant(false);
      }
    }
    fetchVariant();
  }, []);

  if (loadingVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          {step === "jobCongrats" && (
            <button
              onClick={() => setStep("jobQuestion")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          )}
          <h2 className="text-sm sm:text-base font-medium text-gray-800 flex-1 text-center">
            Subscription Cancellation
          </h2>
          <button
            aria-label="Close"
            onClick={() => router.push("/")}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>
        {/* Step 1: Did you get a job? */}
        {step === "jobQuestion" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-4">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Hey mate,
                <br />
                Quick one before you go.
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold italic text-gray-900">
                Have you found a job yet?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 border-t border-gray-200 pt-4">
                Whatever your answer, we just want to help you take the next
                step.
              </p>
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => setStep("jobCongrats")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm sm:text-base font-medium hover:bg-gray-50"
                >
                  Yes, I’ve found a job
                </button>
                <button
                  onClick={() => setStep("downsellOffer")}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm sm:text-base font-medium hover:bg-gray-50"
                >
                  Not yet – I’m still looking
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 2: Congrats on the new role */}
        {step === "jobCongrats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Congrats on the new role! 🎉
              </h3>

              {/* Questions */}
              <div className="space-y-4">
                <Question
                  label="Did you find this job with MigrateMate?*"
                  options={["Yes", "No"]}
                  value={answers.foundWithMM}
                  onChange={(v) => setAnswers({ ...answers, foundWithMM: v })}
                />
                <Question
                  label="How many roles did you apply for through Migrate Mate?*"
                  options={["0", "1–5", "6–20", "20+"]}
                  value={answers.rolesApplied}
                  onChange={(v) => setAnswers({ ...answers, rolesApplied: v })}
                />
                <Question
                  label="How many companies did you email directly?*"
                  options={["0", "1–5", "6–20", "20+"]}
                  value={answers.companiesEmailed}
                  onChange={(v) =>
                    setAnswers({ ...answers, companiesEmailed: v })
                  }
                />
                <Question
                  label="How many different companies did you interview with?*"
                  options={["0", "1–2", "3–5", "5+"]}
                  value={answers.companiesInterviewed}
                  onChange={(v) =>
                    setAnswers({ ...answers, companiesInterviewed: v })
                  }
                />
              </div>

              <button
                disabled={!allAnswered}
                onClick={() => setStep("feedback")}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  allAnswered
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 3: Feedback */}
        {step === "feedback" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s one thing you wish we could’ve helped you with?
              </h3>
              <p className="text-sm text-gray-600">
                We’re always looking to improve, your thoughts can help us make
                Migrate Mate more useful for others.*
              </p>

              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
                rows={4}
                placeholder="Type your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <p className="text-xs text-gray-500">
                Min 25 characters ({feedback.length}/25)
              </p>

              <button
                disabled={feedback.length < 25}
                onClick={() => {
                  if (answers.foundWithMM === "Yes") {
                    setStep("visaMM");
                  } else {
                    setStep("visaNoMM");
                  }
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  feedback.length >= 25
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 4: Visa assistance */}
        {step === "visaMM" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            {/* Left: Text + Options */}
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                We helped you land the job, now let’s help you secure your visa.
              </h3>
              <p className="text-sm text-gray-600">
                Is your company providing an immigration lawyer to help with
                your visa?*
              </p>

              <div className="space-y-2">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="visa"
                      value={opt}
                      checked={visaAnswer === opt}
                      onChange={(e) => setVisaAnswer(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>

              <button
                disabled={!visaAnswer}
                onClick={() => {
                  if (visaAnswer === "Yes") {
                    setStep("visaType");
                  } else {
                    setStep("visaTypeNoSupport");
                  }
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaAnswer
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>

            {/* Right: Image */}
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}

        {/* Step 5: Visa (not through MM) */}
        {step === "visaNoMM" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                You landed the job!{" "}
                <span className="italic">That’s what we live for.</span>
              </h3>
              <p className="text-sm text-gray-600">
                Even if it wasn’t through Migrate Mate, let us help get your
                visa sorted.
              </p>

              <div className="space-y-2">
                {["Yes", "No"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="visaNoMM"
                      value={opt}
                      checked={visaNoMMAnswer === opt}
                      onChange={(e) => setVisaNoMMAnswer(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>

              <button
                disabled={!visaNoMMAnswer}
                onClick={() => {
                  if (visaNoMMAnswer === "Yes") {
                    setStep("visaTypeNoMMYes");
                  } else {
                    setStep("visaTypeNoMMNo");
                  }
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaNoMMAnswer
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 6: Visa type */}
        {step === "visaType" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                We helped you land the job, now let’s help you secure your visa.
              </h3>
              <p className="text-sm text-gray-600">
                What visa will you be applying for?*
              </p>

              <input
                type="text"
                placeholder="Enter visa type..."
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={visaType.trim().length < 1}
                onClick={() => setStep("doneCongrats")} // ✅ no finalizeCancellation here
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaType.trim().length > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 7: Done */}
        {step === "doneCongrats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                All done, your cancellation’s been processed.
              </h3>
              <p className="text-sm text-gray-600">
                We’re stoked to hear you’ve landed a job and sorted your visa.
                Big congrats from the team 🙌
              </p>

              <button
                onClick={() =>
                  finalizeCancellation({
                    reason: `Cancelled after job + visa type chosen: ${sanitizeInput(
                      visaType
                    )}`,
                    accepted_downsell: false,
                    stayOnPage: true, // 👈 stay here, don’t jump to Step 21
                  })
                }
                className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-purple-600 text-white hover:bg-purple-700"
              >
                Finish
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}

        {/* Step 8: VisaTypeNoSupport */}
        {step === "visaTypeNoSupport" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                We helped you land the job, now let’s help you secure your visa.
              </h3>
              <p className="text-sm text-gray-600">
                We can connect you with one of our trusted partners. Which visa
                would you like to apply for?*
              </p>
              <input
                type="text"
                placeholder="Enter visa type..."
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={!visaTypeNoSupport.trim()}
                onClick={() => setStep("doneNoSupport")} // ✅ only forward
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaTypeNoSupport.trim()
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 9: doneNoSupport */}
        {step === "doneNoSupport" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Your cancellation’s all sorted, mate, no more charges.
              </h3>
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/mihailo-profile.jpeg"
                    alt="Mihailo Bozic"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Mihailo Bozic</p>
                    <p className="text-sm text-gray-600">
                      {"<"}mihailo@migratemate.co{">"}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">
                  I’ll be reaching out soon to help with the visa side of
                  things. We’ve got your back, whether it’s questions,
                  paperwork, or just figuring out your options. Keep an eye on
                  your inbox, I’ll be in touch{" "}
                  <a href="#" className="text-indigo-600 underline">
                    shortly
                  </a>
                  .
                </p>
              </div>

              <button
                onClick={() =>
                  finalizeCancellation({
                    reason: `Cancelled after landing a job (visa not sponsored)${
                      visaType?.trim()
                        ? `, visa type: ${sanitizeInput(visaType)}`
                        : visaTypeNoSupport?.trim()
                        ? `, visa type: ${sanitizeInput(visaTypeNoSupport)}`
                        : ""
                    }`,
                    accepted_downsell: false,
                    stayOnPage: true, // 👈 stay here, don’t jump to Step 21
                  })
                }
                className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-purple-600 text-white hover:bg-purple-700"
              >
                Finish
              </button>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}

        {/* Step 10: Visa type (No MM, but company provides lawyer) */}
        {step === "visaTypeNoMMYes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                You landed the job!{" "}
                <span className="italic">That’s what we live for.</span>
              </h3>
              <p className="text-sm text-gray-600">
                Is your company providing an immigration lawyer to help with
                your visa?
              </p>
              <p className="text-sm text-gray-600">
                What visa will you be applying for?*
              </p>

              <input
                type="text"
                placeholder="Enter visa type..."
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={visaType.trim().length < 1}
                onClick={() => setStep("doneCongrats")} // ✅ move forward only
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaType.trim().length > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}

        {/* Step 11: Visa type (No MM, no lawyer) */}
        {step === "visaTypeNoMMNo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                You landed the job!{" "}
                <span className="italic">That’s what we live for.</span>
              </h3>
              <p className="text-sm text-gray-600">
                We can connect you with one of our trusted partners.
              </p>
              <p className="text-sm text-gray-600">
                Which visa would you like to apply for?*
              </p>

              <input
                type="text"
                placeholder="Enter visa type..."
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={visaType.trim().length < 1}
                onClick={() => setStep("doneNoSupport")} // ✅ only forward
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaType.trim().length > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 12: Downsell Offer */}
        {step === "downsellOffer" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                We built this to help you land the job, this makes it a little
                easier.
              </h3>
              <p className="text-sm text-gray-600">
                We’ve been there and we’re here to help you.
              </p>

              <div className="p-4 rounded-xl border border-purple-300 bg-purple-50 space-y-3">
                {variant === "B" ? (
                  <>
                    <p className="text-center font-medium text-gray-900">
                      Here’s <span className="font-extrabold">$10 off</span>{" "}
                      until you find a job.
                    </p>
                    <p className="text-center text-purple-700 text-lg font-bold">
                      $15<span className="text-sm font-normal">/month</span>{" "}
                      <span className="line-through text-gray-400">
                        $25/month
                      </span>
                    </p>
                    <button
                      onClick={() => setStep("downsellAccepted")}
                      className="w-full rounded-lg bg-green-600 text-white font-medium px-4 py-2 hover:bg-green-700"
                    >
                      Get $10 off
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-center font-medium text-gray-900">
                      Here’s <span className="font-extrabold">50% off</span>{" "}
                      until you find a job.
                    </p>
                    <p className="text-center text-purple-700 text-lg font-bold">
                      $12.50<span className="text-sm font-normal">/month</span>{" "}
                      <span className="line-through text-gray-400">
                        $25/month
                      </span>
                    </p>
                    <button
                      onClick={() => setStep("downsellAccepted")}
                      className="w-full rounded-lg bg-green-600 text-white font-medium px-4 py-2 hover:bg-green-700"
                    >
                      Get 50% off
                    </button>
                  </>
                )}

                <p className="text-xs text-gray-500 text-center">
                  You won’t be charged until your next billing date.
                </p>
              </div>

              <button
                onClick={() => setStep("downsellReason")}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm sm:text-base font-medium hover:bg-gray-50"
              >
                No thanks
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 13: Downsell Accepted */}
        {step === "downsellAccepted" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Great choice, mate!
              </h3>
              <p className="text-lg text-gray-700">
                You’re still on the path to your dream role.{" "}
                <span className="text-purple-600 font-semibold">
                  Let’s make it happen together!
                </span>
              </p>
              <p className="text-sm text-gray-600">
                You’ve got <span className="font-semibold">XX days</span> left
                on your current plan. <br />
                Starting from <span className="font-semibold">XX date</span>,
                your monthly payment will be{" "}
                <span className="font-semibold">
                  {variant === "B" ? "$15" : "$12.50"}
                </span>
                .
              </p>
              <p className="text-xs text-gray-500 italic">
                You can cancel anytime before then.
              </p>

              <button
                onClick={() => router.push("/")}
                className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-purple-600 text-white hover:bg-purple-700"
              >
                Land your dream role
              </button>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 14: Downsell Reason */}
        {step === "downsellReason" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Help us understand how you were using Migrate Mate.
              </h3>
              <p className="text-sm text-gray-600">
                Mind letting us know why you’re cancelling? It helps us
                understand your experience and improve the platform.
              </p>

              {/* Roles applied */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  How many roles did you apply for through Migrate Mate?
                </p>
                <div className="flex space-x-2">
                  {["0", "1-5", "6-20", "20+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, rolesApplied: opt }))
                      }
                      className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition
                ${
                  answers.rolesApplied === opt
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800 hover:bg-purple-50"
                }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companies emailed */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  How many companies did you email directly?
                </p>
                <div className="flex space-x-2">
                  {["0", "1-5", "6-20", "20+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          companiesEmailed: opt,
                        }))
                      }
                      className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition
                ${
                  answers.companiesEmailed === opt
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800 hover:bg-purple-50"
                }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companies interviewed */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  How many different companies did you interview with?
                </p>
                <div className="flex space-x-2">
                  {["0", "1-2", "3-5", "5+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          companiesInterviewed: opt,
                        }))
                      }
                      className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium transition
                ${
                  answers.companiesInterviewed === opt
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-800 hover:bg-purple-50"
                }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  {variant === "B" ? (
                    <>
                      Get $10 off | $15{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep("downsellReasonMain")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-red-600 text-white hover:bg-red-700"
                >
                  Continue
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 15: Main reason for cancelling */}
        {step === "downsellReasonMain" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s the main reason for cancelling?
              </h3>
              <p className="text-sm text-gray-600">
                Please take a minute to let us know why:
              </p>

              {reasonError && (
                <p className="text-sm text-red-600">
                  To help us understand your experience, please select a reason
                  for cancelling*
                </p>
              )}

              <div className="space-y-2">
                {[
                  "Too expensive",
                  "Platform not helpful",
                  "Not enough relevant jobs",
                  "Decided not to move",
                  "Other",
                ].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="mainReason"
                      value={opt}
                      checked={mainReason === opt}
                      onChange={(e) => {
                        setMainReason(e.target.value);
                        setReasonError(false);
                      }}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  {variant === "B" ? (
                    <>
                      Get $10 off | $15{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (!mainReason) {
                      setReasonError(true);
                      return;
                    }

                    if (mainReason === "Too expensive") {
                      setStep("reasonTooExpensive"); // Step 16
                    } else if (mainReason === "Platform not helpful") {
                      setStep("reasonPlatform"); // Step 17
                    } else if (mainReason === "Not enough relevant jobs") {
                      setStep("reasonJobs"); // Step 18
                    } else if (mainReason === "Decided not to move") {
                      setStep("reasonNotMove"); // Step 19
                    } else if (mainReason === "Other") {
                      setStep("reasonOther"); // Step 20
                    }
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                    mainReason
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 16: Too Expensive → ask max price */}
        {step === "reasonTooExpensive" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s the main reason for cancelling?
              </h3>
              <p className="text-sm text-gray-600">
                Please take a minute to let us know why:
              </p>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  Too expensive
                </p>
                <label className="block text-sm text-gray-700">
                  What would be the maximum you would be willing to pay?*
                </label>
                <input
                  type="text"
                  placeholder="$"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPriceError(""); // clear error while typing
                  }}
                  className="w-full rounded-lg border border-gray-400 text-gray-800 p-3 text-sm
             placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
                />

                <p className="text-xs text-gray-500">
                  Please enter a maximum price
                </p>

                {priceError && (
                  <p className="text-sm text-red-600">{priceError}</p>
                )}
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  Get 50% off | $12.50{" "}
                  <span className="line-through text-gray-300">$25</span>
                </button>

                <button
                  onClick={() => {
                    if (!maxPrice.trim()) {
                      setPriceError("This field is required.");
                      return;
                    }
                    finalizeCancellation({
                      reason: `Too expensive (max willing to pay: ${sanitizeInput(
                        maxPrice
                      )})`,
                      accepted_downsell: false,
                    });
                    setStep("doneCancel");
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                    maxPrice.trim()
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 17: Platform not helpful */}
        {step === "reasonPlatform" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s the main reason?
              </h3>
              <p className="text-sm text-gray-600">
                Please take a minute to let us know why:
              </p>

              <p className="text-sm font-medium text-gray-800">
                What can we change to make the platform more helpful?*
              </p>

              {platformError && (
                <p className="text-sm text-red-600">
                  Please enter at least 25 characters so we can understand your
                  feedback*
                </p>
              )}

              <textarea
                rows={4}
                placeholder="Type your feedback..."
                value={platformFeedback}
                onChange={(e) => {
                  setPlatformFeedback(e.target.value);
                  setPlatformError(false);
                }}
                className="w-full rounded-lg border border-gray-400 text-gray-800 placeholder-gray-500
    p-3 text-sm focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
              />

              <p className="text-xs text-gray-500">
                Min 25 characters ({platformFeedback.length}/25)
              </p>

              {platformFeedback.length > 0 && platformFeedback.length < 25 && (
                <p className="text-sm text-red-600">
                  Please enter at least 25 characters so we can understand your
                  feedback*
                </p>
              )}

              {/* Action buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  {variant === "B" ? (
                    <>
                      Get $10 off | $15{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  )}
                </button>

                <button
                  disabled={platformFeedback.trim().length < 25}
                  onClick={async () => {
                    await finalizeCancellation({
                      reason: `Platform not helpful: ${sanitizeInput(
                        platformFeedback
                      )}`,
                      accepted_downsell: false,
                    });
                    setStep("doneCancel"); // 👈 ensure it always goes to Step 21
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                    platformFeedback.trim().length >= 25
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}

        {/* Step 18: Not enough jobs */}
        {step === "reasonJobs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s the main reason?
              </h3>
              <p className="text-sm text-gray-600">
                Please take a minute to let us know why:
              </p>

              <p className="text-sm font-medium text-gray-800">
                In which way can we make the jobs more relevant?*
              </p>
              <textarea
                value={jobsFeedback}
                onChange={(e) => setJobsFeedback(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none text-gray-800"
                rows={3}
                placeholder="Type your feedback..."
              />

              <p className="text-xs text-gray-500">
                Min 25 characters ({jobsFeedback.length}/25)
              </p>

              {jobsFeedback.length > 0 && jobsFeedback.length < 25 && (
                <p className="text-sm text-red-600">
                  Please enter at least 25 characters so we can understand your
                  feedback*
                </p>
              )}

              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  {variant === "B" ? (
                    <>
                      Get $10 off | $15{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  )}
                </button>

                <button
                  disabled={jobsFeedback.trim().length < 25}
                  onClick={async () => {
                    await finalizeCancellation({
                      reason: `Not enough relevant jobs: ${sanitizeInput(
                        jobsFeedback
                      )}`,
                      accepted_downsell: false,
                    });
                    setStep("doneCancel"); // 👈 always transition to Step 21
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                    jobsFeedback.trim().length >= 25
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 19: Decided not to move */}
        {step === "reasonNotMove" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s the main reason?
              </h3>
              <p className="text-sm text-gray-600">
                Please take a minute to let us know why:
              </p>

              <p className="text-sm font-medium text-gray-800">
                What changed for you not to move?*
              </p>
              <textarea
                value={jobsFeedback}
                onChange={(e) => setJobsFeedback(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none text-gray-800"
                rows={3}
                placeholder="Type your feedback..."
              />

              <p className="text-xs text-gray-500">
                Min 25 characters ({jobsFeedback.length}/25)
              </p>

              {jobsFeedback.length > 0 && jobsFeedback.length < 25 && (
                <p className="text-sm text-red-600">
                  Please enter at least 25 characters so we can understand your
                  feedback*
                </p>
              )}

              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  {variant === "B" ? (
                    <>
                      Get $10 off | $15{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  )}
                </button>

                <button
                  disabled={jobsFeedback.trim().length < 25}
                  onClick={async () => {
                    await finalizeCancellation({
                      reason: `Decided not to move: ${sanitizeInput(
                        jobsFeedback
                      )}`,
                      accepted_downsell: false,
                    });
                    setStep("doneCancel"); // 👈 ensure receipt page
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                    jobsFeedback.trim().length >= 25
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 20: Other */}
        {step === "reasonOther" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                What’s the main reason?
              </h3>
              <p className="text-sm text-gray-600">
                Please take a minute to let us know why:
              </p>

              <p className="text-sm font-medium text-gray-800">
                What would have helped you the most?*
              </p>
              <textarea
                value={jobsFeedback}
                onChange={(e) => setJobsFeedback(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none text-gray-800"
                rows={3}
                placeholder="Type your feedback..."
              />

              <p className="text-xs text-gray-500">
                Min 25 characters ({jobsFeedback.length}/25)
              </p>

              {jobsFeedback.length > 0 && jobsFeedback.length < 25 && (
                <p className="text-sm text-red-600">
                  Please enter at least 25 characters so we can understand your
                  feedback*
                </p>
              )}

              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => setStep("downsellAccepted")}
                  className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-green-600 text-white hover:bg-green-700"
                >
                  {variant === "B" ? (
                    <>
                      Get $10 off | $15{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50{" "}
                      <span className="line-through text-gray-300">$25</span>
                    </>
                  )}
                </button>

                <button
                  disabled={jobsFeedback.trim().length < 25}
                  onClick={async () => {
                    await finalizeCancellation({
                      reason: `Other: ${sanitizeInput(jobsFeedback)}`,
                      accepted_downsell: false,
                    });
                    setStep("doneCancel"); // 👈 consistent final page
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                    jobsFeedback.trim().length >= 25
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
        {/* Step 21: Done Cancel */}
        {step === "doneCancel" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-6">
            <div className="order-2 md:order-1 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Sorry to see you go, mate.
              </h3>
              <p className="text-lg text-gray-700">
                Thanks for being with us, and you’re always welcome back.
              </p>
              <p className="text-sm text-gray-600">
                Your subscription is set to end on{" "}
                <span className="font-semibold">XX date</span>. You’ll still
                have full access until then. No further charges after that.
              </p>
              <p className="text-xs text-gray-500">
                Changed your mind? You can reactivate anytime before your end
                date.
              </p>

              <button
                onClick={() => router.push("/")}
                className="w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition bg-purple-600 text-white hover:bg-purple-700"
              >
                Back to Jobs
              </button>
            </div>

            <div className="order-1 md:order-2">
              <Image
                src="/empire-state-compressed.jpg"
                alt="City skyline"
                width={1200}
                height={900}
                priority
                className="h-48 sm:h-64 md:h-full w-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Question({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              value === opt
                ? "bg-black text-white border-black"
                : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
