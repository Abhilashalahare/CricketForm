import React, { useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import { FaUpload } from 'react-icons/fa';
// import bgimage from '../assets/bgimage.jpeg';
import bgimg1 from '../assets/bgimg1.jpg';
import bgimg2 from '../assets/bgimg2.jpg';
import Navbar from '../components/Navbar';
import qr from '../assets/qr.jpeg';
import GiftPopup from '../components/GiftPopup';


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
 playerType: '',
 hasBatting: '',
  hasBowling: '',           
  battingSkill: '',          
  bowlingSkill: '',        
  allRounderSkills: [],    
  wicketKeeping: '',
  
  // Digital/Social
  cricheroesId: '', 
  instagramId: '',
  
  // Payment
  paymentMethod: '', 
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


  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [giftInfo, setGiftInfo] = useState(null);

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
    playerType: '', // Tracks: 'Batting', 'Bowling', or 'All Rounder'

   hasBatting: '',
    hasBowling: '',
    battingSkill: '',             // For standard Batting selection
    bowlingSkill: '',             // For standard Bowling selection
    allRounderSkills: [],         // Array to hold multiple selections for All Rounder
    wicketKeeping: '', 
   

    // Digital/Social
    cricheroesId: '', 
    instagramId: '',

    // Payment
    paymentMethod: '', 
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

  setFormData((prev) => {
    // 1. Handle Multi-select Checkboxes (For All-Rounder Skills)
    if (name === 'allRounderSkills') {
      const currentSkills = prev.allRounderSkills || [];
      const updatedSkills = checked 
        ? [...currentSkills, value] 
        : currentSkills.filter(s => s !== value);
      return { ...prev, allRounderSkills: updatedSkills };
    }

    // 2. Handle Radio Buttons
    if (type === 'radio') {
      // If clicking the currently active one, reset it (Toggle off)
      if (prev[name] === value) {
        return { ...prev, [name]: '' };
      }
      
      // If switching to a new radio button, clear all other skill fields 
      // to ensure clean data for your Admin Panel
      return { 
        ...prev, 
        [name]: value,
        // Optional: clear other skill fields when switching modes
        battingSkill: name === 'playerType' && value !== 'Batting' ? '' : prev.battingSkill,
        bowlingSkill: name === 'playerType' && value !== 'Bowling' ? '' : prev.bowlingSkill,
        allRounderSkills: name === 'playerType' && value !== 'All Rounder' ? [] : prev.allRounderSkills
      };
    }

    // 3. Standard Field Update
    return {
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    };
  });
};


const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 1. Store the actual File object in state (for the FormData later)
  setFormData(prev => ({ 
    ...prev, 
    photo: file 
  }));

  // 2. Create a temporary URL for the preview (for the <img> tag)
  setFormData(prev => ({ 
    ...prev, 
    photoPreview: URL.createObjectURL(file) 
  }));
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
  setSubmitting(true);
  
  const dobRegex =
    /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

  if (!dobRegex.test(formData.dob)) {
    toast.error("Please enter a valid date in DD-MM-YYYY format");
    setSubmitting(false);
    return;
  }


  
  const form = new FormData();

  // 1. Append all flat fields from formData
  Object.keys(formData).forEach((key) => {
    if (key !== 'skills' && key !== 'photo' && key !== 'photoPreview' && 
        key !== 'utrReceipt' && key !== 'utrReceiptPreview') {
      form.append(key, formData[key]);
    }
  });

  form.append('skills[batting]', formData.battingSkill);
form.append('skills[bowling]', formData.bowlingSkill);
form.append('skills[allRounder]', JSON.stringify(formData.allRounderSkills));

  // 3. Append the files (using the actual File objects from state)
  if (formData.photo) form.append('photo', formData.photo);
  if (formData.utrReceipt) form.append('utrReceipt', formData.utrReceipt);

  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success("Registration Successful!");
    setFormData(initialFormState);
  } catch (error) {
    const errMsg = error.response?.data?.error || "Registration failed.";
    toast.error(errMsg);
  } finally {
    setSubmitting(false);
  }
};

const closeGiftPopup = () => {
    localStorage.setItem("giftPopupShown", "true");
    setShowGiftPopup(false);
  };

useEffect(() => {
  setFormData(prev => ({ ...prev, submissionDate: today }));
}, [today]);

