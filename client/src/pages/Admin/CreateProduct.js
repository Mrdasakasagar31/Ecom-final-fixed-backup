import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Option } = Select


const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [photo, setPhoto] = useState("")
    const [quantity, setQuantity] = useState("")
    const [shipping, setShipping] = useState("")

    //get all categories 
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get('https://ecom-final-fixed-backup.onrender.com/api/v1/category/get-category');
            if (data?.success) {
                setCategories(data?.category);
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Something went wrong in getting category ")
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    //create product function
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData()
            productData.append("name", name)
            productData.append("description", description)
            productData.append("price", price)
            productData.append("quantity", quantity)
            productData.append("photo", photo)
            productData.append("category", category)

            const { data } = axios.post('https://ecom-final-fixed-backup.onrender.com/api/v1/product/create-product', productData)

            if (data?.success) {
                toast.error(data?.message)

            }
            else {
                toast.success('Product Created Successfully ')
                navigate('/dashboard/admin/products')
            }
        }
        catch (error) {
            console.log(error)
            toast.error('Something Went wrong ')
        }

    }

    return (

        <Layout title={"Dashboard- Create Product"}>
            <div className="container-fluid p-3">
                <div className="row mx-3">
                    <div className="col-lg-3 col-md-4 mx-lg-4">
                        <AdminMenu />
                    </div>
                    <div className="col-lg-6 col-md-8 ">
                        <h1 className='mb-4 mx-4 mx-lg-0 mt-4 mt-sm-0'>Create Product</h1>
                        <div className="w-100 ">
                            <Select variant={false} placeholder="Select a Category" size="large" showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }} >
                                {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-100 mb-3">
                            <label className='btn btn-outline-secondary'>
                                {photo ? photo.name : "Upload Photo"}
                                <input type="file" name="photo" accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                            </label>
                        </div>
                        <div className="w-100 mb-3">
                            {photo && (
                                <div className="text-center">
                                    <img src={URL.createObjectURL(photo)} alt='product_photo' height={"200px"} className='img img-responsive' />
                                </div>
                            )}
                        </div>
                        <div className="w-100 mb-3">
                            <input type="text" value={name} placeholder='Write a name' className='form-control' onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="w-100 mb-3">
                            <textarea type="text" value={description} placeholder="Write a description" className="form-control" onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="w-100 mb-3">
                            <input type="number" value={price} placeholder="Write a price" className="form-control" onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className="w-100 mb-3">
                            <input type="number" value={quantity} placeholder="Write a quantity" className="form-control" onChange={(e) => setQuantity(e.target.value)} />
                        </div>
                        <div className="w-100 mb-3">
                            <Select variant={false} placeholder="Select Shipping" size="large" showSearch className="form-select mb-3" onChange={(value) => { setShipping(value); }}>
                                <Option value="0">No</Option>
                                <Option value="1">Yes</Option>
                            </Select>
                        </div>
                        <div className="w-100 mb-3">
                            <button className="btn btn-primary" onClick={handleCreate}>CREATE PRODUCT</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default CreateProduct
