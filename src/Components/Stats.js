import React, { useEffect, useState } from 'react'
import './Stats.css'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BookIcon from '@material-ui/icons/Book';
import axios from 'axios'

function Stats() {
    const API_URL = process.env.REACT_APP_API_URL
    const [loading, setLoading] = useState(true)
    const [totalBooks, setTotalBooks] = useState(0)
    const [totalStudents, setTotalStudents] = useState(0)
    const [totalBorrowed, setTotalBorrowed] = useState(0)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            try {
                // Total books (number of book records)
                const booksRes = await axios.get(API_URL + 'api/books/allbooks')
                const books = booksRes.data || []
                setTotalBooks(books.length)

                // Total members (filter students)
                const membersRes = await axios.get(API_URL + 'api/users/allmembers')
                const members = membersRes.data || []
                const studentsCount = members.filter(m => m.userType === 'student').length
                setTotalStudents(studentsCount)

                // Total currently borrowed books (active issued transactions)
                const transRes = await axios.get(API_URL + 'api/transactions/all-transactions')
                const transactions = transRes.data || []
                const borrowed = transactions.filter(t => t.transactionStatus === 'Active' && t.transactionType === 'Issued').length
                setTotalBorrowed(borrowed)
            }
            catch (err) {
                console.error('Error fetching stats', err)
            }
            setLoading(false)
        }

        fetchStats()
        // optionally poll or refetch on events; for now run once on mount
    }, [API_URL])

    return (
        <div className='stats'>
            <div className='stats-block'>
                <LibraryBooksIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Total Books</p>
                <p className='stats-count'>{loading ? '...' : totalBooks}</p>
            </div>
            <div className='stats-block'>
                <LocalLibraryIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Total Students</p>
                <p className='stats-count'>{loading ? '...' : totalStudents}</p>
            </div>
            <div className='stats-block'>
                <BookIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Books Borrowed</p>
                <p className='stats-count'>{loading ? '...' : totalBorrowed}</p>
            </div>
        </div>
    )
}

export default Stats