"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Candidate } from "@/generated/prisma/client";

export const candidateSchema = z.object({
  name: z.string().min(1, "Candidate name is required"),
  photoUrl: z.string().min(1, "Photo URL is required"),
  like: z.coerce.number().min(0),
  love: z.coerce.number().min(0),
  care: z.coerce.number().min(0),
  haha: z.coerce.number().min(0),
  wow: z.coerce.number().min(0),
  sad: z.coerce.number().min(0),
  angry: z.coerce.number().min(0),
});

export type CandidateFormInput = z.input<typeof candidateSchema>;
export type CandidateFormValues = z.output<typeof candidateSchema>;

type CandidateFormProps = {
  candidate?: Candidate;
  isEditing?: boolean;
};

const REACTION_FIELDS = [
  { key: "like", label: "Like" },
  { key: "love", label: "Love" },
  { key: "care", label: "Care" },
  { key: "haha", label: "Haha" },
  { key: "wow", label: "Wow" },
  { key: "sad", label: "Sad" },
  { key: "angry", label: "Angry" },
] as const;

export function CandidateForm({
  candidate,
  isEditing = false,
}: CandidateFormProps) {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState(candidate?.photoUrl ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormInput, unknown, CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: candidate
      ? {
          name: candidate.name,
          photoUrl: candidate.photoUrl,
          like: candidate.like,
          love: candidate.love,
          care: candidate.care,
          haha: candidate.haha,
          wow: candidate.wow,
          sad: candidate.sad,
          angry: candidate.angry,
        }
      : {
          name: "",
          photoUrl: "",
          like: 0,
          love: 0,
          care: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0,
        },
  });
  const photoUrlField = register("photoUrl");

  const onSubmit = async (data: CandidateFormValues) => {
    const url = isEditing
      ? `/api/candidates/${candidate!.id}`
      : "/api/candidates";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Failed to save candidate");
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <Card className="rounded-[2rem] border-white/70 bg-white/85">
      <CardHeader className="pb-2">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
          <Sparkles className="h-3.5 w-3.5" />
          Candidate Entry
        </p>
        <CardTitle className="font-display text-4xl font-semibold text-rose-950">
          {isEditing ? "Edit Candidate" : "Add New Candidate"}
        </CardTitle>
        <p className="text-sm leading-6 text-rose-900/70">
          Update the profile image and reaction counts used for the public
          leaderboard.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Candidate Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Full name"
                  className="border-white/70"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  {...photoUrlField}
                  placeholder="https://example.com/photo.jpg"
                  className="border-white/70"
                  onChange={(event) => {
                    photoUrlField.onChange(event);
                    setPhotoPreview(event.target.value);
                  }}
                />
                {errors.photoUrl && (
                  <p className="text-sm text-destructive">
                    {errors.photoUrl.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Paste a direct image URL. For Cloudinary, use the direct link.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-b from-white/80 to-amber-50/70 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-rose-700/70">
                Photo Preview
              </p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-rose-50 to-amber-50">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Candidate preview"
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 1024px) 100vw, 360px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-rose-700/70">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8" />
                      <p className="mt-2 text-sm">Preview appears here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Reaction Counts</Label>
              <p className="mt-1 text-sm text-rose-900/65">
                Encode each Facebook reaction exactly as counted.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {REACTION_FIELDS.map(({ key, label }) => (
                <div
                  key={key}
                  className="rounded-[1.4rem] border border-white/70 bg-white/60 p-4"
                >
                  <Label
                    htmlFor={key}
                    className="text-xs uppercase tracking-[0.16em] text-rose-700/70"
                  >
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min={0}
                    {...register(key)}
                    className="mt-3 border-white/70 bg-white/85"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="submit" disabled={isSubmitting} className="min-w-40">
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Candidate"
                  : "Add Candidate"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="min-w-32"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
