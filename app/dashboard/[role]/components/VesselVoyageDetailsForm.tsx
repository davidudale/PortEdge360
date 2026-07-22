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

type VesselVoyageRecord = {
  id?: string;
  _parentDoc?: string;
  // Vessel Information
  vesselName: string;
  imoNumber: string;
  callSign: string;
  flag: string;
  vesselType: string;
  agent: string;
  // Voyage Details
  voyageNumber: string;
  portOfArrival: string;
  eta: string;
  portOfLastCall: string;
  portOfNextCall: string;
  createdAt?: unknown;
};

type VesselVoyageFormState = {
  vesselName: string;
  imoNumber: string;
  callSign: string;
  flag: string;
  vesselType: string;
  agent: string;
  voyageNumber: string;
  portOfArrival: string;
  eta: string;
  portOfLastCall: string;
  portOfNextCall: string;
};

const emptyForm: VesselVoyageFormState = {
  vesselName: "",
  imoNumber: "",
  callSign: "",
  flag: "",
  vesselType: "",
  agent: "",
  voyageNumber: "",
  portOfArrival: "",
  eta: "",
  portOfLastCall: "",
  portOfNextCall: "",
};

const vesselTypeOptions = [
  "Container",
  "Bulk Carrier",
  "Tanker",
  "Ro-Ro",
  "General Cargo",
  "LNG Carrier",
  "Passenger",
  "Chemical Tanker",
  "Reefer",
  "Other",
];

function formatDate(value: unknown) {
  if (!value) return "Not recorded";
  if (value instanceof Timestamp) return value.toDate().toLocaleDateString();
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as any).toDate === "function")
    return (value as any).toDate().toLocaleDateString();
  return "Not recorded";
}

