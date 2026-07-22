"use client";

import { useMemo, useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../../Auth/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

type FormState = {
  callId: string;
  vesselName: string;
  imoNumber: string;
  eta: string; // yyyy-mm-dd
  etaTime?: string; // HH:mm
  cargoDescription: string;
  files: {
    proformaInvoice?: File | null;
    blManifest?: File | null;
  };
};

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function NewCallRegistrationForm({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const minEtaDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return toISODate(d);
  }, [today]);

  const [form, setForm] = useState<FormState>({
    callId: "",
    vesselName: "",
    imoNumber: "",
    eta: "",
    etaTime: "",
    cargoDescription: "",
    files: {
      proformaInvoice: null,
      blManifest: null,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!form.vesselName.trim()) {
        toast.error("Vessel name is required.");
        return;
      }
      if (!form.imoNumber.trim()) {
        toast.error("IMO number is required.");
        return;
      }
      if (!form.eta) {
        toast.error("ETA date is required.");
        return;
      }

      if (form.eta < minEtaDate) {
        toast.error(`ETA must be at least 7 days from today (min: ${minEtaDate}).`);
        return;
      }

      const uploaded: Record<string, string> = {};

      const uploadIfPresent = async (
        file: File | null | undefined,
        path: string,
      ) => {
        if (!file) return;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        uploaded[path] = await getDownloadURL(storageRef);
      };

      const basePath = `preArrivalNotices/${Date.now()}`;
      await uploadIfPresent(
        form.files.proformaInvoice,
        `${basePath}/proforma-invoice.pdf`,
      );
      await uploadIfPresent(form.files.blManifest, `${basePath}/bl-manifest.pdf`);

      const payload = {
        callId: form.callId || null,
        vesselName: form.vesselName.trim(),
        imoNumber: form.imoNumber.trim(),
        eta: form.eta,
        etaTime: form.etaTime || null,
        cargoDescription: form.cargoDescription.trim() || null,
        documents: {
          proformaInvoiceUrl:
            uploaded[`${basePath}/proforma-invoice.pdf`] || null,
          blManifestUrl: uploaded[`${basePath}/bl-manifest.pdf`] || null,
        },
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "preArrivalCalls"), payload);

      toast.success("New call registration submitted.");
      onComplete?.();
    } catch (err) {
      console.error(err);
      toast.error("Unable to submit call registration.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <div>
        <h3 className="text-lg font-black text-white">New Call Registration</h3>
        <p className="mt-1 text-sm text-slate-400">
          Register the shipment call and upload required documents. ETA must be at least 7 days from today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Call ID (optional)</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="CALL-001"
            value={form.callId}
            onChange={(ev) => setForm((c) => ({ ...c, callId: ev.target.value }))}
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">IMO number</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="IMO 1234567"
            value={form.imoNumber}
            onChange={(ev) => setForm((c) => ({ ...c, imoNumber: ev.target.value }))}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Vessel name</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="MV PortView Explorer"
            value={form.vesselName}
            onChange={(ev) => setForm((c) => ({ ...c, vesselName: ev.target.value }))}
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">ETA date</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            type="date"
            min={minEtaDate}
            value={form.eta}
            onChange={(ev) => setForm((c) => ({ ...c, eta: ev.target.value }))}
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">ETA time (optional)</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            type="time"
            value={form.etaTime}
            onChange={(ev) => setForm((c) => ({ ...c, etaTime: ev.target.value }))}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Cargo description (optional)</span>
          <textarea
            className="mt-2 min-h-[90px] w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="Cargo type, quantity, and any notes"
            value={form.cargoDescription}
            onChange={(ev) => setForm((c) => ({ ...c, cargoDescription: ev.target.value }))}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">Proforma invoice (optional)</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            type="file"
            accept="application/pdf"
            onChange={(ev) =>
              setForm((c) => ({
                ...c,
                files: { ...c.files, proformaInvoice: ev.target.files?.[0] ?? null },
              }))
            }
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">BL / Manifest (optional)</span>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            type="file"
            accept="application/pdf"
            onChange={(ev) =>
              setForm((c) => ({
                ...c,
                files: { ...c.files, blManifest: ev.target.files?.[0] ?? null },
              }))
            }
          />
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300"
          type="button"
          onClick={() => {
            setForm({
              callId: "",
              vesselName: "",
              imoNumber: "",
              eta: "",
              etaTime: "",
              cargoDescription: "",
              files: {
                proformaInvoice: null,
                blManifest: null,
              },
            });
          }}
          disabled={isSaving}
        >
          Reset
        </button>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