useEffect(() => {
    const popupShown = localStorage.getItem("giftPopupShown");

    if (popupShown) return;

    const fetchGiftStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/gift-status`,
        );

        if (res.data.giftAvailable) {
          setGiftInfo(res.data);
          setShowGiftPopup(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchGiftStatus();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {showGiftPopup && giftInfo && (
        <GiftPopup giftInfo={giftInfo} onClose={closeGiftPopup} />
      )}

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
                      // Revoke the URL to free memory
                      if (formData.photoPreview) URL.revokeObjectURL(formData.photoPreview);
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

            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden"  accept="image/*,application/pdf" />
          </div>
          {/* Player Name */}
          <div>
            <label className="block text-gray-700 mb-2">Player Name:<span className="text-red-500">*</span></label>
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Player's Name" required />
          </div>

         
   {/* Date of Birth */}
<div>
  <label className="block text-gray-700 mb-2 font-bold">
    Date Of Birth (DD-MM-YYYY):<span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    name="dob"
    value={formData.dob}
    onChange={(e) => {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length > 2) {
        value = value.slice(0, 2) + "-" + value.slice(2);
      }

      if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5);
      }

      if (value.length > 10) {
        value = value.slice(0, 10);
      }

      handleInputChange({
        target: {
          name: "dob",
          value,
        },
      });
    }}
    placeholder="DD-MM-YYYY"
    maxLength={10}
    className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
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
                title="Aadhaar must be 12 digits"
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
    

{/* Batting Section */}
<div className="mb-4">
 <label
  className={`flex items-center gap-1 text-gray-700 ${
    formData.hasBowling === "Yes" ||
    formData.playerType === "All Rounder"
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer"
  }`}
>
    <input
      type="checkbox"
  checked={formData.hasBatting === "Yes"}
  disabled={
    formData.hasBowling === "Yes" ||
    formData.playerType === "All Rounder"}
      onChange={(e) =>
        handleInputChange({
          target: {
            name: "hasBatting",
            value: e.target.checked ? "Yes" : "No",
          },
        })
      }
      className="w-4 h-4"
    />
    Batting
  </label>

  {formData.hasBatting === "Yes" && (
    <div className="mt-2">
      <select
        name="battingSkill"
        value={formData.battingSkill}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
      
      >
        <option value="">Select Hand</option>
        <option value="Right Hand">Right Hand</option>
        <option value="Left Hand">Left Hand</option>
      </select>
    </div>
  )}
</div>

{/* Bowling Section */}
<div className="mb-4">
 <label
  className={`flex items-center gap-1 text-gray-700 ${
    formData.hasBatting === "Yes" ||
    formData.playerType === "All Rounder"
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer"
  }`}
>
    <input
       type="checkbox"
  checked={formData.hasBowling === "Yes"}
  disabled={
    formData.hasBatting === "Yes" ||
    formData.playerType === "All Rounder"
  }
      onChange={(e) =>
        handleInputChange({
          target: {
            name: "hasBowling",
            value: e.target.checked ? "Yes" : "No",
          },
        })
      }
      className="w-4 h-4"
    />
    Bowling
  </label>

  {formData.hasBowling === "Yes" && (
    <div className="mt-2">
      <select
        name="bowlingSkill"
        value={formData.bowlingSkill}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
        
      >
        <option value="">Select Bowling Type</option>
        <option value="Right Hand Fast">Right Hand Fast</option>
        <option value="Left Hand Fast">Left Hand Fast</option>
        <option value="Right Hand Spinner">Right Hand Spinner</option>
        <option value="Left Hand Spinner">Left Hand Spinner</option>
      </select>
    </div>
  )}
</div>

{/* All Rounder Section */}
<div className="mb-4">
 <label
  className={`flex items-center gap-1 text-gray-700 ${
    formData.hasBatting === "Yes" ||
    formData.hasBowling === "Yes"
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer"
  }`}
>
    <input
        type="checkbox"
  checked={formData.playerType === "All Rounder"}
  disabled={
    formData.hasBatting === "Yes" ||
    formData.hasBowling === "Yes"
  }
      onChange={(e) =>
        handleInputChange({
          target: {
            name: "playerType",
            value: e.target.checked ? "All Rounder" : "",
          },
        })
      }
      className="w-4 h-4"
    />
    All Rounder
  </label>

  {formData.playerType === "All Rounder" && (
    <div className="mt-3 p-4 border border-gray-300 rounded-lg">
      <p className="font-semibold mb-3">Select Your Skills</p>

      {/* Batting Skills */}
      <div className="mb-4">
        <h4 className="font-bold text-gray-700 mb-2">Batting</h4>

        {["Right Hand", "Left Hand"].map((skill) => (
          <label
            key={skill}
            className="flex items-center gap-2 mb-1 cursor-pointer"
          >
            <input
              type="checkbox"
              name="allRounderSkills"
              value={skill}
              checked={
                formData.allRounderSkills?.includes(skill) || false
              }
              onChange={handleInputChange}
            />
            {skill}
          </label>
        ))}
      </div>

      {/* Bowling Skills */}
      <div>
        <h4 className="font-bold text-gray-700 mb-2">Bowling</h4>

        {[
          "Right Hand Fast",
          "Left Hand Fast",
          "Right Hand Spinner",
          "Left Hand Spinner",
        ].map((skill) => (
          <label
            key={skill}
            className="flex items-center gap-2 mb-1 cursor-pointer"
          >
            <input
              type="checkbox"
              name="allRounderSkills"
              value={skill}
              checked={
                formData.allRounderSkills?.includes(skill) || false
              }
              onChange={handleInputChange}
            />
            {skill}
          </label>
        ))}
      </div>
    </div>
  )}
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

  

  </div>





        <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center my-12">Digital and Social Profiles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">



          <div>
            <label className="block text-gray-700 mb-2">CRICHEROES ID</label>
            <input name="cricheroesId" value={formData.cricheroesId} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Cricheroes ID" />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">INSTAGRAM ID</label>
            <input name="instagramId" value={formData.instagramId} onChange={handleInputChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none" placeholder="Enter Instagram ID" />
          </div>
        </div>

        <h2 className="text-2xl font-normal text-gray-700 mb-8 text-center my-12">About Payment</h2>




        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
  {/* Payment Method Selector */}
  <div>
    <label className="block text-gray-700 mb-2">
      Payment Method:<span className="text-red-500">*</span>
    </label>

    <select
      name="paymentMethod"
      value={formData.paymentMethod}
      onChange={handleInputChange}
      className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-gray-400 outline-none"
      required
    >
      <option value="">Select Payment</option>
      <option value="UPI">UPI</option>
      <option value="Cash">Cash</option>
    </select>
  </div>

  {/* Upload Receipt */}
  {formData.paymentMethod && (
    <div className="mt-4">
      <label className="block text-gray-700 mb-2">
        Upload Payment Receipt:
        <span className="text-red-500">*</span>
      </label>

      {formData.utrReceiptPreview ? (
        <div className="relative w-full h-32 border rounded overflow-hidden">
          <img
            src={formData.utrReceiptPreview}
            className="w-full h-full object-cover"
            alt="Receipt Preview"
          />

          <button
            type="button"
            onClick={() =>
              setFormData(prev => ({
                ...prev,
                utrReceipt: null,
                utrReceiptPreview: null,
              }))
            }
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-800"
          >
            ×
          </button>
        </div>
      ) : (
        <div
           onClick={() => receiptInputRef.current.click()}
          className="w-full md:w-64 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-500 transition text-center text-gray-500"
        >
          <span>UPLOAD RECEIPT</span>
        </div>
      )}

      {/* Single Input for BOTH UPI & Cash */}
      <input
  type="file"
  ref={receiptInputRef}
  onChange={handleUtrReceiptChange}
  className="hidden"
  accept="image/*,application/pdf"
/>
    </div>
  )}

  {/* QR Code */}
  <div>
    {formData.paymentMethod === "UPI" && (
      <div className="flex flex-col items-center">
        <label className="text-gray-700 mb-2">
          Scan QR Code
        </label>

        <img
          src={qr}
          alt="UPI QR"
          className="w-40 h-40 rounded-lg object-contain"
        />

        <p className="text-sm text-gray-500 mt-2">
          Scan and complete payment
        </p>
      </div>
    )}
  </div>
</div>


        {/* DECLARATION SECTION */}
        <div className="max-w-6xl mx-auto my-8">
          <div className="border border-gray-200 rounded-lg p-8 bg-[#f9f9f9]">
            <h2 className="text-2xl font-normal text-gray-800 mb-6 border-b border-gray-300 pb-2">घोषणा (DECLARATION)</h2>

            <ul className="list-disc list-outside ml-5 text-sm space-y-3 text-gray-700 mb-8">
              <li>मैं एतद्द्वारा घोषणा करता हूँ कि इस पंजीकरण फॉर्म में मेरे द्वारा दी गई सभी जानकारी मेरी सर्वोत्तम जानकारी के अनुसार सत्य और सही है।</li>
              <li>मैं जैन यूथ क्रिकेट कप (JAIN YOUTH CRICKET CUP) के आयोजकों के सभी नियमों, विनियमों और निर्णयों का पालन करने के लिए सहमत हूँ।</li>
              <li>मैं समझता हूँ कि कोई भी गलत जानकारी या दुर्व्यवहार के परिणामस्वरूप मेरा पंजीकरण रद्द किया जा सकता है या मुझे टूर्नामेंट से बाहर किया जा सकता है।</li>
              <li>मैं आगे यह भी सहमत हूँ कि आयोजकों के पास टूर्नामेंट के हित में आवश्यकतानुसार टूर्नामेंट की समय-सारिणी, नियमों, विनियमों, फिक्स्चर और इवेंट प्रारूप में संशोधन करने का अधिकार सुरक्षित है।</li>
            </ul>

            <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-red-600">
              <input
                type="checkbox"
                name="declarationAccepted"
                checked={formData.declarationAccepted}
                onChange={handleInputChange}
                required
                className="w-4 h-4"
              />
              मैंने ऊपर दी गई घोषणा को पढ़ लिया है और मैं उल्लेखित सभी नियमों और शर्तों से सहमत हूँ।
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