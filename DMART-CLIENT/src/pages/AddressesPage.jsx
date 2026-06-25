import { useEffect, useState } from "react";
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../services/api";
import { useToast } from "../components/Toast";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Home,
  Briefcase,
  X,
  Save,
  Loader2,
  Star,
  Check,
  Phone,
} from "lucide-react";

const EMPTY_FORM = {
  type: "HOME",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  phone: "",
  label: "",
};

const ADDRESS_TYPES = [
  { value: "HOME", label: "Home", icon: Home },
  { value: "WORK", label: "Work", icon: Briefcase },
  { value: "OTHER", label: "Other", icon: MapPin },
];

export default function AddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleOpenEdit = (address) => {
    setEditingId(address.id);
    setForm({
      type: address.type || "HOME",
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      phone: address.phone || "",
      label: address.label || "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.postalCode.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required for delivery");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        const res = await updateAddress(editingId, form);
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? res.data : a))
        );
        toast.success("Address updated successfully");
      } else {
        const res = await addAddress(form);
        if (res.data.isDefault) {
          setAddresses((prev) => [...prev.map((a) => ({ ...a, isDefault: false })), res.data]);
        } else {
          setAddresses((prev) => [...prev, res.data]);
        }
        toast.success("Address added successfully");
      }
      handleCancel();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setSettingDefaultId(id);
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      toast.success("Default address updated");
    } catch (err) {
      toast.error("Failed to set default address");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteAddress(id);
      const wasDefault = addresses.find((a) => a.id === id)?.isDefault;
      const remaining = addresses.filter((a) => a.id !== id);
      if (wasDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      setAddresses(remaining);
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeIcon = (type) => {
    const found = ADDRESS_TYPES.find((t) => t.value === type);
    return found ? found.icon : MapPin;
  };

  const getTypeLabel = (type) => {
    const found = ADDRESS_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading addresses...</span>
        </div>
      </div>
    );
  }

  // Sort: default address first
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
            <p className="text-gray-500 mt-1">
              Manage your delivery addresses
            </p>
          </div>
          {!showForm && (
            <button
              onClick={handleOpenAdd}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="flex gap-3 flex-wrap">
                  {ADDRESS_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = form.type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, type: t.value, label: t.value === "OTHER" ? p.label : "" }))}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                          isSelected
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Label for OTHER type */}
              {form.type === "OTHER" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Label <span className="text-gray-400 font-normal">(optional — e.g. "Mom's House", "Gym")</span>
                  </label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                    placeholder="Give this address a name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
              )}

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="10-digit mobile number for delivery updates"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Required for delivery partner to contact you</p>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address Line 1 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.line1}
                  onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))}
                  placeholder="House/Flat No., Building Name, Street"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address Line 2 <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.line2}
                  onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))}
                  placeholder="Landmark, Area"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Postal Code & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Postal Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    placeholder="Country"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingId ? "Update Address" : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address Cards */}
        {addresses.length === 0 && !showForm ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-sm text-gray-500 mb-6">
              Add a delivery address to speed up your checkout experience.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedAddresses.map((address) => {
              const TypeIcon = getTypeIcon(address.type);
              const displayLabel = address.type === "OTHER" && address.label
                ? address.label
                : getTypeLabel(address.type);

              return (
                <div
                  key={address.id}
                  className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all group relative ${
                    address.isDefault
                      ? "border-green-200 ring-1 ring-green-100"
                      : "border-gray-100"
                  }`}
                >
                  {/* Default Badge */}
                  {address.isDefault && (
                    <div className="absolute -top-2.5 right-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-600 text-white text-xs font-semibold shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </span>
                    </div>
                  )}

                  {/* Type Badge & Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                      <TypeIcon className="w-3.5 h-3.5" />
                      {displayLabel}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          disabled={settingDefaultId === address.id}
                          className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition disabled:opacity-50"
                          aria-label="Set as default"
                          title="Set as default"
                        >
                          {settingDefaultId === address.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(address)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-green-600 transition"
                        aria-label="Edit address"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        disabled={deletingId === address.id}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                        aria-label="Delete address"
                      >
                        {deletingId === address.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Address Content */}
                  <p className="text-sm font-medium text-gray-900">
                    {address.line1}
                  </p>
                  {address.line2 && (
                    <p className="text-sm text-gray-500 mt-0.5">{address.line2}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    {address.city}, {address.state} — {address.postalCode}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{address.country}</p>

                  {/* Phone */}
                  {address.phone && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>{address.phone}</span>
                    </div>
                  )}

                  {/* Set Default Button (visible on non-default cards) */}
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={settingDefaultId === address.id}
                      className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium transition disabled:opacity-50 flex items-center gap-1"
                    >
                      {settingDefaultId === address.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className="w-3 h-3" />
                      )}
                      Set as Default
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
