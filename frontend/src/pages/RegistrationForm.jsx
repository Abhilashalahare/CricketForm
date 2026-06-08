import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { FaUpload } from 'react-icons/fa';
import bgimage from '../assets/bgimage.jpeg';

const initialFormState = {
  fullName: '',
  profession: '',
  photo: null,
  photoPreview: null,
  mobileNumber: '',
  whatsappNumber: '',
  emailId: '',
  residentialAddress: '',
  aadharNumber: '',
  utrNumber: '',
  utrReceipt: null,
  utrReceiptPreview: null,
  battingSkill: 'None',
  bowlingSkill: 'None',
  fieldingPreference: '',
  cricheroesId: '',
  instagramId: '',
  declarationAccepted: false,
  signatureName: '',
  submissionDate: '',
  submissionPlace: '',
  jerseyName: '',
  jerseyNumber: '',
  jerseySize: 'S',
  lowerSize: '',
  wicketKeeping: 'No',
};

const RegistrationForm = () => {
  const fileInputRef = useRef(null);
  const receiptInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    profession: '',
    photo: null,
    photoPreview: null,
    mobileNumber: '',
    whatsappNumber: '',
    emailId: '',
    residentialAddress: '',
    aadharNumber: '',

    // Kit & Payment Details
    utrNumber: '',
    utrReceipt: null,
    utrReceiptPreview: null,
    jerseyName: '',
    jerseyNumber: '',
    jerseySize: 'S',
    lowerSize: '',
    wicketKeeping: 'No',

    // Skills & Social
    battingSkill: 'None',
    bowlingSkill: 'None',
    fieldingPreference: '',
    cricheroesId: '',
    instagramId: '',

    // Declaration
    declarationAccepted: false,
    signatureName: '',
    submissionDate: '',
    submissionPlace: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file, // This stores the File object
        photoPreview: URL.createObjectURL(file) // This stores the URL for preview
      }));
    }
  };

  const handleUtrReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        utrReceipt: file, // This stores the File object
        utrReceiptPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent double submission

    if (!formData.utrReceipt) {
      toast.error("Please upload your payment receipt.");
      return;
    }

    setSubmitting(true);

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    try {
      let photoBase64 = null;
      if (formData.photo) {
        photoBase64 = await convertToBase64(formData.photo);
      }

      let utrReceiptBase64 = null;
      if (formData.utrReceipt) utrReceiptBase64 = await convertToBase64(formData.utrReceipt);



      const payload = {
        ...formData,
        photo: photoBase64,
        utrReceipt: utrReceiptBase64,
        skills: {
          batting: formData.battingSkill,
          bowling: formData.bowlingSkill,
          fieldingPreference: formData.fieldingPreference
        },
        aadharNumber: formData.aadharNumber,
        utrNumber: formData.utrNumber,
        jerseyName: formData.jerseyName,
        jerseyNumber: formData.jerseyNumber,
        jerseySize: formData.jerseySize || 'S',
        lowerSize: formData.lowerSize,
        wicketKeeping: formData.wicketKeeping || 'No',
        submissionDate: formData.submissionDate || new Date(),
        submissionPlace: formData.submissionPlace,
        signatureName: formData.signatureName,
        declarationAccepted: formData.declarationAccepted
      };

      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      console.log("Final Payload being sent:", payload);
      await axios.post(`${baseUrl}/api/register`, payload);

      toast.success("Registration Successful!");
      setFormData(initialFormState); // Reset form data to initial state

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (receiptInputRef.current) { // Reset receipt input
        receiptInputRef.current.value = '';
      }


    } catch (err) {
      console.error("Submission Error Details:", err.response?.data);

      // Check if the backend sent specific validation errors
      if (err.response?.data?.error) {
        // This shows the exact message (e.g., "jerseySize is required")
        toast.error(`Error: ${err.response.data.error}`);
      } else if (err.response?.data?.details) {
        // Handle Mongoose validation messages
        toast.error(`Missing or Invalid Info: ${err.response.data.details}`);
      } else {
        toast.error("Registration failed. Please check your internet or contact support.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-start"
      style={{
        backgroundImage: `url(${bgimage})`,
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#f5f5f5",


      }}
    >
      <div className="max-w-3xl w-full p-8  bg-white shadow-2xl space-y-8">
        <div className="border-b-4 border-red-900 pb-4">
          <div className="hidden md:flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-red-900">
                JAIN YOUTH CRICKET CUP
              </h1>
              <h2 className="text-2xl font-bold mt-2">
                OFFICIAL PLAYER REGISTRATION FORM
              </h2>
            </div>

            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>

          <div className="md:hidden text-center">
            <h1 className="text-2xl font-black text-red-900">
              JAIN YOUTH CRICKET CUP
            </h1>
            <h2 className="text-lg font-bold mt-2">
              OFFICIAL PLAYER REGISTRATION FORM
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-4">
              <h2 className="text-xl font-bold border-b-2 border-red-900">PERSONAL DETAILS</h2>
              <input name="fullName" value={formData.fullName} placeholder="FULL NAME" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" required />

              <div className="flex flex-col gap-2">
                <label className="font-bold">PROFESSION:</label>
                <div className="flex gap-4 ">
                  {['Business', 'Salaried', 'Self Employed'].map(p => (
                    <label key={p} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input className="cursor-pointer" type="radio" name="profession" value={p} checked={formData.profession === p} onChange={handleInputChange} required />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <input
                type="text"
                name="mobileNumber"
                placeholder="MOBILE NUMBER"
                inputMode="numeric"
                pattern="\d{10}"
                maxLength="10"
                onChange={(e) => {
                  // Only allow numbers to be typed
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange({ target: { name: 'mobileNumber', value } });
                }}
                value={formData.mobileNumber}
                className="w-full border-b border-gray-400 p-2"
                required
              />
              <input
                type="text"
                name="whatsappNumber"
                placeholder="WHATSAPP NUMBER"
                inputMode="numeric"
                pattern="\d{10}"
                maxLength="10"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange({ target: { name: 'whatsappNumber', value } });
                }}
                value={formData.whatsappNumber}
                className="w-full border-b border-gray-400 p-2"
              />
              <input name="emailId" type="email" value={formData.emailId} placeholder="EMAIL ID" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" required />
              <input name="residentialAddress" value={formData.residentialAddress} placeholder="RESIDENTIAL ADDRESS" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
              <input
                type="text"
                name="aadharNumber"
                placeholder="AADHAR NUMBER"
                inputMode="numeric"
                pattern="\d{12}"
                maxLength="12"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange({ target: { name: 'aadharNumber', value } });
                }}
                value={formData.aadharNumber}
                className="w-full border-b border-gray-400 p-2"
                required
              />
              {/* UTR NUMBER AND RECEIPT UPLOAD (Side-by-side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input name="utrNumber" placeholder="UTR NUMBER" value={formData.utrNumber} onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />

                <div className="md:col-span-1">
                  {/* Clickable UTR Receipt Preview */}
                  <div
                    onClick={() => receiptInputRef.current.click()}
                    className="w-full h-12 border-2 border-dashed border-gray-400 flex items-center justify-center text-center text-[10px] overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                  >
                    {formData.utrReceiptPreview ? (
                      <p className="text-gray-700 font-bold p-1">File Uploaded: {formData.utrReceipt.name}</p>
                    ) : (
                      <p className="text-gray-500 font-bold p-1">UPLOAD PAYMENT RECEIPT</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    ref={receiptInputRef}
                    onChange={handleUtrReceiptChange}
                    className="hidden"
                  />
                </div>
              </div>


              <div className="space-y-4 mt-6">
                <h2 className=" font-bold border-b-2 border-red-900">KIT DETAILS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="jerseyName" value={formData.jerseyName} placeholder="JERSEY NAME" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
                  <input name="jerseyNumber" type="number" value={formData.jerseyNumber} placeholder="JERSEY NO." onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />

                  <div>
                    <label className="text-xs font-bold text-gray-500">JERSEY SIZE:</label>
                    <select name="jerseySize" value={formData.jerseySize} onChange={handleInputChange} className="w-full border-b border-gray-400 p-2 bg-transparent">
                      {['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 ">LOWER SIZE:</label>
                    <input
                      type="text"
                      name="lowerSize"
                      placeholder="e.g. 30"
                      maxLength="2"
                      value={formData.lowerSize}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, "");
                        handleInputChange({ target: { name: 'lowerSize', value } });
                      }}
                      className="w-full border-b border-gray-400 p-2 bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* UPDATED PHOTO UPLOAD SECTION */}
            <div className="md:col-span-1">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-32 h-40 border-2 border-dashed border-red-900 flex items-center justify-center text-center text-[10px] overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
              >
                {formData.photoPreview ? (
                  <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <p className="p-2">CLICK TO UPLOAD PASSPORT PHOTO</p>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
            </div>
          </div>

          {/* UPDATED PLAYER SKILL SET */}
          <div className="border border-gray-300 p-4 mt-6">
            <h3 className="font-bold bg-red-900 text-white p-2">PLAYER SKILL SET</h3>
            <table className="w-full mt-4 text-left">
              <thead>
                <tr>
                  <th className="text-sm">SKILL</th>
                  <th className="text-sm">RIGHT HAND</th>
                  <th className="text-sm">LEFT HAND</th>
                </tr>
              </thead>
              <tbody>
                {['Batting', 'Bowling'].map(skill => (
                  <tr key={skill}>
                    <td className="text-sm">{skill}</td>
                    <td><input value={formData.battingSkill} type="radio" name={`${skill.toLowerCase()}Skill`} value="Right Hand" onChange={handleInputChange} /></td>
                    <td><input value={formData.bowlingSkill} type="radio" name={`${skill.toLowerCase()}Skill`} value="Left Hand" onChange={handleInputChange} /></td>
                  </tr>
                ))}

                {/* Wicket Keeping Row - Checkbox & Matching Font Size */}
                <tr>
                  <td className="text-sm">Wicket Keeping</td>
                  <td colSpan="2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        name="wicketKeeping"
                        checked={formData.wicketKeeping === 'Yes'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          wicketKeeping: e.target.checked ? 'Yes' : 'No'
                        }))}
                      />
                      Yes
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
            <input name="fieldingPreference" placeholder="Fielding Preference / Position" onChange={handleInputChange} className="w-full mt-4 border-b border-gray-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b-2 border-red-900">DIGITAL & SOCIAL PROFILES</h2>
            <input name="cricheroesId" value={formData.cricheroesId} placeholder="CRICHEROES ID" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
            <input name="instagramId" value={formData.instagramId} placeholder="INSTAGRAM ID" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />

            <div className="space-y-4 border border-gray-300 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold border-b-2 border-red-900 text-red-900 pb-2">DECLARATION</h2>

              <ul className="list-disc list-outside ml-5 text-sm space-y-2 text-gray-700">
                <li>I hereby declare that all the information provided by me in this registration form is true and correct to the best of my knowledge.</li>
                <li>I agree to abide by all the rules, regulations, and decisions of the organizers of the <strong>JAIN YOUTH CRICKET CUP</strong>.</li>
                <li>I understand that any false information or misconduct may result in the cancellation of my registration or participation in the tournament.</li>
                <li>I further agree that the organizers reserve the right to amend the tournament schedule, rules, regulations, fixtures, and event format whenever necessary in the interest of the tournament.</li>
              </ul>

              {/* Required Agreement Checkbox */}
              <label className="flex items-start gap-2 text-sm font-bold pt-4">
                <input
                  type="checkbox"
                  name="declarationAccepted"
                  onChange={handleInputChange}
                  required
                  className="mt-1 cursor-pointer"
                  value={formData.declarationAccepted}

                />
                I have read the declaration above and I agree to all the terms and conditions mentioned.
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <input name="signatureName" value={formData.submissionDate} placeholder="NAME (Signature)" onChange={handleInputChange} className="border-b border-gray-400 p-2" required />
              <input name="submissionDate" value={formData.submissionDate} type="date" onChange={handleInputChange} className="border-b border-gray-400 p-2" required />
              <input name="submissionPlace" value={formData.submissionPlace} placeholder="PLACE" onChange={handleInputChange} className="border-b border-gray-400 p-2" required />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting} // Prevents double-submission
            className={`w-full py-4 font-bold transition cursor-pointer flex items-center justify-center ${submitting ? 'bg-gray-600' : 'bg-red-900 hover:bg-black'
              } text-white`}
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                {/* Simple Tailwind Spinner */}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              </div>
            ) : (
              "SUBMIT APPLICATION"
            )}
          </button>
        </form>

        <div className="md:hidden mt-2 flex justify-end">
          <img
            src={logo}
            alt="Company Logo"
            className="w-20 object-contain"
          />
        </div>


      </div>


    </div>
  );
};

export default RegistrationForm;