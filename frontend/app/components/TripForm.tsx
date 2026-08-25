"use client";
// #HANDS-ON LAB — form input trip: destination, budget, days, travel_style
// #HOMEWORK — Tailwind styling + responsive (stack vertical di mobile, grid 2 kolom di desktop)
import { useState } from "react";
import type { CreateTripPayload } from "@/lib/api";

interface TripFormProps {
  onSubmit: (payload: CreateTripPayload) => void;
  disabled: boolean;
}

const TRAVEL_STYLES = ["Solo", "Couple", "Family", "Friends", "Business"];

// #HOMEWORK — hilangkan tampilan spinner (panah atas-bawah) bawaan browser di input number
const NUMBER_INPUT_CLASS =
  "rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export default function TripForm({ onSubmit, disabled }: TripFormProps) {
  const [form, setForm] = useState<CreateTripPayload>({
    destination: "",
    budget: 0,
    days: 0,
    travel_style: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" || name === "days" ? Number(value) : value,
    }));
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, travel_style: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // #HOMEWORK — validasi: budget & days tidak boleh 0 atau negatif
    if (form.budget <= 0) {
      setFormError("Budget must be greater than 0.");
      return;
    }
    if (form.days <= 0) {
      setFormError("Days must be at least 1.");
      return;
    }

    setFormError(null);
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-600">Destination</label>
        <input
          name="destination"
          value={form.destination}
          onChange={handleInputChange}
          required
          placeholder="Japan"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-600">Budget (USD)</label>
        <input
          type="number"
          name="budget"
          value={form.budget || ""}
          onChange={handleInputChange}
          required
          min={1}
          placeholder="2000"
          className={NUMBER_INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-600">Days</label>
        <input
          type="number"
          name="days"
          value={form.days || ""}
          onChange={handleInputChange}
          required
          min={1}
          placeholder="5"
          className={NUMBER_INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-600">Travel Style</label>
        <select
          name="travel_style"
          value={form.travel_style}
          onChange={handleSelectChange}
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="" disabled>Select travel style</option>
          {TRAVEL_STYLES.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      {formError && (
        <p className="sm:col-span-2 text-sm text-red-600">{formError}</p>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="sm:col-span-2 mt-2 rounded-lg bg-blue-800 px-4 py-2.5 font-medium text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "Generating..." : "Generate AI Trip"}
      </button>
    </form>
  );
}