export default function VesselVoyageDetailsForm() {
  const [records, setRecords] = useState<VesselVoyageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<VesselVoyageFormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchRecords() {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "vesselVoyageDetails"));
      const docs = snapshot.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          vesselName: (data.vesselName as string) ?? "",
          imoNumber: (data.imoNumber as string) ?? "",
          callSign: (data.callSign as string) ?? "",
          flag: (data.flag as string) ?? "",
          vesselType: (data.vesselType as string) ?? "",
          agent: (data.agent as string) ?? "",
          voyageNumber: (data.voyageNumber as string) ?? "",
          portOfArrival: (data.portOfArrival as string) ?? "",
          eta: (data.eta as string) ?? "",
          portOfLastCall: (data.portOfLastCall as string) ?? "",
          portOfNextCall: (data.portOfNextCall as string) ?? "",
          createdAt: data.createdAt,
        } as VesselVoyageRecord;
      });
      docs.sort((a, b) => (a.vesselName || "").localeCompare(b.vesselName || ""));
      setRecords(docs);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch vessel/voyage records.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetchRecords().then(() => {
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

  function handleEdit(record: VesselVoyageRecord) {
    setEditingId(record.id ?? null);
    setFormState({
      vesselName: record.vesselName ?? "",
      imoNumber: record.imoNumber ?? "",
      callSign: record.callSign ?? "",
      flag: record.flag ?? "",
      vesselType: record.vesselType ?? "",
      agent: record.agent ?? "",
      voyageNumber: record.voyageNumber ?? "",
      portOfArrival: record.portOfArrival ?? "",
      eta: record.eta ?? "",
      portOfLastCall: record.portOfLastCall ?? "",
      portOfNextCall: record.portOfNextCall ?? "",
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.vesselName.trim() || !formState.imoNumber.trim()) {
      toast.error("Vessel name and IMO number are required.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        vesselName: formState.vesselName.trim(),
        imoNumber: formState.imoNumber.trim(),
        callSign: formState.callSign.trim(),
        flag: formState.flag.trim(),
        vesselType: formState.vesselType,
        agent: formState.agent.trim(),
        voyageNumber: formState.voyageNumber.trim(),
        portOfArrival: formState.portOfArrival.trim(),
        eta: formState.eta,
        portOfLastCall: formState.portOfLastCall.trim(),
        portOfNextCall: formState.portOfNextCall.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "vesselVoyageDetails", editingId), payload);
        toast.success("Vessel/Voyage record updated.");
      } else {
        await addDoc(collection(db, "vesselVoyageDetails"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("Vessel/Voyage record created.");
      }
      resetForm();
      setIsModalOpen(false);
      await fetchRecords();
    } catch (err) {
      console.error(err);
      toast.error("Unable to save record.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(record: VesselVoyageRecord) {
    const label = `${record.vesselName} (${record.imoNumber})` || "this record";
    if (!window.confirm(`Delete vessel/voyage record for "${label}"?`)) return;
    try {
      const docId = record.id;
      if (docId) {
        await deleteDoc(doc(db, "vesselVoyageDetails", docId));
        toast.success("Record deleted.");
        await fetchRecords();
        if (editingId === record.id) resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete record.");
    }
  }

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return records;
    return records.filter((r) =>
      [
        r.vesselName,
        r.imoNumber,
        r.callSign,
        r.flag,
        r.vesselType,
        r.agent,
        r.voyageNumber,
        r.portOfArrival,
        r.portOfLastCall,
        r.portOfNextCall,
      ].some((v) => v?.toLowerCase().includes(term)),
    );
  }, [searchTerm, records]);

  return (
    <div className="space-y-5">
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vessel-modal-title"
        >
          <form
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-[#0f172a] p-5 shadow-2xl shadow-black/40"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3
                className="text-sm font-black uppercase tracking-[0.16em] text-white"
                id="vessel-modal-title"
              >
                {editingId ? "Edit Vessel & Voyage" : "New Vessel & Voyage"}
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

            {/* Vessel Information */}
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Vessel Information
              </p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <label className="block lg:col-span-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Vessel Name</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="MV PortView Explorer"
                    value={formState.vesselName}
                    onChange={(e) => setFormState((p) => ({ ...p, vesselName: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Vessel IMO Number</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="IMO 1234567"
                    value={formState.imoNumber}
                    onChange={(e) => setFormState((p) => ({ ...p, imoNumber: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Vessel Call Sign</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="ABCD"
                    value={formState.callSign}
                    onChange={(e) => setFormState((p) => ({ ...p, callSign: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Vessel Flag</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="Panama, Liberia, Marshall Islands..."
                    value={formState.flag}
                    onChange={(e) => setFormState((p) => ({ ...p, flag: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Vessel Type</span>
                  <select
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition focus:border-orange-500/60"
                    value={formState.vesselType}
                    onChange={(e) => setFormState((p) => ({ ...p, vesselType: e.target.value }))}
                  >
                    <option value="">Select type</option>
                    {vesselTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Agent Representing Vessel</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="Agency Name Ltd."
                    value={formState.agent}
                    onChange={(e) => setFormState((p) => ({ ...p, agent: e.target.value }))}
                  />
                </label>
              </div>
            </div>

            {/* Voyage Details */}
            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Voyage Details
              </p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Voyage Number</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="VY-2024-001"
                    value={formState.voyageNumber}
                    onChange={(e) => setFormState((p) => ({ ...p, voyageNumber: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Port of Arrival</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="Port of Lagos"
                    value={formState.portOfArrival}
                    onChange={(e) => setFormState((p) => ({ ...p, portOfArrival: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">ETA - Estimated Time of Arrival</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    type="date"
                    value={formState.eta}
                    onChange={(e) => setFormState((p) => ({ ...p, eta: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Port of Last Call</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="Port of Tema"
                    value={formState.portOfLastCall}
                    onChange={(e) => setFormState((p) => ({ ...p, portOfLastCall: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Port of Next Call</span>
                  <input
                    className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500/60"
                    placeholder="Port of Abidjan"
                    value={formState.portOfNextCall}
                    onChange={(e) => setFormState((p) => ({ ...p, portOfNextCall: e.target.value }))}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
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
            placeholder="Search vessels..."
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
            Add Vessel
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300 disabled:cursor-wait disabled:opacity-60"
            disabled={isLoading}
            type="button"
            onClick={fetchRecords}
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
                <th className="px-4 py-3">Vessel name</th>
                <th className="px-4 py-3">IMO #</th>
                <th className="px-4 py-3">Call sign</th>
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Voyage #</th>
                <th className="px-4 py-3">ETA</th>
                <th className="px-4 py-3">Last call</th>
                <th className="px-4 py-3">Next call</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={12}>Loading records...</td>
                </tr>
              )}
              {!isLoading && filteredRecords.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={12}>No vessel/voyage records found.</td>
                </tr>
              )}
              {!isLoading &&
                filteredRecords.map((record, idx) => (
                  <tr className="transition hover:bg-white/[0.03]" key={record.id ?? idx}>
                    <td className="px-4 py-3 font-semibold text-white">{record.vesselName || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{record.imoNumber || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{record.callSign || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{record.flag || "—"}</td>
                    <td className="px-4 py-3">
                      {record.vesselType ? (
                        <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-xs font-black capitalize text-orange-200">
                          {record.vesselType}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{record.agent || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{record.voyageNumber || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{record.eta || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{record.portOfLastCall || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300">{record.portOfNextCall || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(record.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:border-orange-500/40 hover:text-orange-300"
                          title="Edit"
                          type="button"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit3 aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 text-red-200 transition hover:bg-red-500/10"
                          title="Delete"
                          type="button"
                          onClick={() => handleDelete(record)}
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
