import React, { useState, useContext } from 'react'
import '../AdminDashboard.css'
import axios from 'axios'
import { AuthContext } from '../../../../Context/AuthContext'
import { useToast } from '../../../../Context/ToastContext'

function BulkBooks() {
    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)
    const [file, setFile] = useState(null)
    const [previewRows, setPreviewRows] = useState([])
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast()

    const onFileChange = (e) => {
        const f = e.target.files[0]
        if (!f) return
        // accept only excel
        const allowed = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel']
        if (!allowed.includes(f.type) && !f.name.match(/\.(xlsx|xls)$/i)) {
            addToast('Please upload an Excel file (.xlsx or .xls)', { type: 'error' })
            return
        }
        setFile(f)
        parseExcel(f)
    }

    const parseExcel = async (f) => {
        try {
            const XLSX = await import('xlsx')
            const data = await f.arrayBuffer()
            const workbook = XLSX.read(data)
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            console.log("sheetName==",sheetName)
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
            // rows is an array of objects where keys are headers
            setPreviewRows(rows)
        }
        catch (err) {
            console.error(err)
            // avoid showing raw error that may contain localhost urls
            addToast('Failed to parse Excel file. Please check the file format.', { type: 'error' })
        }
    }

    const addAllBooks = async () => {
        if (previewRows.length === 0) {
            addToast('No rows to add', { type: 'info' })
            return
        }
        setLoading(true)

        // Map rows to BookData objects
        const booksPayload = previewRows.map(row => ({
            bookName: row.bookName || row['BookName'] || row.title || '',
            alternateTitle: row.alternateTitle || row['AlternateTitle'] || row.bookName || '',
            author: row.author || row['Author'] || 'Dummy_author',
            bookCountAvailable: row.bookCountAvailable || row['Copies'] || row.copies || 1,
            language: row.language || row['Language'] || '',
            price: row.price || row['Price'] || 0,
            publisher: row.publisher || row['Publisher'] || '',
            categories: row.categories ? row.categories.split(',').map(c => c.trim()) : [],
            isAdmin: user.isAdmin
        }))

        try {
            // Single bulk POST - backend should expose this endpoint to accept an array of books
            const res = await axios.post(API_URL + 'api/books/addbook',  booksPayload )

            // If backend returns counts or created items, use them. Otherwise assume success.
            let added = 0
            console.log("resssss====",res)
            if (res) {
                if (Array.isArray(res.data.inserted)) {
                    added = res.data.inserted.length
                }
                else  {
                    added =1
                }
            }

            setLoading(false)
            addToast(`Bulk add complete. ${added} books added.`, { type: 'success' })
            // Optionally clear preview
            setPreviewRows([])
            setFile(null)
        }
        catch (err) {
            console.error('Bulk add failed', err)
            setLoading(false)
            const raw = err?.response?.data?.message || err?.message || 'Bulk add failed'
            // sanitize message: remove same-origin URLs like http://localhost:3000
            const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : ''
            let cleaned = raw.toString()
            if (origin) {
                cleaned = cleaned.replace(new RegExp(origin, 'gi'), '')
            }
            // also remove plain localhost:port occurrences
            cleaned = cleaned.replace(/https?:\/\/(localhost:[0-9]+)/gi, '').replace(/localhost:[0-9]+/gi, '')
            cleaned = cleaned.trim()
            addToast(cleaned || 'Bulk add failed', { type: 'error' })
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h3>Add Books -Bulk(Excel)</h3>
            <p>Upload an Excel (.xlsx/.xls) file. First sheet will be parsed. Column headers supported: bookName / Book Name / title, author, Copies, price, Publisher, categories (comma separated).</p>
            <input type='file' accept='.xlsx,.xls' onChange={onFileChange} />
            <div style={{ marginTop: 20 }}>
                <h4>Preview ({previewRows.length} rows)</h4>
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                    <table className='admindashboard-table' style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Book Name</th>
                                <th>Author</th>
                                <th>Copies</th>
                                <th>Categories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewRows.map((r, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{r.bookName || r['BookName'] || r.title}</td>
                                    <td>{r.author || r['Author']}</td>
                                    <td>{r.bookCountAvailable || r['Copies'] || r.copies || 1}</td>
                                    <td>{r.categories || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ marginTop: 12 }}>
                    <button onClick={addAllBooks} disabled={loading || previewRows.length === 0}>Add Books</button>
                </div>
            </div>
        </div>
    )
}

export default BulkBooks
