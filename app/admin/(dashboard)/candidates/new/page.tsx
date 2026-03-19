import { CandidateForm } from "@/components/admin/candidate-form";

export default function NewCandidatePage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
          New Entry
        </p>
        <h1 className="font-display text-5xl font-semibold text-rose-950">
          Add New Candidate
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-900/70">
          Enter candidate details and reaction totals from Facebook.
        </p>
      </div>
      <CandidateForm />
    </div>
  );
}
