"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Auth/firebase";
import { Edit3, Plus, RefreshCw, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";


type CargoEntry = {
  id?: string;
  _parentDoc?: string;
  cargoType: string;
  commodity: string;
  quantity: number;
  unit: string;
  containerCount: number | null;
  containerSizes: string;
  manifestNumber: string;
  billOfLading: string;
  createdAt?: unknown;
};

type CargoFormState = {
  cargoType: string;
  commodity: string;
  quantity: string;
  unit: string;
  containerCount: string;
  containerSizes: string;
  manifestNumber: string;
  billOfLading: string;
};

const emptyForm: CargoFormState = {
  cargoType: "",
  commodity: "",
  quantity: "",
  unit: "MT",
  containerCount: "",
  containerSizes: "",
  manifestNumber: "",
  billOfLading: "",
};

const cargoTypeOptions = [
  "Containerized",
  "Bulk",
  "General",
  "Liquid",
  "Break Bulk",
  "Ro-Ro",
  "Project Cargo",
  "Hazardous",
];

const unitOptions = ["MT", "CBM", "TEU", "Tonnes", "KG", "LBS"];

function formatDate(value: unknown) {
  if (!value) return "Not recorded";
  if (value instanceof Timestamp) return value.toDate().toLocaleDateString();
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as any).toDate === "function")
    return (value as any).toDate().toLocaleDateString();
  return "Not recorded";
}

