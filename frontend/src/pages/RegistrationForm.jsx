import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { FaUpload } from 'react-icons/fa';
// import bgimage from '../assets/bgimage.jpeg';
import bgimg1 from '../assets/bgimg1.jpg';
import bgimg2 from '../assets/bgimg2.jpg';
import Navbar from '../components/Navbar';

const initialFormState = {
  // Personal Details
  fullName: '',
  profession: '',
  dob: '',
  gender: '',
  whatsappNumber: '', 
  emailId: '', 
  residentialAddress: '', 
  aadharNumber: '', 
  city: '', 
  district: '', 
  state: '', 
  pinCode: '',
  photo: null, 
  photoPreview: null,
  
  // Kit Details
  jerseyName: '', 
  jerseyNumber: '', 
  jerseySize: 'S', 
  lowerSize: '',
  
  // About Your Game
  bowlingArm: '', 
  bowlingPace: '', 
  wicketKeeping: '', 
  battingSkill: '', 
  fieldingPreference: '',
  
  // Digital/Social
  cricheroesId: '', 
  instagramId: '',
  
  // Payment
  payment: '', 
  utrReceipt: null, 
  utrReceiptPreview: null,
  
  // Declaration
  declarationAccepted: false, 
  signatureName: '', 
  submissionDate: '', 
  submissionPlace: ''
};

