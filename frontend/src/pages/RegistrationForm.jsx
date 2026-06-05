import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegistrationForm = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: '', profession: '', photo: null, photoPreview: null, mobileNumber: '', 
    whatsappNumber: '', emailId: '', residentialAddress: '', aadharNumber: '', 
    paymentMethod: '', battingSkill: 'None', bowlingSkill: 'None', fieldingPreference: '',
    cricheroesId: '', instagramId: '', declarationAccepted: false,
    signatureName: '', submissionDate: '', submissionPlace: ''
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
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const payload = {
        ...formData,
        photo: photoBase64, 
        skills: {
          batting: formData.battingSkill,
          bowling: formData.bowlingSkill,
          fieldingPreference: formData.fieldingPreference
        },
        aadharNumber: formData.aadharNumber,
        submissionDate: formData.submissionDate || new Date()
      };

      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.post(`${baseUrl}/api/register`, payload);
      
      toast.success("Registration Successful!");

setFormData({
  fullName: '',
  profession: '',
  photo: null,
  photoPreview: null,
  mobileNumber: '',
  whatsappNumber: '',
  emailId: '',
  residentialAddress: '',
  aadharNumber: '',
  paymentMethod: '',
  battingSkill: 'None',
  bowlingSkill: 'None',
  fieldingPreference: '',
  cricheroesId: '',
  instagramId: '',
  declarationAccepted: false,
  signatureName: '',
  submissionDate: '',
  submissionPlace: ''
});

if (fileInputRef.current) {
  fileInputRef.current.value = '';
}

setTimeout(() => {
  window.location.reload();
}, 1500);
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err);
      toast.error("Submission failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg space-y-8">
      <div className="text-center border-b-4 border-red-900 pb-4">
        <h1 className="text-3xl font-black text-red-900">JAIN YOUTH CRICKET CUP</h1>
        <h2 className="text-xl font-bold mt-2">OFFICIAL PLAYER REGISTRATION FORM</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-xl font-bold border-b-2 border-red-900">PERSONAL DETAILS</h2>
            <input name="fullName" placeholder="FULL NAME" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" required />
            
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

            <input name="mobileNumber" placeholder="MOBILE NUMBER" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" required />
            <input name="whatsappNumber" placeholder="WHATSAPP NUMBER" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
            <input name="emailId" type="email" placeholder="EMAIL ID" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" required />
            <input name="residentialAddress" placeholder="RESIDENTIAL ADDRESS" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
            <input name="aadharNumber" placeholder="AADHAR NUMBER" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" required />
            <input name="paymentMethod" placeholder="PAYMENT METHOD (UPI / CASH / ETC)" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
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

        <div className="border border-gray-300 p-4">
          <h3 className="font-bold bg-red-900 text-white p-2">PLAYER SKILL SET</h3>
          <table className="w-full mt-4 text-left">
            <thead><tr><th>SKILL</th><th>RIGHT HAND</th><th>LEFT HAND</th></tr></thead>
            <tbody>
              {['Batting', 'Bowling'].map(skill => (
                <tr key={skill}>
                  <td>{skill}</td>
                  <td><input className="cursor-pointer" type="radio" name={`${skill.toLowerCase()}Skill`} value="Right Hand" onChange={handleInputChange} /></td>
                  <td><input className="cursor-pointer" type="radio" name={`${skill.toLowerCase()}Skill`} value="Left Hand" onChange={handleInputChange} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <input name="fieldingPreference" placeholder="Fielding Preference / Position" onChange={handleInputChange} className="w-full mt-4 border-b border-gray-400" />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b-2 border-red-900">DIGITAL & SOCIAL PROFILES</h2>
          <input name="cricheroesId" placeholder="CRICHEROES ID" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
          <input name="instagramId" placeholder="INSTAGRAM ID" onChange={handleInputChange} className="w-full border-b border-gray-400 p-2" />
          
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
    />
    I have read the declaration above and I agree to all the terms and conditions mentioned.
  </label>
</div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <input name="signatureName" placeholder="NAME (Signature)" onChange={handleInputChange} className="border-b border-gray-400 p-2" required />
            <input name="submissionDate" type="date" onChange={handleInputChange} className="border-b border-gray-400 p-2" required />
            <input  name="submissionPlace" placeholder="PLACE" onChange={handleInputChange} className="border-b border-gray-400 p-2" required />
          </div>
        </div>

        <button type="submit" className="w-full bg-red-900 text-white py-4 font-bold hover:bg-black transition cursor-pointer">
          SUBMIT APPLICATION
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;