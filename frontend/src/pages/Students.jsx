import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { getStudents } from '../services/api'
import Loading from '../components/Loading'

export default function Students() {
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents().then(r => setStudents(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    `${s.studentName} ${s.email} ${s.course}`.toLowerCase().includes(query.toLowerCase())
  )

  if (loading) return <Loading text="Loading students..." />

  return (
    <div className="card">
      <div className="section-heading">
        <div><h3>Students</h3><p>Manage student profiles used for performance analysis.</p></div>
        <Link className="btn primary" to="/students/new"><Plus size={17}/> Add Student</Link>
      </div>
      <div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, email or course..." /></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Email</th><th>Course</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.studentId}>
                <td><strong>{s.studentName}</strong></td>
                <td>{s.email}</td>
                <td>{s.course}</td>
                <td><span className="pill low">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No students found.</div>}
      </div>
    </div>
  )
}
