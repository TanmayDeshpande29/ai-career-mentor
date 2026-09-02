import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

import {
  createCareerProfile,
  getCareerProfile,
  updateCareerProfile,
} from "@/services/careerProfileService";


function ProfilePage() {
  const { user, accessToken } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const [form, setForm] = useState({
    current_role: "",
    experience_years: "",
    target_role: "",
    target_location: "",
    career_goals: "",
    bio: "",
    skills: {},
    education: {},
    certifications: {},
  });


  async function loadProfile() {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCareerProfile(
        accessToken
      );

      setProfile(data);

      setForm({
        current_role: data.current_role ?? "",
        experience_years:
          data.experience_years ?? "",
        target_role: data.target_role ?? "",
        target_location:
          data.target_location ?? "",
        career_goals:
          data.career_goals ?? "",
        bio: data.bio ?? "",
        skills: data.skills ?? {},
        education: data.education ?? {},
        certifications:
          data.certifications ?? {},
      });

    } catch (error) {
      if (error.status === 404) {
        setProfile(null);
        setError("");
      } else {
        setError(
          error.message ||
          "Failed to load career profile."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [accessToken]);


  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }


  function startEditing() {
    setMessage("");
    setError("");
    setEditing(true);
  }


  function cancelEditing() {
    if (profile) {
      setForm({
        current_role:
          profile.current_role ?? "",
        experience_years:
          profile.experience_years ?? "",
        target_role:
          profile.target_role ?? "",
        target_location:
          profile.target_location ?? "",
        career_goals:
          profile.career_goals ?? "",
        bio: profile.bio ?? "",
        skills: profile.skills ?? {},
        education:
          profile.education ?? {},
        certifications:
          profile.certifications ?? {},
      });
    }

    setEditing(false);
    setError("");
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (!accessToken) {
      setError("You are not authenticated.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const profileData = {
        current_role:
          form.current_role || null,

        experience_years:
          form.experience_years === ""
            ? null
            : Number(form.experience_years),

        target_role:
          form.target_role || null,

        target_location:
          form.target_location || null,

        career_goals:
          form.career_goals || null,

        bio:
          form.bio || null,

        skills: form.skills,
        education: form.education,
        certifications:
          form.certifications,
      };


      let data;

      if (profile) {
        data = await updateCareerProfile(
          profileData,
          accessToken
        );
      } else {
        data = await createCareerProfile(
          profileData,
          accessToken
        );
      }


      setProfile(data);

      setForm({
        current_role:
          data.current_role ?? "",
        experience_years:
          data.experience_years ?? "",
        target_role:
          data.target_role ?? "",
        target_location:
          data.target_location ?? "",
        career_goals:
          data.career_goals ?? "",
        bio: data.bio ?? "",
        skills: data.skills ?? {},
        education:
          data.education ?? {},
        certifications:
          data.certifications ?? {},
      });

      setEditing(false);
      setMessage(
        profile
          ? "Career profile updated successfully."
          : "Career profile created successfully."
      );

    } catch (error) {
      setError(
        error.message ||
        "Failed to save career profile."
      );

    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
        Loading your career profile...
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {message && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}


      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

        {/* USER INFORMATION */}

        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">

          <CardHeader>
            <SectionHeader
              eyebrow="Profile"
              title="About you"
              description="Your professional identity, ready to impress."
            />
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-lg font-semibold text-violet-200">
                {user?.avatar ?? "U"}
              </div>

              <div>

                <p className="text-lg font-semibold text-white">
                  {user?.name ?? "User"}
                </p>

                <p className="text-sm text-slate-400">
                  {user?.role ?? "User"}
                </p>

                <p className="text-sm text-slate-500">
                  {user?.email ?? ""}
                </p>

              </div>

            </div>


            {!editing && (
              <Button
                className="w-full"
                onClick={startEditing}
              >
                {profile
                  ? "Edit profile"
                  : "Create career profile"}
              </Button>
            )}

          </CardContent>

        </Card>


        {/* CAREER PROFILE */}

        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">

          <CardHeader>
            <SectionHeader
              eyebrow="Focus"
              title="Current positioning"
              description="A concise view of the story you're telling the market."
            />
          </CardHeader>


          <CardContent className="space-y-3 text-sm text-slate-300">

            {profile ? (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-slate-500">
                    Current role
                  </span>

                  <p className="mt-1 font-medium text-white">
                    {profile.current_role ||
                      "Not specified"}
                  </p>
                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-slate-500">
                    Target role
                  </span>

                  <p className="mt-1 font-medium text-white">
                    {profile.target_role ||
                      "Not specified"}
                  </p>
                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-slate-500">
                    Target location
                  </span>

                  <p className="mt-1 font-medium text-white">
                    {profile.target_location ||
                      "Not specified"}
                  </p>
                </div>


                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-slate-500">
                    Experience
                  </span>

                  <p className="mt-1 font-medium text-white">
                    {profile.experience_years !== null &&
                    profile.experience_years !== undefined
                      ? `${profile.experience_years} years`
                      : "Not specified"}
                  </p>
                </div>


                {profile.bio && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-slate-500">
                      Bio
                    </span>

                    <p className="mt-1 text-slate-300">
                      {profile.bio}
                    </p>
                  </div>
                )}


                {profile.career_goals && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-slate-500">
                      Career goals
                    </span>

                    <p className="mt-1 text-slate-300">
                      {profile.career_goals}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">

                <p className="font-medium text-white">
                  Your career profile isn't created yet.
                </p>

                <p className="mt-2 text-slate-400">
                  Add your career information so your mentor can personalize your experience.
                </p>

              </div>
            )}

          </CardContent>

        </Card>

      </div>


      {/* EDIT / CREATE FORM */}

      {editing && (
        <Card className="border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 backdrop-blur-xl">

          <CardHeader>
            <SectionHeader
              eyebrow="Career information"
              title={
                profile
                  ? "Edit your profile"
                  : "Create your career profile"
              }
              description="Tell us about your current position and where you want to go next."
            />
          </CardHeader>


          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-sm text-slate-300">
                    Current role
                  </label>

                  <input
                    name="current_role"
                    value={form.current_role}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-500"
                  />
                </div>


                <div>
                  <label className="text-sm text-slate-300">
                    Experience (years)
                  </label>

                  <input
                    name="experience_years"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.experience_years}
                    onChange={handleChange}
                    placeholder="2.5"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-500"
                  />
                </div>


                <div>
                  <label className="text-sm text-slate-300">
                    Target role
                  </label>

                  <input
                    name="target_role"
                    value={form.target_role}
                    onChange={handleChange}
                    placeholder="AI Engineer"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-500"
                  />
                </div>


                <div>
                  <label className="text-sm text-slate-300">
                    Target location
                  </label>

                  <input
                    name="target_location"
                    value={form.target_location}
                    onChange={handleChange}
                    placeholder="Pune / Remote"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-500"
                  />
                </div>

              </div>


              <div>
                <label className="text-sm text-slate-300">
                  Bio
                </label>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your professional background..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>


              <div>
                <label className="text-sm text-slate-300">
                  Career goals
                </label>

                <textarea
                  name="career_goals"
                  value={form.career_goals}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What do you want to achieve in your career?"
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>


              <div className="flex gap-3">

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : profile
                    ? "Save changes"
                    : "Create profile"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancel
                </Button>

              </div>

            </form>

          </CardContent>

        </Card>
      )}

    </div>
  );
}

export default ProfilePage;