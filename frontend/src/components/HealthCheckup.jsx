// HealthCheckup.js
import React, { useState } from "react";

const COURSE_OPTIONS = [
  "Accounting","Ala","Banking Studies","BCS","Benl","Biomedical Science",
  "Biotechnology","BIT","Business Administration","Communication","CTS",
  "Diploma Nursing","Diploma Tesl","Econs","Engin","Engineering","Engine",
  "ENM","Fiqh Fatwa","Fiqh","Human Resources","Human Sciences","Irkhs",
  "KENMS","KIRKHS","KOE","KOP","Law","Laws","Malcom","Marine Science",
  "Mathematics","MHSC","Nursing","Pendidikan Islam","Psychology",
  "Radiography","TAASL","Usuluddin","Other"
];

const CGPA_OPTIONS = [
  "3.50 - 4.00","3.00 - 3.49","2.50 - 2.99","2.00 - 2.49","0 - 1.99","Other"
];

export default function HealthCheckup() {
  const [form, setForm] = useState({
    gender: "Male",
    age: "",
    course: "",
    otherCourse: "",
    year_of_study: "",
    cgpa: "",
    otherCgpa: "",
    marital_status: "No",
    depression: "No",
    anxiety: "No",
    panic_attack: "No"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Normalize free-text course to match training data
  const normalizeCourse = (raw, other) => {
    const txt = (raw === "Other" ? other : raw).trim().toLowerCase();
    if (!txt) return "";

    const map = {
      engin: "Engineering", engine: "Engineering",
      bit: "BIT", bcs: "BCS",
      biomed: "Biomedical Science", nurs: "Nursing",
      psych: "Psychology", law: "Law",
      bank: "Banking Studies", biotech: "Biotechnology",
      communication: "Communication", mathem: "Mathematics",
      radiography: "Radiography", marine: "Marine Science",
      "human resource": "Human Resources",
      pendidikan: "Pendidikan Islam", islam: "Pendidikan Islam"
    };

    for (const [key, val] of Object.entries(map)) {
      if (txt.includes(key)) return val;
    }

    // Fallback: title case
    return txt.split(" ")
      .filter(Boolean)
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Basic validation
    if (
      !form.age ||
      (!form.course && !form.otherCourse) ||
      !form.year_of_study ||
      (!form.cgpa && !form.otherCgpa)
    ) {
      setError("Please fill in Age, Course, Year of Study, and CGPA.");
      return;
    }

    const payload = {
      gender: form.gender,
      age: Number(form.age),
      course: normalizeCourse(form.course, form.otherCourse),
      year_of_study: form.year_of_study,
      cgpa: form.cgpa === "Other" ? form.otherCgpa.trim() : form.cgpa,
      marital_status: form.marital_status,
      depression: form.depression,
      anxiety: form.anxiety,
      panic_attack: form.panic_attack,
    };

    console.log("Sending payload:", payload);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("Raw server response:", text);  

      if (!res.ok) {
        let errorMsg = text || `HTTP ${res.status}`;
        try {
          const errJson = JSON.parse(text);
          errorMsg = errJson.detail || text;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = JSON.parse(text);
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg my-9">
      <h2 className="text-2xl font-semibold text-teal-700 mb-4">Mental Health Checkup</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="font-medium">Gender</span>
            <select name="gender" value={form.gender} onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="font-medium">Age</span>
            <input name="age" type="number" min="10" max="120"
                   value={form.age} onChange={handleChange}
                   placeholder="e.g. 21"
                   className="mt-1 p-2 border rounded"/>
          </label>
        </div>

        <label className="flex flex-col">
          <span className="font-medium">Course</span>
          <select name="course" value={form.course} onChange={handleChange}
                  className="mt-1 p-2 border rounded">
            <option value="">Select course</option>
            {COURSE_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        {form.course === "Other" && (
          <label className="flex flex-col">
            <span className="font-medium">Enter your course</span>
            <input name="otherCourse" value={form.otherCourse}
                   onChange={handleChange}
                   placeholder="e.g. Data Science"
                   className="mt-1 p-2 border rounded"/>
          </label>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="font-medium">Year of Study</span>
            <select name="year_of_study" value={form.year_of_study}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option value="">Select year</option>
              <option>Year 1</option>
              <option>Year 2</option>
              <option>Year 3</option>
              <option>Year 4</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="font-medium">CGPA</span>
            <select name="cgpa" value={form.cgpa} onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option value="">Select CGPA</option>
              {CGPA_OPTIONS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>

        {form.cgpa === "Other" && (
          <label className="flex flex-col">
            <span className="font-medium">Enter CGPA</span>
            <input name="otherCgpa" value={form.otherCgpa}
                   onChange={handleChange}
                   placeholder="e.g. 3.75"
                   className="mt-1 p-2 border rounded"/>
          </label>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="font-medium">Marital Status</span>
            <select name="marital_status" value={form.marital_status}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="font-medium">Depression?</span>
            <select name="depression" value={form.depression}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
          <label className="flex flex-col">
            <span className="font-medium">Anxiety?</span>
            <select name="anxiety" value={form.anxiety}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="font-medium">Panic Attack?</span>
            <select name="panic_attack" value={form.panic_attack}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded">
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => setForm({
              gender: "Male", age: "", course: "", otherCourse: "",
              year_of_study: "", cgpa: "", otherCgpa: "",
              marital_status: "No", depression: "No", anxiety: "No", panic_attack: "No"
            })}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-lg mb-2">Prediction Result</h3>
          <div className="mb-2">
            <strong>Ensemble prediction:</strong>{" "}
            {result.ensemble_prediction === 1
              ? "Likely needs specialist"
              : "Unlikely / Low"}{" "}
            (prob: {(result.ensemble_probability * 100).toFixed(1)}%)
          </div>
          <div>
            <strong>Model probabilities:</strong>
            <ul className="list-disc pl-6 mt-1">
              <li>Logistic Regression: {(result.model_probs.logistic_regression * 100).toFixed(1)}%</li>
              <li>SVM: {(result.model_probs.svm * 100).toFixed(1)}%</li>
              <li>Random Forest: {(result.model_probs.random_forest * 100).toFixed(1)}%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}