export default function CargoDetailsForm() {
  const [entries, setEntries] = useState<CargoEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<CargoFormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchEntries() {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "cargoDetails"));
      const docs = snapshot.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        const cargoEntries = data.cargoEntries as Array<Record<string, unknown>> | undefined;
        if (cargoEntries && Array.isArray(cargoEntries)) {
          return cargoEntries.map((ce: Record<string, unknown>, idx: number) => ({
            id: `${d.id}_${idx}`,
            _parentDoc: d.id,
            cargoType: (ce.cargoType as string) ?? "",
            commodity: (ce.commodity as string) ?? "",
            quantity: (ce.quantity as number) ?? 0,
            unit: (ce.unit as string) ?? "MT",
            containerCount: (ce.containerCount as number | null) ?? null,
            containerSizes: (ce.containerSizes as string) ?? "",
            manifestNumber: (ce.manifestNumber as string) ?? "",
            billOfLading: (ce.billOfLading as string) ?? "",
            createdAt: data.createdAt,
          }));
        }
        return {
          id: d.id,
          cargoType: (data.cargoType as string) ?? "",
          commodity: (data.commodity as string) ?? "",
          quantity: (data.quantity as number) ?? 0,
          unit: (data.unit as string) ?? "MT",
          containerCount: (data.containerCount as number | null) ?? null,
          containerSizes: (data.containerSizes as string) ?? "",
          manifestNumber: (data.manifestNumber as string) ?? "",
          billOfLading: (data.billOfLading as string) ?? "",
          createdAt: data.createdAt,
        };
      });
      // Flatten nested arrays and sort
      const flat = docs.flat().sort((a, b) => {
        const aName = a.commodity || a.cargoType || "";
        const bName = b.commodity || b.cargoType || "";
        return aName.localeCompare(bName);
      });
      setEntries(flat);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch cargo records.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetchEntries().then(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, []);

  function resetForm() {
    setEditingId(null);
    setFormState(emptyForm);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
    resetForm();
  }

  function handleEdit(entry: CargoEntry) {
    setEditingId(entry.id ?? null);
    setFormState({
      cargoType: entry.cargoType,
      commodity: entry.commodity,
      quantity: String(entry.quantity ?? ""),
      unit: entry.unit,
      containerCount: entry.containerCount != null ? String(entry.containerCount) : "",
      containerSizes: entry.containerSizes ?? "",
      manifestNumber: entry.manifestNumber ?? "",
      billOfLading: entry.billOfLading ?? "",
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.cargoType || !formState.commodity.trim() || !formState.quantity) {
      toast.error("Cargo type, commodity, and quantity are required.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        cargoType: formState.cargoType,
        commodity: formState.commodity.trim(),
        quantity: Number.parseFloat(formState.quantity) || 0,
        unit: formState.unit,
        containerCount: formState.containerCount ? Number.parseInt(formState.containerCount, 10) || null : null,
        containerSizes: formState.containerSizes.trim() || "",
        manifestNumber: formState.manifestNumber.trim() || "",
        billOfLading: formState.billOfLading.trim() || "",
        updatedAt: serverTimestamp(),
      };

      if (editingId && !editingId.includes("_")) {
        // Update existing doc
        await updateDoc(doc(db, "cargoDetails", editingId), payload);
        toast.success("Cargo record updated.");
      } else {
        // Create new doc
        await addDoc(collection(db, "cargoDetails"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Cargo record created.");
      }
      resetForm();
      setIsModalOpen(false);
      await fetchEntries();
    } catch (err) {
      console.error(err);
      toast.error("Unable to save cargo record.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(entry: CargoEntry) {
    const label = `${entry.cargoType} - ${entry.commodity}` || "this record";
    if (!window.confirm(`Delete cargo record for "${label}"?`)) return;
    try {
      const docId = entry._parentDoc ?? entry.id;
      if (docId) {
        await deleteDoc(doc(db, "cargoDetails", docId));
        toast.success("Cargo record deleted.");
        await fetchEntries();
        if (editingId === entry.id) resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete cargo record.");
    }
  }

  const filteredEntries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter((e) =>
      [e.cargoType, e.commodity, e.unit, e.manifestNumber, e.billOfLading].some(
        (v) => v?.toLowerCase().includes(term),
      ),
    );
  }, [searchTerm, entries]);

  return (
    <div className="space-y-5">
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cargo-modal-title"
        >
          <form
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-[#0f172a] p-5 shadow-2xl shadow-black/40"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3
                className="text-sm font-black uppercase tracking-[0.16em] text-white"
                id="cargo-modal-title"
              >
                {editingId ? "Edit cargo record" : "New cargo record"}
              </h3>
              <button
                className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:text-white disabled:cursor-wait disabled:opacity-60"
                disabled={isSaving}
                title="Close"
                type="button"
                onClick={closeModal}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <label className="block lg:col-span-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Cargo description / Commodity</span>
                <input
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="e.g. Wheat, Crude Oil, Electronics"
                  value={formState.commodity}
                  onChange={(e) => setFormState((p) => ({ ...p, commodity: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Cargo type</span>
                <select
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-500/60"
                  value={formState.cargoType}
                  onChange={(e) => setFormState((p) => ({ ...p, cargoType: e.target.value }))}
                >
                  <option value="">Select type</option>
                  {cargoTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Quantity</span>
                <input
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="e.g. 25000"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.quantity}
                  onChange={(e) => setFormState((p) => ({ ...p, quantity: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Unit</span>
                <select
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-500/60"
                  value={formState.unit}
                  onChange={(e) => setFormState((p) => ({ ...p, unit: e.target.value }))}
                >
                  {unitOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Number of containers</span>
                <input
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="e.g. 120"
                  type="number"
                  min="0"
                  value={formState.containerCount}
                  onChange={(e) => setFormState((p) => ({ ...p, containerCount: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Container types / sizes</span>
                <input
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="e.g. 20ft, 40ft HC, Reefer"
                  value={formState.containerSizes}
                  onChange={(e) => setFormState((p) => ({ ...p, containerSizes: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Manifest number</span>
                <input
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="MFT-001234"
                  value={formState.manifestNumber}
                  onChange={(e) => setFormState((p) => ({ ...p, manifestNumber: e.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Bill of Lading numbers</span>
                <input
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                  placeholder="BOL-001, BOL-002"
                  value={formState.billOfLading}
                  onChange={(e) => setFormState((p) => ({ ...p, billOfLading: e.target.value }))}
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="inline-flex h-10 items-center rounded-lg border border-white/10 px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:text-white disabled:cursor-wait disabled:opacity-60"
                disabled={isSaving}
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {editingId ? <Save aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
                {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-80">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            className="h-10 w-full rounded-lg border border-white/10 bg-[#111827] pl-10 pr-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
            placeholder="Search cargo records"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-xs font-black uppercase tracking-wider text-white transition hover:bg-orange-400"
            type="button"
            onClick={openCreateModal}
          >
            <Plus aria-hidden="true" className="size-4" />
            Add cargo
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300 disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            type="button"
            onClick={fetchEntries}
          >
            <RefreshCw aria-hidden="true" className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Cargo type</th>
                <th className="px-4 py-3">Commodity</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Containers</th>
                <th className="px-4 py-3">Sizes</th>
                <th className="px-4 py-3">Manifest #</th>
                <th className="px-4 py-3">B/L</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={10}>Loading cargo records...</td>
                </tr>
              )}
              {!isLoading && filteredEntries.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={10}>No cargo records found.</td>
                </tr>
              )}
              {!isLoading &&
                filteredEntries.map((entry, idx) => (
                  <tr className="transition hover:bg-white/[0.03]" key={entry.id ?? idx}>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-xs font-black capitalize text-orange-200">
                        {entry.cargoType || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {entry.commodity || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-300">
                      {entry.quantity ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-400">
                      {entry.unit || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-300">
                      {entry.containerCount != null ? entry.containerCount : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-300">
                      {entry.containerSizes || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {entry.manifestNumber || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {entry.billOfLading || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300"
                          title="Edit"
                          type="button"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit3 aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 text-red-200 transition hover:bg-red-500/10"
                          title="Delete"
                          type="button"
                          onClick={() => handleDelete(entry)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
