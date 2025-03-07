import Layout from '../components/Layout/Layout'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react"
import axios from 'axios';
import toast from 'react-hot-toast';


const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [instance, setInstance] = useState("");

    const navigate = useNavigate();

    //for updating the cart element quantity thorugh + and - button
    const updateCartItemQuantity = (productId, newQuantity) => {
        try {
            let myCart = [...cart];
            const index = myCart.findIndex(item => item._id === productId);
            if (index !== -1) {
                myCart[index].quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
                setCart(myCart);
                localStorage.setItem("cart", JSON.stringify(myCart));
            }
        } catch (error) {
            console.log(error);
        }
    };


    // //total price
    // const totalPrice = () => {
    //     try {
    //         let total = 0;
    //         cart?.map((item) => {
    //             total = total + item.price;
    //             return null; // Add a return statement here
    //         });
    //         return total.toLocaleString("en-IN", {
    //             style: "currency",
    //             currency: "INR",
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

        // //total price
    const totalPrice = () => {
    try {
        let total = 0;
        cart?.forEach((item) => { 
            total += item.price * (item.quantity || 1); // Ensure quantity is considered
        });
        return total.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
        });
    } catch (error) {
        console.log(error);
        return "₹0.00"; // Return a default value if error occurs
    }
};

    
    //detele item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };


    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get("https://ecom-final-fixed-backup.onrender.com/api/v1/product/braintree/token");
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token])


    //handle payments
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post("https://ecom-final-fixed-backup.onrender.com/api/v1/product/braintree/payment", {
                nonce,
                cart,
            });
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment Completed Successfully ");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container" >
                <div className="row mt-2">
                    <div className="col-md-12" >
                        <div className="text-center p-2 " >
                            <span style={{ fontWeight: 'bold', color: "red", borderRadius: '5px', fontSize: "28px" }}>{`Welcome ${auth?.token && auth?.user?.name}`}</span>
                        </div>
                        <div className="text-center p-2 " style={{ color: "black", borderRadius: '5px', fontSize: "16px" }}>
                            {cart?.length ? (
                                <p style={{ border: "2px solid lightblue", fontSize: "20px", padding: "6px", backgroundColor: "lightblue", borderRadius: "4px" }}>
                                    You Have {cart.length} items in your cart{auth?.token ? "" : " Please login to checkout"}
                                </p>
                            ) : (
                                <span style={{ fontSize: "20px", border: "2px solid lightblue", padding: "8px", backgroundColor: "lightblue", borderRadius: "4px" }}>
                                    Your Cart Is Empty
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row mt-3" >

                    <div className="col-md-7 p-4 mb-5" >
                        {cart?.map((p) => (
                            <div className="row mb-4 m-1 p-3 card flex-md-row flex-column align-items-center" key={p._id} style={{ backgroundColor: "#F2F2F2" }}>
                                <div className="col-md-4 mb-4 mb-md-0">
                                    <img
                                        src={`https://ecom-final-fixed-backup.onrender.com/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top mt-3 mb-3"
                                        alt={p.name}
                                        style={{ maxWidth: "100%", borderRadius: "4px", height: "auto", transition: "transform 0.2s ease-in-out" }}
                                        onMouseOver={(e) => { e.target.style.transform = "scale(1.1)"; }}
                                        onMouseOut={(e) => { e.target.style.transform = "scale(1)"; }}
                                    />
                                </div>
                                <div className="col-md-8 mt-3 mt-md-0 ">
                                    <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{p.name}</p>
                                    <p style={{ marginBottom: "0.5rem" }}>{p.description.substring(0, 50)}</p>
                                    <p style={{ color: "red", fontWeight: "bold", marginBottom: "1rem" }}>Price: ₹{p.price}</p>

                                    <div className="d-flex align-items-center mb-2">
                                        Quantity: &nbsp;  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => updateCartItemQuantity(p._id, p.quantity - 1)}>-</button>
                                        <span className="me-2">{p.quantity}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateCartItemQuantity(p._id, p.quantity + 1)}>+</button>
                                    </div>
                                    <button className="btn btn-danger mb-2 mt-3 mx-3" onClick={() => removeCartItem(p._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-1"></div>
                    <div className="col-md-4 text-center">
                        <h2>Cart Summary </h2>
                        <p>Total |  Checkout | Payment</p>
                        <hr />
                        <h4>Total : <span className='text-danger'>{totalPrice()} </span></h4>
                        {auth?.user?.address ? (
                            <>
                                <div className="mb-3">
                                    <h5>Current Address :{auth?.user?.address} </h5>
                                    <button className='btn btn-warning'
                                        onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                                </div></>
                        ) : (
                            <div className="mb-3">
                                {auth?.token ? (
                                    <button class='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}></button>
                                ) : (
                                    <button className='btn btn-warning' onClick={() => navigate('/login', { state: "/cart" })}>Please Login to checkout</button>
                                )}
                            </div>
                        )}
                        <div className="mt-4">
                            {!clientToken || !cart?.length ? ("") : (
                                <>
                                    <DropIn
                                        options={{
                                            authorization: clientToken,
                                            paypal: {
                                                flow: "vault",
                                            },
                                        }}
                                        onInstance={(instance) => setInstance(instance)}
                                    />

                                    <button
                                        className="btn btn-primary mb-4"
                                        onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address}
                                    >
                                        {loading ? "Processing... " : 'Make payment'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default CartPage
