// import React, { useState, useEffect } from 'react';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';
// import { Checkbox, Radio, Spin } from 'antd';
// import { Prices } from '../components/Prices';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/cart';
// import toast from 'react-hot-toast';

// const HomePage = () => {
//     const navigate = useNavigate();
//     const [cart, setCart] = useCart();
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [checked, setChecked] = useState([]);
//     const [radio, setRadio] = useState([]);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(1);
//     const [loading, setLoading] = useState(false);

//     //get all categories
//     const getAllCategory = async () => {
//         try {
//             const { data } = await axios.get("https://ecom-final-fixed-backup.onrender.com/api/v1/category/get-category");
//             if (data?.success) {
//                 setCategories(data?.category);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getAllCategory();
//         getTotal();
//     }, []);

//     //get all products 
//     const getAllProducts = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-list/${page}`);
//             setLoading(false);
//             setProducts(data.products);
//         } catch (error) {
//             setLoading(false);
//             console.log(error);
//         }
//     };

//     //getTotal Count  
//     const getTotal = async () => {
//         try {
//             const { data } = await axios.get('https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-count');
//             setTotal(data?.total);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (page === 1) return;
//         LoadMore();
//     }, [page]);

//     //load more
//     const LoadMore = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-list/${page}`);
//             setLoading(false);
//             setProducts([...products, ...data?.products]);
//         } catch (error) {
//             console.log(error);
//             setLoading(false);
//         }
//     };

//     //filter by category
//     const handleFilter = (value, id) => {
//         let all = [...checked];
//         if (value) {
//             all.push(id);
//         } else {
//             all = all.filter((c) => c !== id);
//         }
//         setChecked(all);
//     };

//     useEffect(() => {
//         if (!checked.length || !radio.length) getAllProducts();
//     }, [checked.length, radio.length]);

//     useEffect(() => {
//         if (checked.length || radio.length) filterProduct();
//     }, [checked, radio]);

//     //get filtered products 
//     const filterProduct = async () => {
//         try {
//             const { data } = await axios.post('https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-filters', { checked, radio });
//             setProducts(data?.products);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     return (
//         <Layout title={"Sagar's Ecom App-Shop Now....."}>
//             <div className="container-fluid row mx-auto">
//                 <div className="col-md-2 col-sm-12">
//                     <h4 className="text-center mt-4" style={{ color: "maroon" }}>Filter By Category</h4>
//                     <hr />
//                     <div className="d-flex flex-column">
//                         {categories?.map((c) => (
//                             <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)} style={{ fontWeight: 'bold' }}>{c.name}</Checkbox>
//                         ))}
//                     </div>

//                     {/* Filter by price  */}
//                     <h4 className="text-center mt-4" style={{ color: "maroon", marginLeft: "-43px" }}>Filter By Price</h4>
//                     <hr />
//                     <div className="d-flex flex-column">
//                         <Radio.Group onChange={e => setRadio(e.target.value)}>
//                             {Prices?.map(p => (
//                                 <div key={p._id}><Radio value={p.array} style={{ fontWeight: 'bold' }}>
//                                     {p.name}</Radio></div>
//                             ))}
//                         </Radio.Group>
//                     </div>
//                     <div className="d-flex mt-3 col-sm-12">
//                         <div className="btn btn-danger" onClick={() => window.location.reload()}>RESET FILTERS</div>
//                     </div>
//                 </div>
//                 <div className="col-md-9 col-sm-12">
//                     <h1 className="text-center mt-4">All Products</h1>
//                     <div style={{ position: 'relative', minHeight: '50vh' }}>
//                         {loading && (
//                             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', width: '100%', zIndex: 10 }}>
//                                 <Spin size="large" style={{ fontSize: '5em' }} />
//                             </div>
//                         )}
//                         <div className={`d-flex flex-wrap justify-content-center ${loading ? 'opacity-50' : ''}`}>
//                             {products?.map((p) => (
//                                 <div key={p._id} className="card m-3" style={{ width: "20rem" }}>
//                                     <img
//                                         src={`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-photo/${p._id}`}
//                                         className="card-img-top"
//                                         alt={p.name}
//                                         style={{ width: '100%', height: '300px', objectFit: 'cover', padding: '1px', borderRadius: "4px" }}
//                                         onMouseOver={(e) => e.target.style.transform = 'scale(0.985)'}
//                                         onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//                                     />
//                                     <hr style={{ margin: '0px', color: "gray" }} />
//                                     <div className="card-body" style={{ backgroundColor: 'orange', borderRadius: "0 0 3px 3px" }}>
//                                         <h5 className="card-title">{p.name}</h5>
//                                         <p className="card-text">
//                                             {p.description.substring(0, 50)}...
//                                         </p>
//                                         <h5 className="card-text" style={{ fontWeight: 'bold', color: 'black' }}>₹{p.price}</h5>