const RegistrationForm = () => {
  const fileInputRef = useRef(null);
  const receiptInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '', 
    profession: '', 
    dob: '', 
    gender: '', 
    whatsappNumber: '',
    emailId: '', 
    residentialAddress: '', 
    aadharNumber: '', 
    city: '', 
    district: '', 
    state: '', 
    pinCode: '',
    photo: null, 
    photoPreview: null,

    // Kit Details
    jerseyName: '', 
    jerseyNumber: '', 
    jerseySize: 'S', 
    lowerSize: '',

    // About Your Game
    bowlingArm: '', 
    bowlingPace: '', 
    wicketKeeping: '', 
    battingSkill: '', 
    fieldingPreference: '',

    // Digital/Social
    cricheroesId: '', 
    instagramId: '',

    // Payment
    payment: '', 
    utrReceipt: null, 
    utrReceiptPreview: null,

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
 
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log("Submit button clicked!");
    if (submitting) {
      console.log("Already submitting, blocking extra clicks.");
      return;} // Prevent double submission

    // ONLY require the receipt if the payment method is UPI
  if (formData.payment === 'UPI' && !formData.utrReceipt) {
    toast.error("Please upload your payment receipt for UPI transactions.");
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
  mobileNumber: formData.whatsappNumber,
  photo: photoBase64,
  utrReceipt: utrReceiptBase64,
  dob: formData.dob,
  gender: formData.gender,
  city: formData.city,
  district: formData.district,
  state: formData.state,
  pinCode: formData.pinCode,
  paymentMethod: formData.payment, // Renamed for backend clarity

  // Skills & Game Logic
 skills: {
  batting: formData.battingSkill,
  bowlingArm: formData.bowlingArm,
  bowlingPace: formData.bowlingPace,
  fieldingPreference: formData.fieldingPreference,
  fieldingDetails: formData.fieldingDetails // Added this
},

  aadharNumber: formData.aadharNumber, 
  
  // Kit & Legal
  utrNumber: formData.utrNumber,
  jerseyName: formData.jerseyName,
  jerseyNumber: formData.jerseyNumber,
  jerseySize: formData.jerseySize || 'S',
  lowerSize: formData.lowerSize,
  wicketKeeping: formData.wicketKeeping || 'No',
  
  submissionDate: formData.submissionDate || new Date().toISOString().split('T')[0],
  submissionPlace: formData.submissionPlace,
  signatureName: formData.signatureName,
  declarationAccepted: formData.declarationAccepted
};

      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
   console.log(payload)
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

  const inputClass = "w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-900 outline-none";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1";
  const sectionHeaderClass = "text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-6 mt-8";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
     {/* Navbar */}
     <Navbar/>

      <div className="bg-white p-8 rounded-lg  max-w-6xl mx-auto my-8">
        <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center">Personal Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">


          {/* Image Upload Section */}
          <div className="md:row-span-2 flex flex-col items-center justify-center md:hidden">
            <label className="block text-gray-700 mb-2 w-full text-left">
              Passport Photo:<span className="text-red-500">*</span>
            </label>

            <div className="relative w-40 h-48 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center transition text-center p-2 text-xs text-gray-500">
              {formData.photoPreview ? (
                <>
                  {/* The Uploaded Image */}
                  <img src={formData.photoPreview} className="w-full h-full object-cover" />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, photo: null, photoPreview: null }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-800"
                  >
                    ×
                  </button>
                </>
              ) : (
                /* Upload Placeholder */
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-500"
                >
                  <span className="mb-2 font-bold">CLICK TO UPLOAD</span>
                  <span className="text-[10px] italic text-gray-400">Please upload a high-quality, clear passport-sized image.</span>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
          </div>
          {/* Player Name */}
          <div>
            <label className="block text-gray-700 mb-2">Player Name:<span className="text-red-500">*</span></label>
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Player's Name" required />
          </div>

          {/* Date of Birth */}
         <div>
  <label className="block text-gray-700 mb-2 font-bold">
    Date Of Birth:<span className="text-red-500">*</span>
  </label>
  <input 
    type="date" 
    name="dob" 
    // This value must be YYYY-MM-DD or empty string
    value={formData.dob} 
    // max="today" prevents picking future dates
    max={today}
    onChange={handleInputChange} 
    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-900 outline-none" 
    required 
  />
  </div>

          {/* Image Upload Section */}
          <div className="md:row-span-2 flex flex-col items-center justify-center hidden md:block">
            <label className="block text-gray-700 mb-2 w-full text-left">
              Passport Photo:<span className="text-red-500">*</span>
            </label>

            <div className="relative w-40 h-48 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center transition text-center p-2 text-xs text-gray-500">
              {formData.photoPreview ? (
                <>
                  {/* The Uploaded Image */}
                  <img src={formData.photoPreview} className="w-full h-full object-cover" />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, photo: null, photoPreview: null }));
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-800"
                  >
                    ×
                  </button>
                </>
              ) : (
                /* Upload Placeholder */
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-500"
                >
                  <span className="mb-2 font-bold">CLICK TO UPLOAD</span>
                  <span className="text-[10px] italic text-gray-400">Please upload a high-quality, clear passport-sized image.</span>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-2">Gender:<span className="text-red-500">*</span></label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>



          {/* Profession */}
          <div>
            <label className="block text-gray-700 mb-2">Profession:<span className="text-red-500">*</span></label>
            <select name="profession" value={formData.profession} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" required>
              <option value="">Select Profession</option>
              <option value="Business">Business</option>
              <option value="Salaried">Salaried</option>
              <option value="Self Employed">Self Employed</option>
            </select>
          </div>


          {/* WhatsApp */}
          <div>
            <label className="block text-gray-700 mb-2">WhatsApp Number:<span className="text-red-500">*</span></label>
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
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
              />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email Id:<span className="text-red-500">*</span></label>
            <input name="emailId" type="email" value={formData.emailId} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Email" required />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-gray-700 mb-2">Aadhaar Number:<span className="text-red-500">*</span></label>
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
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none2"
                required
              />
          </div>

          {/* Address Fields */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Residential Address:<span className="text-red-500">*</span></label>
            <textarea name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" rows="2" placeholder="Enter Residential Address" required></textarea>
          </div>

          {/* District, State, Pin */}
          <div>
            <label className="block text-gray-700 mb-2">District:<span className="text-red-500">*</span></label>
            <input name="district" value={formData.district} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter District" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">State:<span className="text-red-500">*</span></label>
            <input name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter State" required />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Pin code:<span className="text-red-500">*</span></label>
            <input
  type="text"
  name="pinCode"
  placeholder="Enter Pin Code"
  inputMode="numeric"
  pattern="\d{6}"
  maxLength="6"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleInputChange({ target: { name: "pinCode", value } });
  }}
  value={formData.pinCode}
  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
  required
