"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validators";

interface EditProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        toast.error("Email is already taken");
        return;
      }

      if (!res.ok) {
        const result = await res.json();
        toast.error(result.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated");
      // Refresh to reflect changes in session
      window.location.reload();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-base font-semibold text-text-primary">Personal Info</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className="block text-sm font-medium text-text-primary mb-1.5">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            {...register("name")}
            className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-text-primary mb-1.5">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            {...register("email")}
            className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
