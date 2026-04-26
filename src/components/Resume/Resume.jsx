import React, { useEffect, useState } from 'react'
import { toast, ToastContainer} from 'react-toastify'
import { handleError, handleLoading, handleSuccess} from '../../utils';
import './resume.css'
import Header from '../Header/Header';

export default function Resume() {
  const [resumeTextInfo , setresumeTextInfo] = useState({
    resumeText : '',
  })
  const [ loading , setloading] = useState(false);
  const [result, setResult] = useState(null);

useEffect(() => {
  // Page load par current state push
  window.history.pushState(null, "", window.location.href);

  const blockNavigation = () => {
    window.history.pushState(null, "", window.location.href);
  };

  // Back & Forward arrows block
  window.addEventListener("popstate", blockNavigation);

  return () => {
    window.removeEventListener("popstate", blockNavigation);
  };
}, []);

  const name = localStorage.getItem("LoggedInUserName")
 
  const handleChange = (e)=>{
    const {name , value} = e.target;
    console.log(name , value);
    const copyResumeText = {...resumeTextInfo};
     copyResumeText[name] = value;
    setresumeTextInfo(copyResumeText)
  }
  console.log("Resume Text " , resumeTextInfo)

  useEffect(()=>{
    const fetchSavedResume = async()=>{
      const token = localStorage.getItem('Token');
      if(!token) return;
      try {
         const REACT_APP_API_URL = `http://localhost:5000/user/resume/get`
        const res = await fetch(REACT_APP_API_URL , {
          method : "GET",
           headers: { "Authorization": `Bearer ${token}` }
        })
        const data = await res.json();
        if(data.success && data.data){
          setResult(data.data)
          setresumeTextInfo({
            resumeText: data.data.originalText // TEXTAREA AUTO-FILL
          });
        }
      } catch (error) {
        console.log("Error fetching saved result", error)
      }
    }
    fetchSavedResume();
  } , [])
 
  const handleCopyResume = () => {
    if(result && result.correctedText) {
      navigator.clipboard.writeText(result.correctedText);
      handleSuccess('"Corrected resume copied to clipboard! ✓"')
    }
  }

  const handleResume = async (e)=>{
    const token = localStorage.getItem("Token")
    e.preventDefault();
    const {resumeText} = resumeTextInfo;
    if(!resumeText){
      return handleError("Enter your resume details")
    }
    try {
      setloading(true);
      const LoadingToast = handleLoading("Analyzing your resume... ⏳") 
       const REACT_APP_API_URL = `http://localhost:5000/user/resume/analyze`
      const response = await fetch(REACT_APP_API_URL,{
        method : "POST",
        headers : {'Content-Type' : 'application/json' , "Authorization": `Bearer ${token}`, },
        
        body : JSON.stringify(resumeTextInfo)
      })
      const result = await response.json();
      console.log(result)
      const { success , error} = result;
      if(success === true){
        toast.update(LoadingToast, {
        render: "Resume analyzed successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose : 100,
      });
      setResult(result.final)
      setloading(false);
      }
      if(success === false){
         toast.update(LoadingToast, {
        render: error,
        isLoading: false,
        autoClose : 100,
      });
      setloading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header />
      <div className='resume-page'>
        <div className="resume-container glass-card">
          <div className="resume-header">
            <h1>AI Resume Architect</h1>
            <p>Welcome back, {name}. Paste your resume details below to get started.</p>
          </div>

          <form className="resume-form" onSubmit={handleResume}>
            <div className="textarea-container">
              <textarea
                className="resume-textarea"
                onChange={handleChange}
                name="resumeText"
                placeholder="Paste your raw resume text here..."
                value={resumeTextInfo.resumeText}
              ></textarea>
            </div>

            <button className="btn-primary analyze-btn" type='submit' disabled={loading}>
              {loading ? "Processing..." : "Analyze Resume"}
            </button>
          </form>

          {result && (
            <div className="result-section">
              <div className="result-grid">
                <div className="score-card glass-card">
                  <span className="score-value">{result.score}</span>
                  <span className="score-label">Overall Score</span>
                </div>
                <div className="score-card glass-card">
                  <span className="score-value">{result.atsScore}</span>
                  <span className="score-label">ATS Compatibility</span>
                </div>
              </div>

              <div className="suggestions-card glass-card">
                <h3>💡 Improvement Suggestions</h3>
                <ul className="suggestion-list">
                  {result.suggestions?.map((s, i) => (
                    <li key={i} className="suggestion-item">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="corrected-box">
                <h3>✨ Refined Content</h3>
                <pre className="corrected-text">{result.correctedText}</pre>
                <button type="button" className="copy-btn" onClick={handleCopyResume}>
                  Copy Content
                </button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}