import React, { useState } from "react";
import { handleLoading, } from '../../utils';
import { toast, ToastContainer} from 'react-toastify'


export default function AddJob({ reload }) {
  const [ loading , setloading] = useState(false)
  const [job, setJob] = useState({
    company: "",
    position: "",
    jobDescription: "",
    status: "Applied",
    notes: "",
  });

  const token = localStorage.getItem("Token");

  const submitJob = async () => {
    const { company, position, jobDescription } = job;

    if (!company || !position || !jobDescription) {
      alert("All required fields fill karo");
      return;
    }
      const LoadingToast = handleLoading("Adding your job..... ⏳") 
       const REACT_APP_API_URL = `https://ai-resume-analyzer-backend-eight.vercel.app/user/add/job`
      const res = await fetch(REACT_APP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });
  
      const data = await res.json();
      const {success , message , error} = data;
      if(success === true){
        toast.update(LoadingToast ,{
          render :message,
          isLoading : false,
          autoClose : 100,
          type : success,
        })
        setloading(false)
        console.log("JOB ADDED:", data);
        window.location.reload();
      }
      if(success === false){
        toast.update(LoadingToast , {
          render : error || message,
          type: "error",
          isLoading : false,
          autoClose: 3000,
        })
        setloading(false)
      }
  }

  return (
    <div className="add-job-container">
      <h2>Add New Job</h2>
      <form className="job-form" onSubmit={(e) => e.preventDefault()}>
        <div className="job-form-group">
          <label>Company</label>
          <input 
            placeholder="e.g. Google"
            onChange={(e) => setJob({ ...job, company: e.target.value })} 
          />
        </div>

        <div className="job-form-group">
          <label>Position</label>
          <input 
            placeholder="e.g. Frontend Developer"
            onChange={(e) => setJob({ ...job, position: e.target.value })} 
          />
        </div>

        <div className="job-form-group">
          <label>Description</label>
          <textarea 
            placeholder="Paste job description here..."
            onChange={(e) => setJob({ ...job, jobDescription: e.target.value })} 
          />
        </div>

        <div className="job-form-group">
          <label>Status</label>
          <select onChange={(e) => setJob({ ...job, status: e.target.value })}>
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Rejected</option>
            <option>Offered</option>
          </select>
        </div>

        <div className="job-form-group">
          <label>Notes (Optional)</label>
          <textarea 
            placeholder="Any extra details..."
            onChange={(e) => setJob({ ...job, notes: e.target.value })} 
          />
        </div>

        <button className="btn-primary add-btn" onClick={submitJob} disabled={loading}>
          {loading ? 'Adding...' : 'Add Job Application'}
        </button>
      </form>
    </div>
  );
}