/>
          </div>
        </div>


        {/* KIT DETAILS SECTION */}

        <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center  my-8">Kit Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">

          {/* Jersey Name */}
          <div>
            <label className="block text-gray-700 mb-2">Jersey Name:</label>
            <input
              name="jerseyName"
              value={formData.jerseyName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
              placeholder="Enter Name on Jersey"
            />
          </div>

          {/* Jersey Number */}
          <div>
            <label className="block text-gray-700 mb-2">Jersey Number:</label>
            <input
              name="jerseyNumber"
              type="number"
              value={formData.jerseyNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
              placeholder="Enter Number"
            />
          </div>

          {/* Jersey Size Dropdown */}
          <div>
            <label className="block text-gray-700 mb-2">Jersey Size:</label>
            <select
              name="jerseySize"
              value={formData.jerseySize}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
              <option value="XXXXL">XXXXL</option>
            </select>
          </div>

          {/* Lower Size Input */}
          <div>
            <label className="block text-gray-700 mb-2">Lower Size:</label>
            <input
              name="lowerSize"
              type="text"
              value={formData.lowerSize}
              maxLength="2"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                handleInputChange({ target: { name: 'lowerSize', value } });
              }}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
              placeholder="e.g. 30"
            />
          </div>
        </div>
       {/* ABOUT YOUR GAME SECTION */}

  <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center my-8">About Your Game</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
    
    {/* Bowling Arm */}
    <div>
      <label className="block text-gray-700 mb-2">Bowling Arm:<span className="text-red-500">*</span></label>
      <select name="bowlingArm" value={formData.bowlingArm} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" required>
        <option value="">Select Bowling Arm</option>
        <option value="Right Hand">Right Hand</option>
        <option value="Left Hand">Left Hand</option>
      </select>
    </div>

    {/* Bowling Pace */}
    <div>
      <label className="block text-gray-700 mb-2">Bowling Pace:<span className="text-red-500">*</span></label>
      <select name="bowlingPace" value={formData.bowlingPace} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" required>
        <option value="">Select Pace</option>
        <option value="Med Pace">Med Pace</option>
        <option value="Off Spinner">Off Spinner</option>
        <option value="Leg Spinner">Leg Spinner</option>
      </select>
    </div>

    {/* Wicket Keeper */}
    <div>
      <label className="block text-gray-700 mb-2">Wicket Keeper:<span className="text-red-500">*</span></label>
      <select
  name="wicketKeeping"
  value={formData.wicketKeeping}
  onChange={handleInputChange}
  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
  required
