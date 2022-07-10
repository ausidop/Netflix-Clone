import { loadStripe } from "@stripe/stripe-js";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setPlan } from "../features/userSlice";
import db from "../firebase";
import "./PlanScreen.css";

function PlanScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    getDocs(collection(db, "customers", user.uid, "subscriptions")).then(
      (querySnapshot) => {
        const subscription_arr = [];
        querySnapshot.forEach(async (temp_subscription) => {
          subscription_arr.push({
            role: temp_subscription.data().role,
            current_period_end:
              temp_subscription.data().current_period_end.seconds,
            current_period_start:
              temp_subscription.data().current_period_start.seconds,
          });
        });
        let temp = subscription_arr[0];
        subscription_arr.map((subscriptionSlice) => {
          if (
            subscriptionSlice.current_period_start > temp.current_period_start
          ) {
            temp = subscriptionSlice;
          }
        });
        setSubscription(temp);
        dispatch(setPlan(temp.role));
      }
    );
  }, [user.uid]);

  useEffect(() => {
    getDocs(
      query(collection(db, "products"), where("active", "==", true))
    ).then((querySnapshot) => {
      const temp_products = {};
      querySnapshot.forEach(async (productDoc) => {
        temp_products[productDoc.id] = productDoc.data();
        const priceSnap = await getDocs(collection(productDoc.ref, "prices"));
        priceSnap.docs.forEach((price) => {
          temp_products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data(),
          };
        });
      });
      setProducts(temp_products);
    });
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await addDoc(
      collection(db, "customers", user.uid, "checkout_sessions"),
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    onSnapshot(docRef, async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`An error occured: ${error.message}`);
      }

      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51L6mBBHDH6JFaXcK0hyRwzXPpFrSdL5en2VpbPQVv7Rq8uDdnA0xf8xgziGAcJzc7gRmwlpZ3YwUE5DtowvZTB9Q00UpeIfbk8"
        );

        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="planScreen">
      <br />
      {subscription && (
        <p>
          Renewel date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            className={`${
              isCurrentPackage && "planScreen__plan--disabled"
            } planScreen__plan`}
            key={productId}
          >
            <div className="planScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlanScreen;
