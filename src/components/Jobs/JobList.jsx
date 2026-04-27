import React, {  useState , useEffect} from "react";
  
export default function JobList({ reload }) {
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  // const [ loading , setloading] = useState(false);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem("Token");

  const loadJobs = async () => {
     const REACT_APP_API_URL = `https://ai-resume-analyzer-backend-eight.vercel.app/user/add/job`
    const res = await fetch(REACT_APP_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setJobs(Array.isArray(data.job) ? data.job : []);
  };

  useEffect(() => {
  loadJobs();
}, [loadJobs]); // ✅ correct


// loadJobs()
  // DELETE
  const deleteJob = async (id) => {
    const REACT_APP_API_URL = `https://ai-resume-analyzer-backend-eight.vercel.app/user/add/job/${id}`
    await fetch(REACT_APP_API_URL, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadJobs();
  };

  // START EDIT
  const startEdit = (job) => {
    setEditId(job._id);
    setEditForm(job);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    const REACT_APP_API_URL = `https://ai-resume-analyzer-backend-eight.vercel.app/user/add/job/${editId}`
    await fetch(REACT_APP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });

    setEditId(null);
    loadJobs();
  };

  return (
    <div className="jobs-table-container">
      <div className="job-list-header">
        <h2>Your Applications</h2>
        <span className="text-muted">{jobs.length} Jobs Tracked</span>
      </div>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Company & Position</th>
            <th>Status</th>
            <th>AI Match</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="job-row">
              {editId === job._id ? (
                <>
                  <td colSpan="3">
                    <div className="job-form">
                      <input
                        value={editForm.company || ""}
                        placeholder="Company"
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      />
                      <input
                        value={editForm.position || ""}
                        placeholder="Position"
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      />
                      <select
                        value={editForm.status || "Applied"}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        <option>Applied</option>
                        <option>Interviewing</option>
                        <option>Rejected</option>
                        <option>Offered</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-primary" onClick={saveEdit}>Save</button>
                      <button className="copy-btn" onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <div className="company-name">{job.company}</div>
                    <div className="position-title">{job.position}</div>
                  </td>
                  <td>
                    <span className={`status-badge status-${job.status?.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span className="match-percentage">{job.matchPercentage}%</span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn" title="Edit" onClick={() => startEdit(job)}>
                        ✎
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => deleteJob(job._id)}>
                        ✕
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