>
  <option value="">Select Option</option>
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>
    </div>

    {/* Batting */}
    <div>
      <label className="block text-gray-700 mb-2">Batting:<span className="text-red-500">*</span></label>
      <select name="battingSkill" value={formData.battingSkill} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" required>
        <option value="">Select Option</option>
        <option value="Right Hand">Right Hand</option>
        <option value="Left Hand">Left Hand</option>
      </select>
    </div>

    {/* Fielding Preference */}
    <div>
      <label className="block text-gray-700 mb-2">Fielding Preference:<span className="text-red-500">*</span></label>
      <select name="fieldingPreference" value={formData.fieldingPreference} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" required>
        <option value="">Select Option</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>

    {/* Specify Preference (Only shows if Fielding Preference is Yes) */}
    {formData.fieldingPreference === 'Yes' && (
      <div>
        <label className="block text-gray-700 mb-2">Specify Preference:<span className="text-red-500">*</span></label>
        <input 
          name="fieldingDetails" 
          value={formData.fieldingDetails || ''} 
          onChange={handleInputChange} 
          className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" 
          placeholder="Enter your specific preference" 
          required
        />
      </div>
    )}

  </div>





        <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center my-12">Digital and Social Profiles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">



          <div>
            <label className="block text-gray-700 mb-2">CRICHEROES ID<span className="text-red-500">*</span></label>
            <input name="cricheroesId" value={formData.cricheroesId} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Cricheroes ID" required />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">INSTAGRAM ID</label>
            <input name="instagramId" value={formData.instagramId} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Instagram ID" required />
          </div>
        </div>

        <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center my-12">About Payment</h2>




        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-gray-700 mb-2">Payment Method:<span className="text-red-500">*</span></label>
            <select
              name="payment"
              value={formData.payment}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
              required
            >
              <option value="">Select Payment</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

         {/* Conditional Receipt Upload Section */}
{formData.payment === 'UPI' && (
  <div className="mt-4">
    <label className="block text-gray-700 mb-2">
      Upload Payment Receipt:<span className="text-red-500">*</span>
    </label>

    {formData.utrReceiptPreview ? (
      <div className="relative w-full h-32 border rounded overflow-hidden">
        <img src={formData.utrReceiptPreview} className="w-full h-full object-cover" alt="Receipt Preview" />
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, utrReceipt: null, utrReceiptPreview: null }))}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-800"
        >
          ×
        </button>
      </div>
    ) : (
      <div
        onClick={() => receiptInputRef.current.click()}
        className="w-full md:w-64 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition text-center p-4 text-gray-500"
      >
        <span>CLICK TO UPLOAD RECEIPT</span>
      </div>
    )}
    <input 
      type="file" 
      ref={receiptInputRef} 
      onChange={handleUtrReceiptChange} 
      className="hidden" 
      accept="image/*,application/pdf" 
    />
  </div>
)}
        </div>


        {/* DECLARATION SECTION */}
        <div className="max-w-6xl mx-auto my-8">
          <div className="border border-gray-200 rounded-lg p-8 bg-[#f9f9f9]">
            <h2 className="text-2xl font-normal text-gray-800 mb-6 border-b border-gray-300 pb-2">DECLARATION</h2>

            <ul className="list-disc list-outside ml-5 text-sm space-y-3 text-gray-700 mb-8">
              <li>I hereby declare that all the information provided by me in this registration form is true and correct to the best of my knowledge.</li>
              <li>I agree to abide by all the rules, regulations, and decisions of the organizers of the <strong>JAIN YOUTH CRICKET CUP</strong>.</li>
              <li>I understand that any false information or misconduct may result in the cancellation of my registration or participation in the tournament.</li>
              <li>I further agree that the organizers reserve the right to amend the tournament schedule, rules, regulations, fixtures, and event format whenever necessary in the interest of the tournament.</li>
            </ul>

            <label className="flex items-center gap-3 cursor-pointer font-bold text-red-600">
              <input
                type="checkbox"
                name="declarationAccepted"
                checked={formData.declarationAccepted}
                onChange={handleInputChange}
                required
                className="w-4 h-4"
              />
              I have read the declaration above and I agree to all the terms and conditions mentioned.
            </label>
          </div>

          {/* SIGNATURE & DATE SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <label className="block text-gray-700 mb-2">NAME (Signature):<span className="text-red-500">*</span></label>
              <input
                name="signatureName"
                value={formData.signatureName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
                placeholder="Enter Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">DATE:</label>
              <input
                type="date"
                name="submissionDate"
                // Use the state value if it exists, otherwise default to today
                value={formData.submissionDate || today}
                onChange={handleInputChange}
                readOnly
                className="w-full border border-gray-300 rounded p-2 bg-gray-200 text-gray-600 cursor-not-allowed outline-none"
              />
            </div>


            <div>
              <label className="block text-gray-600 mb-2">PLACE:<span className="text-red-500">*</span></label>
              <input
                name="submissionPlace"
                value={formData.submissionPlace}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
                placeholder="Enter Place"
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-10 bg-gradient-to-r from-[#020617] via-[#0A1F5C] to-[#1E3A8A] text-white py-4 font-bold text-lg hover:bg-black transition cursor-pointer"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
          </button>
        </div>



      </form>
       <div className="md:hidden mt-2 flex justify-end">
          <img
            src={logo}
            alt="Company Logo"
            className="w-30 object-contain"
          />
        </div>
      </div>

    
    </div>
  );
};

export default RegistrationForm;