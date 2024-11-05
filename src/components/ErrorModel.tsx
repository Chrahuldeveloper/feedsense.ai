import React from "react";
import { ImSad } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

interface props {
  message: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorModel: React.FC<props> = ({ message, setError }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-75 backdrop-blur-md">
      <div className="bg-[#121212]  w-[85vw] md:w-[60vw] lg:w-[40vw] xl:w-[30vw] p-6 rounded-md ">
        <div className="flex justify-end">
          <RxCross2
            onClick={() => {
              setError(false);
            }}
            size={25}
            color="white"
            cursor={"pointer"}
          />
        </div>
        <div className="flex flex-col items-center">
          <ImSad size={31} color="white" />
          <h1 className="text-red-500 font-semibold text-lg text-center my-3">
            {message || "Oops there was an error!"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ErrorModel;
