import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CandidateForm } from "@/components/admin/candidate-form";

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
  });

  if (!candidate) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
          Edit Entry
        </p>
        <h1 className="font-display text-5xl font-semibold text-rose-950">
          Edit Candidate
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-900/70">
          Update candidate details and reaction totals.
        </p>
      </div>
      <CandidateForm candidate={candidate} isEditing />
    </div>
  );
}
