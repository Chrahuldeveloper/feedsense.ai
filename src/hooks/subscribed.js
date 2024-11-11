import { useEffect, useState } from "react";
import dbService from "../../src/firebase/utils/db";

const useSubscribe = () => {
  const [loading, setLoading] = useState(true);
  const [subcribe, setsubcribe] =
    (useState < boolean) | (undefined > undefined);

  useEffect(() => {
    const db = new dbService();

    const checkSubscription = async () => {
      try {
        const isSubcribe = await db.isSubscribed();
        setsubcribe(isSubcribe);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    checkSubscription();
  }, [setsubcribe]);

  return { loading, subcribe };
};

export default useSubscribe;
