import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { useToast } from '../../../../Context/ToastContext'
import { Dropdown } from 'semantic-ui-react'

function AddBook() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)
    const { addToast } = useToast()

    const [bookName, setBookName] = useState("")
    const [bookId, setBookId] = useState("")
    const [alternateTitle, setAlternateTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [bookCountAvailable, setBookCountAvailable] = useState(null)
    const [language, setLanguage] = useState("")
    const [price, setPrice] = useState("")
    const [publisher, setPublisher] = useState("")
    const [allCategories, setAllCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [recentAddedBooks, setRecentAddedBooks] = useState([])


    /* Fetch all the Categories */
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories")
                const all_categories = await response.data.map(category => (
                    { value: `${category._id}`, text: `${category.categoryName}` }
                ))
                setAllCategories(all_categories)
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllCategories()
    }, [API_URL])

    /* Adding book function */
    const addBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const BookData = {
            bookName: bookName,
            alternateTitle: alternateTitle,
            author: author,
            bookCountAvailable: bookCountAvailable,
            language: language,
            price: price,
            publisher: publisher,
            categories: selectedCategories,
            isAdmin: user.isAdmin
        }
        try {
            const response = await axios.post(API_URL + "api/books/addbook", BookData)
            if (recentAddedBooks.length >= 5) {
                recentAddedBooks.splice(-1)
            }
            setRecentAddedBooks([response.data, ...recentAddedBooks])
            setBookName("")
            setAlternateTitle("")
            setAuthor("")
            setBookCountAvailable(null)
            setLanguage("")
            setPrice("")
            setPublisher("")
            setSelectedCategories([])
            addToast("Book Added Successfully 🎉", { type: 'success' })
        }
        catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }


    useEffect(() => {
        const getallBooks = async () => {
            const response = await axios.get(API_URL + "api/books/allbooks")
            setRecentAddedBooks(response.data.slice(0, 5))
        }
        getallBooks()
    }, [API_URL])


    return (
        <div>
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>
                <div className="addbook-form-grid">
                    <div>
                        <label className="addbook-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label>
                        <input className="addbook-form-input" type="text" name="bookName" value={bookName} onChange={(e) => { setBookName(e.target.value) }} required />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="alternateTitle">Alternate Title</label>
                        <input className="addbook-form-input" type="text" name="alternateTitle" value={alternateTitle} onChange={(e) => { setAlternateTitle(e.target.value) }} />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="author">Author Name<span className="required-field">*</span></label>
                        <input className="addbook-form-input" type="text" name="author" value={author} onChange={(e) => { setAuthor(e.target.value) }} required />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="language">Language</label>
                        <input className="addbook-form-input" type="text" name="language" value={language} onChange={(e) => { setLanguage(e.target.value) }} />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="price">Price</label>
                        <input className="addbook-form-input" type="text" name="price" value={price} onChange={(e) => { setPrice(e.target.value) }} />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="publisher">Publisher</label>
                        <input className="addbook-form-input" type="text" name="publisher" value={publisher} onChange={(e) => { setPublisher(e.target.value) }} />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="copies">No.of Copies Available<span className="required-field">*</span></label>
                        <input className="addbook-form-input" type="text" name="copies" value={bookCountAvailable} onChange={(e) => { setBookCountAvailable(e.target.value) }} required />
                    </div>

                    <div>
                        <label className="addbook-form-label" htmlFor="categories">Categories<span className="required-field">*</span></label>
                        <div className="semanticdropdown">
                            <Dropdown
                                placeholder='Category'
                                fluid
                                multiple
                                search
                                selection
                                options={allCategories}
                                value={selectedCategories}
                                onChange={(event, value) => setSelectedCategories(value.value)}
                            />
                        </div>
                    </div>

                    <div className="full-width" style={{ textAlign: 'center' }}>
                        <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading} />
                    </div>
                </div>
            </form>
            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>S.No</th>
                        <th>Book Name</th>
                        <th>Added Date</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.createdAt.substring(0, 10)}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default AddBook