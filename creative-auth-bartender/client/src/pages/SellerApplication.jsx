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
		<div className="seller-app-root">
			{/* Application Form (Left) */}
			<div className="seller-app-form-container">
				<h2 className="seller-app-form-title">Seller Application</h2>
				{submitted ? (
					<div className="seller-app-success-message">
						<h3>Thank you for your application!</h3>
						<p>
							Our team will review your submission and contact you at{" "}
							<b>{form.email}</b>
							.
							<br />
							We look forward to partnering with you!
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="seller-app-form">
						<label>
							Business Name
							<input
								type="text"
								name="businessName"
								value={form.businessName}
								onChange={handleChange}
								required
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
							/>
						</label>
						<label>
							Business Type
							<select
								name="businessType"
								value={form.businessType}
								onChange={handleChange}
								required
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
								placeholder="https://yourbusiness.com or @yourhandle"
							/>
						</label>
						<label className="seller-app-checkbox-label">
							<input
								type="checkbox"
								name="confirmLicensed"
								checked={form.confirmLicensed}
								onChange={handleChange}
								required
							/>
							I confirm I am licensed to sell alcohol in my country.
						</label>
						{submitError && (
							<div className="seller-app-error">{submitError}</div>
						)}
						<button
							type="submit"
							disabled={submitting}
						>
							{submitting ? "Submitting..." : "Submit Application"}
						</button>
					</form>
				)}
			</div>
			{/* Seller Success Stories (Right) */}
			<div className="seller-app-stories-container">
				<h2 className="seller-app-stories-title">Seller Success Stories</h2>
				<div className="seller-app-stories-list">
					{sellerStories.map((story, idx) => (
						<div key={idx} className="seller-app-story">
							<h4 className="seller-app-story-title">{story.name}</h4>
							<p style={{ margin: 0 }}>{story.story}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
