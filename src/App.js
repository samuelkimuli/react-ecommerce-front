import React,{  useEffect, lazy, Suspense } from "react";
import {Switch,Route} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { currentUser } from "./functions/auth";
import { LoadingOutlined } from "@ant-design/icons";

// import Header  from "./components/nava/Header";
// import RegisterComplete from "./pages/auth/RegisterComplete";
// import Register from "./pages/auth/Register";
// import Home from "./pages/Home";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import Login from "./pages/auth/Login";
// import History from "./pages/user/History";
// import UserRoute from "./components/routes/UserRoute";
// import Password from "./pages/user/Password";
// import Wishlist from "./pages/user/Wishlist";
// import AdminRoute from "./components/routes/AdminRoute";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import CategoryCreate from "./pages/admin/category/CategoryCreate";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
// import SubCreate from "./pages/admin/sub/SubCreate";
// import SubUpdate from "./pages/admin/sub/SubUpdate";
// import ProductCreate from "./pages/admin/product/ProductCreate";
// import AllProducts from "./pages/admin/product/AllProducts";
// import ProductUpdate from "./pages/admin/product/ProductUpdate";
// import Product from "./pages/Product";
// import CategoryHome from "./pages/category/CategoryHome";
// import SubHome from "./pages/sub/SubHome";
// import Shop from "./pages/Shop";
// import Cart from "./pages/Cart";
// import SideDrawer from "./components/drawer/SideDrawer";
// import Checkout from "./pages/Checkout";
// import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";
// import Payment from "./pages/Payment";


//using lazy
const Header  = lazy(() => import("./components/nava/Header"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const Register = lazy(() => import("./pages/auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Login = lazy(() => import("./pages/auth/Login"));
const History = lazy(() => import("./pages/user/History"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() => import("./pages/admin/category/CategoryCreate"));
const CategoryUpdate = lazy(() => import("./pages/admin/category/CategoryUpdate"));
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() => import("./pages/admin/coupon/CreateCouponPage"));
const Payment = lazy(() => import("./pages/Payment"));

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
     const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if(user){
          const idTokenResult = await user.getIdTokenResult()
          console.log("user", user)

          currentUser(idTokenResult.token)
          .then((res) => {
            const{name,email,role,_id} = res.data
            console.log(res.data)
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: name,
                email: email,
                token: idTokenResult.token,
                role: role,
                _id: _id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
     //cleanup
     return () => unsubscribe()
  },[dispatch])
  return (
    <Suspense
    fallback={
      <div className="col text-center p-5">
        __ React Redux EC
        <LoadingOutlined />
        MMERCE __
      </div>
    }
    >
      <Header/>
      <SideDrawer />
      <ToastContainer/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/register/complete" component={RegisterComplete}/>
        <Route exact path="/forgot/password" component={ForgotPassword}/>
        <UserRoute exact path="/user/history" component={History}/>
        <UserRoute exact path="/user/password" component={Password}/>
        <UserRoute exact path="/user/wishlist" component={Wishlist}/>
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}/>
        <AdminRoute exact path="/admin/category" component={CategoryCreate}/>
        <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate}/>
        <AdminRoute exact path="/admin/sub" component={SubCreate}/>
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate}/>
        <AdminRoute exact path="/admin/product" component={ProductCreate}/>
        <AdminRoute exact path="/admin/products" component={AllProducts}/>
        <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate}/>
        <Route exact path="/product/:slug" component={Product}/>
        <Route exact path="/category/:slug" component={CategoryHome}/>
        <Route exact path="/sub/:slug" component={SubHome}/>
        <Route exact path="/shop" component={Shop}/>
        <Route exact path="/cart" component={Cart}/>
        <UserRoute exact path='/checkout' component={Checkout}/>
        <AdminRoute exact path="/admin/coupon" component={CreateCouponPage}/>
        <UserRoute exact path='/payment' component={Payment}/>
      </Switch>
    </Suspense>
    
  );
}

export default App;
