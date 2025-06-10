import React, { useState } from "react";
import "../styles/SellerApplication.css";

const sellerStories = [
	{
		name: "Sip & Co. Distillery",
		story: "We grew our customer base by 300% in 6 months. The Drunken Giraffe made it easy to manage orders and payments.",
	},
	{
		name: "Barrel Boutique",
		story: "The marketing support and compliance help were game changers. We now reach customers across the country.",
	},
	{
		name: "Mixology Accessories",
		story: "As a small business, the platform gave us instant credibility and access to thousands of buyers.",
	},
	// Add more stories as needed
];

export default function SellerApplication() {
	const [form, setForm] = useState({
		businessName: "",
		ownerName: "",
		email: "",
		phone: "",
		businessType: "",
		registrationNumber: "",
		licenseFile: null,
		productTypes: "",
		website: "",
		confirmLicensed: false,
	});
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value, type, checked, files } = e.target;
		if (type === "checkbox") {
			setForm({ ...form, [name]: checked });
		} else if (type === "file") {
			setForm({ ...form, [name]: files[0] });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitError("");
		setSubmitting(true);

		// Prepare form data for multipart/form-data
		const formData = new FormData();
		Object.entries(form).forEach(([key, value]) => {
			if (key === "licenseFile" && value) {
				formData.append("licenseFile", value);
			} else {
				formData.append(key, value);
			}
		});

		try {
			const res = await fetch("/api/seller/apply", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) {
				const err = await res.json();
				setSubmitError(err.message || "Submission failed");
				setSubmitting(false);
				return;
			}
			setSubmitted(true);
		} catch (err) {
			setSubmitError("Submission failed. Please try again.");
		}
		setSubmitting(false);
	};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #350b0f 0%, #9b1c23 100%)",
      color: "#fff",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "48px 0",
      gap: 48,
    }}>
      {/* Application Form (Left) */}
      <div style={{
        background: "#fff",
        color: "#350b0f",
        borderRadius: 16,
        padding: "32px 24px",
        maxWidth: 440,
        width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        minHeight: 600,
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 24, color: "#9b1c23" }}>
          Seller Application
        </h2>
        {submitted ? (
          <div style={{ textAlign: "center", color: "#2e7d32" }}>
            <h3>Thank you for your application!</h3>
            <p>
              Our team will review your submission and contact you at <b>{form.email}</b>.<br />
              We look forward to partnering with you!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label>
              Business Name
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
              />
            </label>
            <label>
              Business Owner Full Name
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
              />
            </label>
            <label>
              Business Type
              <select
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
              >
                <option value="">Select type</option>
                <option value="Brewery">Brewery</option>
                <option value="Retailer">Retailer</option>
                <option value="Accessories Brand">Accessories Brand</option>
                <option value="Distillery">Distillery</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Business Registration Number
              <input
                type="text"
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
              />
            </label>
            <label>
              Upload Liquor License
              <input
                type="file"
                name="licenseFile"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                required
                style={{ marginTop: 4 }}
              />
            </label>
            <label>
              Product Types You Intend to Sell
              <input
                type="text"
                name="productTypes"
                value={form.productTypes}
                onChange={handleChange}
                required
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
                placeholder="e.g. Gin, Whiskey, Glassware"
              />
            </label>
            <label>
              Website or Social Media Links
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #e9c4b4", marginTop: 4 }}
                placeholder="https://yourbusiness.com or @yourhandle"
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                name="confirmLicensed"
                checked={form.confirmLicensed}
                onChange={handleChange}
                required
                style={{ width: 18, height: 18 }}
              />
              I confirm I am licensed to sell alcohol in my country.
            </label>
            {submitError && (
              <div style={{ color: "red", marginBottom: 8 }}>{submitError}</div>
            )}
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #e1bb3e 60%, #e35537 100%)",
                color: "#350b0f",
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                marginTop: 8
              }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
      {/* Seller Success Stories (Right) */}
      <div style={{
        flex: 1,
        minWidth: 320,
        maxWidth: 420,
        background: "rgba(255,255,255,0.10)",
        borderRadius: 16,
        padding: "32px 24px",
        color: "#fff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        height: "fit-content",
        maxHeight: 700,
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#e1bb3e", marginBottom: 24, textAlign: "center" }}>Seller Success Stories</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {sellerStories.map((story, idx) => (
            <div key={idx} style={{
              background: "rgba(255,255,255,0.13)",
              borderRadius: 10,
              padding: 18,
              color: "#350b0f",
              fontWeight: 500,
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
            }}>
              <h4 style={{ color: "#9b1c23", marginBottom: 8 }}>{story.name}</h4>
              <p style={{ margin: 0 }}>{story.story}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
