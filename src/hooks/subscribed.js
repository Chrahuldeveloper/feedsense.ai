import { useEffect, useState } from "react";
import dbService from "../../src/firebase/utils/db";
const useSubscribe = () => {
  const [loading, setLoading] = useState(true);
  const [subcribe, setsubcribe] = useState();

  const db = new dbService();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const isSubcribe = await db.isSubscribed();
        setsubcribe(isSubcribe);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    checkSubscription();
  }, []);

  return { loading, subcribe };
};

export default useSubscribe;
