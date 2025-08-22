"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  | "doneNoSupport";

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
                  onClick={() => alert("Next: Not yet branch")}
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
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
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
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={visaType.trim().length < 1}
                onClick={() => setStep("doneCongrats")}
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
                onClick={() => router.push("/")}
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
                value={visaTypeNoSupport}
                onChange={(e) => setVisaTypeNoSupport(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
              <button
                disabled={!visaTypeNoSupport.trim()}
                onClick={() => setStep("doneNoSupport")}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaTypeNoSupport.trim()
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Complete cancellation
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
                onClick={() => router.push("/")}
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
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={visaType.trim().length < 1}
                onClick={() => setStep("doneCongrats")}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaType.trim().length > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Complete cancellation
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
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />

              <button
                disabled={visaType.trim().length < 1}
                onClick={() => setStep("doneNoSupport")}
                className={`w-full rounded-xl px-4 py-3 text-sm sm:text-base font-medium transition ${
                  visaType.trim().length > 0
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Complete cancellation
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