//                                         <div className='d-flex justify-content-between'>
//                                             <button className="btn btn-primary ms-1 mb-2" onClick={() => navigate(`/product/${p.slug}`)}>MORE DETAILS</button>

//                                             <button className="btn btn-success ms-3 mb-2" onClick={() => {
//                                                 setCart([...cart, p]);
//                                                 localStorage.setItem("cart", JSON.stringify([...cart, p]));
//                                                 toast.success('Item Added to Cart');
//                                             }}>ADD TO CART</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div>
//                         {products && products.length < total && (
//                             <div className="card m-2" style={{ width: "14rem", backgroundColor: 'transparent', border: 'none' }}>
//                                 <button className='deshome btn btn-dark mb-5 mt-3 mx-auto' onClick={(e) => {
//                                     e.preventDefault();
//                                     setPage(page + 1);
//                                 }}>
//                                     {loading ? "Loading..." : "Load More"}
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default HomePage;


import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';


const HomePage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Get all categories
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("https://ecom-final-fixed-backup.onrender.com/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    // Get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    // Get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get('https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-count');
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        LoadMore();
    }, [page]);

    // Load more products
    const LoadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts((prevProducts) => [...prevProducts, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // Filter by category
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };

    // Filter products
    const filterProduct = async () => {
        try {
            const { data } = await axios.post('https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-filters', { checked, radio });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    return (
        <Layout title={"Sagar's Ecom App - Shop Now"}>
            <div className="container-fluid row mx-auto">
                <div className="col-md-2 col-sm-12">
                    <h4 className="text-center mt-4" style={{ color: "maroon" }}>Filter By Category</h4>
                    <hr />
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)} style={{ fontWeight: 'bold' }}>{c.name}</Checkbox>
                        ))}
                    </div>

                    {/* Filter by price */}
                    <h4 className="text-center mt-4" style={{ color: "maroon", marginLeft: "-43px" }}>Filter By Price</h4>
                    <hr />
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array} style={{ fontWeight: 'bold' }}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex mt-3 col-sm-12">
                        <div className="btn btn-danger" onClick={() => window.location.reload()}>RESET FILTERS</div>
                    </div>
                </div>

                <div className="col-md-9 col-sm-12">
                    <h1 className="text-center mt-4">All Products</h1>
                    <div className="d-flex flex-wrap justify-content-center">
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                <Spin size="large" style={{ fontSize: '5em' }} />
                            </div>
                        ) : (
                            products.map((p) => (
                                <div 
                                    key={p._id} 
                                    className="card m-3" 
                                    style={{
                                        width: "18rem", 
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                                        transition: "transform 0.2s, box-shadow 0.2s"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <div style={{ padding: '10px' }}>
                                        <img
                                            src={`https://zorox-intern-project.onrender.com/api/v1/product/product-photo/${p._id}`}
                                            alt={p.name}
                                            style={{
                                                width: '100%',
                                                height: '220px',
                                                objectFit: 'contain',
                                                borderRadius: "6px",
                                            }}
                                        />
                                    </div>
                                    <div className="card-body" style={{ 
                                        backgroundColor: '#f9f9f9', 
                                        padding: '1rem', 
                                        borderRadius: "0 0 8px 8px" 
                                    }}>
                                        <h5 className="card-title" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>{p.name}</h5>
                                        <p className="card-text" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                            {p.description.substring(0, 50)}...
                                        </p>
                                        <h5 className="card-text price" style={{ fontWeight: 'bold', color: '#2d3436' }}>₹{p.price}</h5>
                                        <div className='d-flex justify-content-between'>
                                            <button 
                                                className="btn btn-primary ms-1 mb-2" 
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                                style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    backgroundColor: '#0056b3',
                                                    borderColor: '#0056b3',
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#004494'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
                                            >
                                                MORE DETAILS
                                            </button>
                                            <button 
                                                className="btn btn-success ms-3 mb-2" 
                                                onClick={() => {
                                                    setCart([...cart, p]);
                                                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                                    toast.success('Item Added to Cart');
                                                }}
                                                style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    backgroundColor: '#28a745',
                                                    borderColor: '#28a745',
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                                            >
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div>
                        {products && products.length < total && (
                            <div className="card m-2" style={{ width: "14rem", backgroundColor: 'transparent', border: 'none' }}>
                                <button 
                                    className='deshome btn btn-dark mb-5 mt-3 mx-auto' 
                                    onClick={() => setPage((prevPage) => prevPage + 1)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
