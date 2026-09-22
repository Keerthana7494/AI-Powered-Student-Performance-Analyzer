import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Trash2 } from 'lucide-react'
import { deletePerformance, getPerformance } from '../services/api'
import Modal from '../components/Modal'
import Loading from '../components/Loading'

export default function PerformanceList() {
  const [items,setItems]=useState([])
  const [query,setQuery]=useState('')
  const [risk,setRisk]=useState('ALL')
  const [loading,setLoading]=useState(true)
  const [deleteId,setDeleteId]=useState(null)

  const load=()=>getPerformance().then(r=>setItems(r.data)).finally(()=>setLoading(false))
  useEffect(()=>{load()},[])

  const filtered=useMemo(()=>items.filter(p=>{
    const q=`${p.studentName} ${p.course}`.toLowerCase().includes(query.toLowerCase())
    return q && (risk==='ALL'||p.riskStatus===risk)
  }),[items,query,risk])

  const remove=async()=>{await deletePerformance(deleteId);setDeleteId(null);load()}

  if(loading)return <Loading text="Loading performance..." />

  return <div className="card">
    <div className="section-heading"><div><h3>Performance Records</h3><p>Review and manage student performance analyses.</p></div><Link className="btn primary" to="/performance/new">+ Analyze Performance</Link></div>
    <div className="filters"><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search student or course..." /></div><select value={risk} onChange={e=>setRisk(e.target.value)}><option value="ALL">All risk levels</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
    <div className="table-wrap"><table><thead><tr><th>Student</th><th>Course</th><th>Overall</th><th>Level</th><th>Risk</th><th>Actions</th></tr></thead><tbody>
      {filtered.map(p=><tr key={p.performanceId}><td><strong>{p.studentName}</strong></td><td>{p.course}</td><td>{p.overallScore}%</td><td><span className="pill neutral">{p.performanceLevel}</span></td><td><span className={`pill ${p.riskStatus.toLowerCase()}`}>{p.riskStatus}</span></td><td className="actions"><Link to={`/performance/${p.performanceId}`} title="View"><Eye size={17}/></Link><button onClick={()=>setDeleteId(p.performanceId)} title="Delete"><Trash2 size={17}/></button></td></tr>)}
    </tbody></table>{filtered.length===0&&<div className="empty">No matching performance records.</div>}</div>
    <Modal open={deleteId!==null} title="Delete Performance" onCancel={()=>setDeleteId(null)} onConfirm={remove} confirmText="Delete">This performance record will be permanently deleted.</Modal>
  </div>
}
